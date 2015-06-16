var klay = require('klayjs')

var graph = {
  "id": "root",
  "properties": {},
  "children": [{"id": "n1", "width": 40, "height": 40}, 
               {"id": "n2", "width": 40, "height": 40}],
  "edges": [{"id": "e1", "source": "n1", "target": "n2"}]
};

klay.layout({
  graph: [graph],
  options: {spacing: 50},
  success: function(g) { console.log(g); }
});