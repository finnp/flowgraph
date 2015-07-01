# flowgraph

[![NPM](https://nodei.co/npm/flowgraph.png)](https://nodei.co/npm/flowgraph/)

Model for a graph with in and outports.

It is mainly for being used as a model for `flowgraph-editor`.

## Example

```js
var FlowGraph = require('flowgraph')

// define your graph
graph = new FlowGraph()
graph.addNode('A', ['in'], ['out'])
graph.addNode('B') // default ports are in and out
graph.addNode('C', ['1', '2', '3'], ['stdout', 'stderr'])
graph.connect('B', 'C', 'out', '2')
```