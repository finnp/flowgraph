var FlowGraph = require('./')
var FlowGraphView = require('./').View
var insertCss = require('insert-css')

graph = new FlowGraph()
graph.addNode('A')
graph.addNode({id: 'B', data: 'what'})
graph.addNode('C', ['1', '2', '3'], ['stdout', 'stderr'])
graph.connect('B', 'C', 'out', '2')

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
