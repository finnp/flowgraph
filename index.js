var indexArray = require('index-array')
var fs = require('fs')
var xtend = require('xtend')
var EventEmitter = require('events').EventEmitter
var inherits = require('inherits')
var random = require('randomjs')

module.exports = Flowgraph

function Flowgraph () {
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

Flowgraph.prototype.addNode = function (node, inports, outports) {
  if (typeof inports === 'string') inports = [inports]
  if (typeof outports === 'string') outports = [outports]

  var options = {
    id: random('[a-z][a-z0-9_]{16}'),
    x: 0,
    y: 0,
    inports: inports || ['in'],
    outports: outports || ['out']
  }
  if (typeof node === 'string') options.id = node
  else options = xtend(options, node)

  if (!/^[a-z][a-z0-9_]*$/.test(options.id)) throw (new Error('ID can only be [a-z][a-z0-9_]+'))
  if (this.getNode(options.id)) throw (new Error('Node ID already exists'))

  this.nodes.push(options)
  this.emit('node-added', options)
  return options
}

Flowgraph.prototype.addNodes = function (nodes) {
  nodes.forEach(this.addNode.bind(this))
}

Flowgraph.prototype.getInports = function (node) {
  return this.getNode(node).inports || []
}

Flowgraph.prototype.getOutports = function (node) {
  return this.getNode(node).outports || []
}

Flowgraph.prototype.deleteNode = function (id) {
  var removedEdges = []
  this.edges = this.edges.filter(function (edge) {
    if (edge.source.id === id || edge.target.id === id) {
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
    if (node.id === id) deletedNode = node
    else return true
  })
  if (deletedNode) this.emit('node-deleted', deletedNode)
}

Flowgraph.prototype.connect = function (source, target, sourcePort, targetPort) {
  if (!sourcePort) sourcePort = this.defaultOutport(source)
  if (!targetPort) targetPort = this.defaultInport(target)

  var edge = {
    source: {id: source, port: sourcePort},
    target: {id: target, port: targetPort}
  }
  this.edges.push(edge)
  this.emit('edge-added', edge)
}

Flowgraph.prototype.disconnect = function (source, target, sourcePort, targetPort) {
  var removedEdge = null

  this.edges = this.edges.filter(function (edge) {
    if (edge.source.port !== sourcePort || edge.target.port !== targetPort) return true
    if (edge.source.id === source && edge.target.id === target) removedEdge = edge
    else return true
  })
  if (removedEdge) this.emit('edge-deleted', removedEdge)
}

Flowgraph.prototype.getEdges = function () {
  return this.edges
}

Flowgraph.prototype.getEdge = function (source, target, sourcePort, targetPort) {
  if (!sourcePort) sourcePort = this.defaultOutport(source)
  if (!targetPort) targetPort = this.defaultInport(target)

  return this.edges.filter(function (edge) {
    return edge.source.id === source &&
          edge.source.port === sourcePort &&
          edge.target.id === target &&
          edge.target.port === targetPort
  })[0]
}

Flowgraph.prototype.defaultOutport = function (node) {
  var outports = this.getNode(node).outports
  return outports.length === 1 ? outports[0] : false
}

Flowgraph.prototype.defaultInport = function (node) {
  var inports = this.getNode(node).inports
  return inports.length === 1 ? inports[0] : false
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
  if (typeof graph === 'string') graph = JSON.parse(graph)
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
