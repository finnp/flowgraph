var indexArray = require('index-array')

var FlowGraphView = require('./view.js')

module.exports = Flowgraph

function Flowgraph() {
  this.nodes = []
  this.edges = []
  this.connector = {
    active: false,
    from: {},
    to: {}
  }
}

Flowgraph.prototype.addNode = function (node) {
  this.nodes.push({id: node, x: 0, y: 0})
}

Flowgraph.prototype.deleteNode = function (id) {
  this.edges = this.edges.filter(function (edge) {
    return edge.from !== id && edge.to !== id
  })
  this.nodes = this.nodes.filter(function (node) {
    return node.id !== id
  })
}

Flowgraph.prototype.connect = function (a, b) {
  // {a: ['b'], b: [], c: ['a', 'b', 'c']}
  // {a: {b: true}, b: {}, c: {a: true, b: true, c: true}} -- no double edge
  // for(from in edges) {
  
  this.edges.push({from: a, to: b})
}

Flowgraph.prototype.disconnect = function (a, b) {
  this.edges = this.edges.filter(function (edge) {
    return edge.from !== a || edge.to !== b
  })
}

Flowgraph.prototype.getEdges = function () {
  return this.edges
}

Flowgraph.prototype.getEdge = function (id) {
  return indexArray(this.nodes, 'id')[id]
}

Flowgraph.prototype.display = function () {
  new FlowGraphView(this)
}

// [{from: 'A', to: 'B'}, ...]
// var edgeList = []
// for(from in edges) {
//   for(to in edges[from]) {
//     if(edges[from][to]) edgeList.push({from: from, to: to})
//   }
// }