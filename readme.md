# flowgraph

This repo is experimental right now, nothing published yet.

[![NPM](https://nodei.co/npm/flowgraph.png)](https://nodei.co/npm/flowgraph/)

```js
var Flowgraph = require('flowgraph')

var flowgraph = Flowgraph(document.querySelector('body'))

flowgraph.add('A')
flowgraph.add(['A', 'B', 'C'])
flowgraph.connect('A', 'B')
flowgraph.remove('A')

flowgraph.nodes()// ['A', 'B', 'C']
flowgraph.edges() // [['A', 'B']]

flowgraph.interactive()
```