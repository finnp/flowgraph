var FlowGraph = require('./')
var FlowGraphView = require('./').View
var insertCss = require('insert-css')

graph = new FlowGraph()

graph.on('node-added', function (node) {
  console.log('added', node.id)
})

graph.on('edge-added', function (edge) {
  console.log('added edge', edge.source.id, edge.target.id)
})

graph.addNode('test')
graph.addNode({id: 'B', data: 'test'})
graph.addNode('C', ['1', '2', '3'], ['stdout', 'stderr'])
graph.connect('B', 'C', 'out', '2')

graph.on('node-deleted', function (node) {
  console.log('deleted', node.id)
})

graph.on('edge-deleted', function (edge) {
  console.log('deleted edge', edge.source.id, edge.target.id)
})

var view = new FlowGraphView(graph)
document.body.appendChild(view.svg)


setTimeout(function () {
  view.blinkEdge('B')
  setTimeout(function () {
    view.blinkEdge('B')
  }, 500)
}, 2000)


view.on('node-select', function (node) {
  console.log('Node clicked', node)
})

insertCss(FlowGraph.css)
