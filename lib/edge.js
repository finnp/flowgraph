var h = require('virtual-hyperscript-svg')
var indexArray = require('index-array')

exports.render = renderEdge
exports.renderCurve = renderCurve

function renderEdge(data, edge) {
  var sourceNode = data.getNode(edge.source.id)
  var targetNode = data.getNode(edge.target.id)
  
  var sourcePort = edge.source.port
  var targetPort = edge.target.port
  
  var sourcePos = sourceNode.outports.indexOf(sourcePort)
  var targetPos = targetNode.inports.indexOf(targetPort)
  
  var source = {
    x: sourceNode.x + 100,
    y: sourceNode.y + ((sourcePos+ 1) * 100 / (sourceNode.outports.length+1))
  }
  var target = {
    x: targetNode.x,
    y: targetNode.y + ((targetPos + 1) * 100 / (targetNode.inports.length+1))
  }
  
  var classes = [
    'edge'
    ,'edge-' + sourceNode.id
    ,'edge-' + sourceNode.id + '-' + targetNode.id
  ]
  
  return renderCurve(source, target, classes.join(' '))
}

function renderCurve(from, to, className) {
  return h('path', {
    class: className,
    d: createEdgePath(from, to)
  })
}

// originally from https://github.com/the-grid/the-graph/blob/master/the-graph/the-graph-edge.js
function createEdgePath(from, to) {
  var c1 = {}
  var c2 = {}
  var nodeSize = 100
  var curve = nodeSize // ~NodeSize

  // Organic / curved edge
  var c1 = {}
  var c2 = {}
  
  if (to.x-5 < from.x) {
    var curveFactor = (from.x - to.x) * curve / 200
    if (Math.abs(to.y-from.y) < nodeSize/2) {
      // Loopback
      c1.x = from.x + curveFactor
      c1.y = from.y - curveFactor
      c2.x = to.x - curveFactor
      c2.y = to.y - curveFactor
    } else {
      // Stick out some
      c1.x = from.x + curveFactor
      c1.y = from.y + (to.y > from.y ? curveFactor : -curveFactor)
      c2.x = to.x - curveFactor
      c2.y = to.y + (to.y > from.y ? -curveFactor : curveFactor)
    }
  } else {
    // Controls halfway between
    c1.x = from.x + (to.x - from.x)/2
    c1.y = from.y
    c2.x = c1.x
    c2.y = to.y
  }

  return [
    'M',
    from.x, from.y,
    'C',
    c1.x, c1.y,
    c2.x, c2.y,
    to.x, to.y
  ].join(' ')
}