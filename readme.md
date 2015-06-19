# flowgraph

[![NPM](https://nodei.co/npm/flowgraph.png)](https://nodei.co/npm/flowgraph/)

Visualise a flow graph with in and output ports. 

This is pretty alpha right now and the API could still change a lot.

## Example

```js
var FlowGraph = require('flowgraph')

var FlowGraphView = require('flowgraph').View

var insertCss = require('insert-css')

// define your graph
graph = new FlowGraph()
graph.addNode('A', ['in'], ['out'])
graph.addNode('B') // default ports are in and out
graph.addNode('C', ['1', '2', '3'], ['stdout', 'stderr'])
graph.connect('B', 'C', 'out', '2')

var view = new FlowGraphView(graph)
document.body.appendChild(view.svg)

view.on('node-select', function (node) {
  console.log(node)
})

insertCss(FlowGraph.css)
```