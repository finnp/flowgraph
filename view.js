var EventEmitter = require('events').EventEmitter
var inherits = require('inherits')
var delegate = require('delegate-dom')

var h = require('virtual-hyperscript-svg')
var diff = require('virtual-dom/diff')
var patch = require('virtual-dom/patch')
var createElement = require('virtual-dom/create-element')

var edge = require('./edge.js')
var renderEdge = edge.render
var renderCurve = edge.renderCurve

var renderNode = require('./node.js')

module.exports = FlowGraphView

inherits(FlowGraphView, EventEmitter)

function FlowGraphView(data) {
  this.data = data
  this.tree = this.render()
  this.svg = createElement(this.tree)
  document.body.appendChild(this.svg)
  this.registerHandlers()
}

FlowGraphView.prototype.render = function() {
  var domNodes = this.data.edges
    .map(renderEdge.bind(this, this.data))

  var fromId = this.data.connector.from
  var fromNode = this.data.getNode(fromId)
  
  if(this.data.connector.active) {
    var line = renderCurve(
      {
        x: fromNode.x + (this.data.connector.isInput ? 0 : 100),
        y: fromNode.y + 50
      },
      this.data.connector.to,
      'connector'
    )
    domNodes.push(line)
  }
  domNodes = domNodes.concat(this.data.nodes.map(renderNode))
  var svg = h('svg', {}, domNodes)
  return svg
}

FlowGraphView.prototype.registerHandlers = function() {
  var self = this
  var data = this.data

  setInterval(function () {
    var newTree = this.render()
    var patches = diff(this.tree, newTree)
    this.svg = patch(this.svg, patches)
    this.tree = newTree
  }.bind(this), 50)
  
  
  delegate.on(this.svg, '.node rect, .node text', 'click', function (e) {
    var id = e.target.parentNode.getAttribute('id')
    self.emit('node-select', data.getNode(id))
  })
  
  delegate.on(this.svg, '.node rect, .node text', 'mousedown', function (e) {
    var id = e.target.parentNode.getAttribute('id')

    document.onmousemove = moveObject
    var moved = data.getNode(id)
    function moveObject(e) {
      moved.x = e.pageX - 50
      moved.y = e.pageY - 50
    }
  })

  delegate.on(this.svg, '.node circle', 'mouseover', function (e) {
    var id = e.target.parentNode.getAttribute('id')
    var isInput = hasClass(e.target, 'input')
    var fromId = data.connector.from
    var compatible = data.connector.isInput !== isInput
    if(data.connector.active && compatible) {
      stopDrag()
      data.edges.push({
        from: isInput ? data.connector.from : id,
        to: isInput ? id : data.connector.from
      })
    }
  })

  delegate.on(this.svg, '.node circle', 'mousedown', function (e) {
    var id = e.target.parentNode.getAttribute('id')
    var isInput = hasClass(e.target, 'input')

    document.onmousemove = moveLine
    data.connector.from = id
    data.connector.isInput = isInput
    data.connector.active = true
    data.connector.to.x = 0
    data.connector.to.y = 0
    function moveLine(e) {
      data.connector.to.x = e.pageX
      data.connector.to.y = e.pageY
    }
  })

  document.body.addEventListener('mouseup', stopDrag)

  function stopDrag() {
    document.onmousemove = function () {}
    data.connector.active = false
  }
}


function hasClass(element, className) {
  return element.getAttribute('class').split(' ').indexOf(className) > -1
}