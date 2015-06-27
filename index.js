var indexArray = require('index-array')
var fs = require('fs')
var xtend = require('xtend')
var EventEmitter = require('events').EventEmitter
var inherits = require('inherits')
var random = require('randomjs')

module.exports = Flowgraph

function Flowgraph() {
  EventEmitter.call(this)
  this.nodes = []
  this.edges = []
  this.connector = {
    active: false,
    from: {},
    to: {}
  }
}

inherits(Flowgraph, EventEmitter)

Flowgraph.css = fs.readFileSync(__dirname + '/style.css').toString()

Flowgraph.View = require('./lib/view')

Flowgraph.prototype.addNode = function (node, inports, outports) {
  if(typeof inports === 'string') inports = [inports]
  if(typeof outports === 'string') outports = [outports]
  
  var options = {
    id: random('[a-z][a-z0-9_]{16}'),
    x: 0,
    y: 0,
    inports: inports || ['in'],
    outports: outports || ['out']
  }
  if(typeof node === 'string') options.id = node
  else options = xtend(options, node)

  if(!/^[a-z][a-z0-9_]*$/.test(options.id)) throw(new Error('ID can only be [a-z][a-z0-9_]+'))
  if(this.getNode(options.id))  throw(new Error('Node ID already exists'))

  this.nodes.push(options)
  this.emit('node-added', options)
  return options
}

Flowgraph.prototype.getInports = function(node) {
  return this.getNode(node).inports || []
}

Flowgraph.prototype.getOutports = function(node) {
  return this.getNode(node).outports || []
}

Flowgraph.prototype.deleteNode = function (id) {
  var removedEdges = []
  this.edges = this.edges.filter(function (edge) {
    if(edge.source.id === id || edge.target.id === id) {
      removedEdges.push(edge)
      return false
    }
    return true
  })
  removedEdges.forEach(function (edge) {
    this.emit('edge-deleted', edge)
  }.bind(this))
  
  var deletedNode = null
  this.nodes = this.nodes.filter(function (node) {
    if(node.id === id) deletedNode = node
    else return true
  })
  if(deletedNode) this.emit('node-deleted', deletedNode)
}

Flowgraph.prototype.connect = function (source, target, sourcePort, targetPort) {  
  var edge = {
    source: {id: source, port: sourcePort || 'in'},
    target: {id: target, port: targetPort || 'out'}
  }
  this.edges.push(edge)
  this.emit('edge-added', edge)
}

Flowgraph.prototype.disconnect = function (a, b, aPort, bPort) {
  var removedEdge = null

  this.edges = this.edges.filter(function (edge) {
    if(edge.source.port !== aPort || edge.target.port !== bPort) return true
    if(edge.source.id === a && edge.target.id === b) removedEdge = edge
    else return true
  })
  if(removedEdge) this.emit('edge-deleted', removedEdge)
}

Flowgraph.prototype.getEdges = function() {
  return this.edges
}

Flowgraph.prototype.getEdge = function (source, target, outport, inport) {
  inport = inport || 'in'
  outpot = outport || 'out'

  return this.edges.filter(function (edge) {
    return edge.source.id === source 
          && edge.source.port === outport
          && edge.target.id === target
          && edge.target.port === inport
  })[0]
}

Flowgraph.prototype.getNode = function (id) {
  return indexArray(this.nodes, 'id')[id]
}

Flowgraph.prototype.getNodes = function () {
  return this.nodes
}

Flowgraph.prototype.export = function () {
  return {nodes: this.nodes, edges: this.edges}
}

Flowgraph.prototype.toJSON = function () {
  return JSON.stringify(this.export())
}

Flowgraph.prototype.import = function (graph) {
  if(typeof graph === 'string') graph = JSON.parse(graph)
  // TODO: Validate import
  this.nodes = graph.nodes
  this.edges = graph.edges
}

// [{from: 'A', to: 'B'}, ...]
// var edgeList = []
// for(from in edges) {
//   for(to in edges[from]) {
//     if(edges[from][to]) edgeList.push({from: from, to: to})
//   }
// }