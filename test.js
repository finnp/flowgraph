var FlowGraph = require('./index.js')
var FlowGraphView = require('./view.js')

graph = new FlowGraph()
graph.addNode('A')
graph.addNode('B')
graph.addNode('C')
graph.connect('B', 'C')

var view = new FlowGraphView(graph)

view.on('node-select', function (node) {
  console.log(node)
})


