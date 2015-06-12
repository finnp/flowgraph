var FlowGraph = require('./index.js')

var test = new FlowGraph()
test.addNode('A')
test.addNode('B')
test.addNode('C')
test.connect('B', 'C')
test.display()