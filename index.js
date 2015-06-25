var indexArray = require('index-array')
var fs = require('fs')
var xtend = require('xtend')

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

Flowgraph.css = fs.readFileSync(__dirname + '/style.css').toString()

Flowgraph.View = require('./lib/view')

Flowgraph.prototype.addNode = function (node, inports, outports) {
  if(typeof inports === 'string') inports = [inports]
  if(typeof outports === 'string') outports = [outports]
  
  var options = {
    id: node,
    x: 0,
    y: 0,
    inports: inports || ['in'],
    outports: outports || ['out']
  }
  
  if(typeof node === 'object') options = xtend(options, node)
  
  this.nodes.push(options)

  return options
}

Flowgraph.prototype.getInports = function(node) {
  return this.getNode(node).inports || []
}

Flowgraph.prototype.getOutports = function(node) {
  return this.getNode(node).outports || []
}

Flowgraph.prototype.deleteNode = function (id) {
  this.edges = this.edges.filter(function (edge) {
    return edge.source.id !== id && edge.target.id !== id
  })
  this.nodes = this.nodes.filter(function (node) {
    return node.id !== id
  })
}

Flowgraph.prototype.connect = function (source, target, sourcePort, targetPort) {  
  this.edges.push({
    source: {id: source, port: sourcePort || 'in'},
    target: {id: target, port: targetPort || 'out'}
  })
}

Flowgraph.prototype.disconnect = function (a, b, aPort, bPort) {
  this.edges = this.edges.filter(function (edge) {
    if(edge.source.port !== aPort || edge.target.port !== bPort) return true

    return edge.source.id !== a || edge.target.id !== b
  })
}

Flowgraph.prototype.getEdges = function () {
  return this.edges
}

Flowgraph.prototype.getNode = function (id) {
  return indexArray(this.nodes, 'id')[id]
}

// [{from: 'A', to: 'B'}, ...]
// var edgeList = []
// for(from in edges) {
//   for(to in edges[from]) {
//     if(edges[from][to]) edgeList.push({from: from, to: to})
//   }
// }