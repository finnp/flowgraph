var delegate = require('delegate-dom')
var indexArray = require('index-array')

var h = require('virtual-hyperscript-svg')
var diff = require('virtual-dom/diff')
var patch = require('virtual-dom/patch')
var createElement = require('virtual-dom/create-element')

var edge = require('./edge.js')
var renderEdge = edge.render
var renderCurve = edge.renderCurve


var data = {
  nodes: [
    {id: 'A', x: 0, y: 0},
    {id: 'B', x: 100, y:100},
    {id: 'C', x: 300, y:100}
  ],
  edges: [
    {from: 'A', to: 'B'}
  ],
  connector: {
    active: false,
    from: {},
    to: {}
  }
}

function render(data) {
  var domNodes = data.edges.map(renderEdge.bind(this, data))
    .concat(data.nodes.map(renderNode))
    
  var fromId = data.connector.from
  var fromNode = indexArray(data.nodes, 'id')[fromId]
  
  if(data.connector.active) {
    var line = renderCurve(
      {
        x: fromNode.x + (data.connector.isInput ? 0 : 100),
        y: fromNode.y + 50
      },
      data.connector.to,
      'connector'
    )
    domNodes.push(line)
  }
  var svg = h('svg', {}, domNodes)
  return svg
}

function renderNode(node) {
  var rect = h('rect', {
    x: 0,
    y: 0,
    width: 100,
    height: 100
  })
  var leftDot = h('circle', {
    class: 'input',
    cx: 0,
    cy: 50,
    r: 5
  })
  var rightDot = h('circle', {
    class: 'output',
    cx: 100,
    cy: 50,
    r: 5
  })
  var text = h('text', {x: 50, y: 50}, node.id)
  var domNode = h('g', {
    id: node.id,
    class: 'node',
    transform: 'translate(' + node.x + ',' + node.y + ')'
  },[
    rect,
    leftDot,
    rightDot
  ])
  return domNode
}

var tree = render(data)
var svg = createElement(tree)
document.body.appendChild(svg)

setInterval(function () {
  var newTree = render(data)
  var patches = diff(tree, newTree)
  svg = patch(svg, patches)
  tree = newTree
}, 50)

// event handlers

delegate.on(svg, '.node rect', 'mousedown', function (e) {
  var id = e.target.parentNode.getAttribute('id')

  document.onmousemove = moveObject
  var moved = indexArray(data.nodes, 'id')[id]
  function moveObject(e) {
    moved.x = e.pageX - 50
    moved.y = e.pageY - 50
  }
})

delegate.on(svg, '.node circle', 'mouseover', function (e) {
  var id = e.target.parentNode.getAttribute('id')
  var isInput = e.target.getAttribute('class') === 'input'
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

delegate.on(svg, '.node circle', 'mousedown', function (e) {
  var id = e.target.parentNode.getAttribute('id')
  var isInput = e.target.getAttribute('class') === 'input'

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

