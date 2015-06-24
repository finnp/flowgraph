var FlowGraph = require('./')
var FlowGraphView = require('./').View
var insertCss = require('insert-css')

graph = new FlowGraph()
graph.addNode('A')
graph.addNode('B')
graph.addNode('C', ['1', '2', '3'], ['stdout', 'stderr'])
graph.connect('B', 'C', 'out', '2')

var view = new FlowGraphView(graph)
document.body.appendChild(view.svg)


setTimeout(function () {
  view.blinkEdge('B', 'C')
}, 2000)

setTimeout(function () {
  view.blinkEdge('B', 'C')
}, 4000)

view.on('node-select', function (node) {
  console.log('Node clicked', node)
})

insertCss(FlowGraph.css)
