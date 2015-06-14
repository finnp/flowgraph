var h = require('virtual-hyperscript-svg')

module.exports = renderNode

function renderNode(node) {
  var rect = h('rect', {
    x: 0,
    y: 0,
    width: 100,
    height: 100
  })
  var leftDot = h('circle', {
    class: 'port input',
    cx: 0,
    cy: 50
  })
  var rightDot = h('circle', {
    class: 'port output',
    cx: 100,
    cy: 50
  })
  var text = h('text', {x: 45, y: 60}, node.id)
  var domNode = h('g', {
    id: node.id,
    class: 'node',
    transform: 'translate(' + node.x + ',' + node.y + ')'
  },[
    rect,
    text,
    leftDot,
    rightDot
  ])
  return domNode
}