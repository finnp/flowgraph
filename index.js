// var Flowgraph = require('flowgraph')
// 
// var flowgraph = Flowgraph(document.querySelector('body'))
// 
// flowgraph.add('A')
// flowgraph.add(['A', 'B', 'C'])
// flowgraph.connect('A', 'B')
// flowgraph.remove('A')
// 
// flowgraph.nodes()// ['A', 'B', 'C']
// flowgraph.edges() // [['A', 'B']]
// 
// flowgraph.interactive()

var indexArray = require('index-array')

function Flowgraph() {
  this.nodes = []
  this.edges = []
}

Flowgraph.prototype.add = function (node) {
  this.nodes.push({id: node, x})
}

Flowgraph.prototype.connect = function (a, b) {
  // {a: ['b'], b: [], c: ['a', 'b', 'c']}
  // {a: {b: true}, b: {}, c: {a: true, b: true, c: true}} -- no double edge
  // for(from in edges) {
  
  this.edges.push([a,b])
}

Flowgraph.prototype.edges = function () {
  return this.edges
}

Flowgraph.prototype.getEdge = function (id) {
  return indexArray(this.nodes, 'id')[id]
}

// [{from: 'A', to: 'B'}, ...]
var edgeList = []
for(from in edges) {
  for(to in edges[from]) {
    if(edges[from][to]) edgeList.push({from: from, to: to})
  }
}