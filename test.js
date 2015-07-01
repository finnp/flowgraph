var test = require('tape')
var Flowgraph = require('./')

test('node: add, get, delete', function (t) {
  var graph = new Flowgraph()
  graph.addNode('a', ['1', '2', '3'], ['stdout', 'stderr'])
  var a = graph.getNode('a')
  t.equal(a.id, 'a', 'added a')
  t.equal(a.inports.length, 3, '3 inports')
  t.ok(a.inports.indexOf('2') > -1, 'has port "2"')
  t.equal(a.outports.length, 2, '3 outports')
  t.ok(a.outports.indexOf('stderr') > -1, 'has port stderr')

  graph.deleteNode('a')
  t.notOk(graph.getNode('a'), 'node deleted')
  t.end()
})

test('node: simple add and get with default ports', function (t) {
  var graph = new Flowgraph()
  graph.addNode('a')
  graph.addNode('b')
  t.equal(graph.getNode('a').id, 'a', 'added a')
  t.equal(graph.getNode('b').id, 'b', 'added b')
  t.equal(graph.getNodes().length, 2, '2 elements')
  t.end()
})

test('node: default in and outports', function (t) {
  var graph = new Flowgraph()
  graph.addNode('a')
  var a = graph.getNode('a')
  t.equal(a.inports.length, 1, '1 inport')
  t.equal(a.inports[0], 'in', 'inport in')
  t.equal(a.inports.length, 1, '1 inport')
  t.equal(a.outports[0], 'out', 'outport out')
  t.end()
})

test('node: getNodes()', function (t) {
  var graph = new Flowgraph()
  graph.addNode('a')
  graph.addNode('b')
  graph.addNode('c')
  var nodes = graph.getNodes()
  t.equal(nodes.length, 3, '3 nodes added')
  var ids = nodes.map(function (node) {
    return node.id
  }).sort().join('')
  t.equal(ids, 'abc', 'correct ids added')
  t.end()
})

test('edge: connect nodes', function (t) {
  var graph = new Flowgraph()
  graph.addNode('a')
  graph.addNode('b')
  graph.connect('a', 'b', '1', '2')
  var edge = graph.getEdge('a', 'b', '1', '2')
  t.equal(edge.source.id, 'a')
  t.equal(edge.target.id, 'b')
  t.equal(edge.source.port, '1')
  t.equal(edge.target.port, '2')
  t.end()
})

test('edge: connect nodes with single in/out ports', function (t) {
  var graph = new Flowgraph()
  graph.addNode('a', [], ['a.out'])
  graph.addNode('b', ['b.in'], [])
  graph.connect('a', 'b')
  var edge = graph.getEdge('a', 'b')
  t.equal(edge.source.id, 'a')
  t.equal(edge.target.id, 'b')
  t.equal(edge.source.port, 'a.out')
  t.equal(edge.target.port, 'b.in')
  t.end()
})

test('edge: addNodes() + getEdges()', function (t) {
  var graph = new Flowgraph()
  graph.addNodes(['a', 'b', 'c'])
  graph.connect('a', 'b')
  graph.connect('b', 'a')
  graph.connect('a', 'c')
  var edges = graph.getEdges()
  t.equal(edges.length, 3, '3 edges')
  t.end()
})
