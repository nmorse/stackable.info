// grapel helps you get a grip on graph structures (in JSON format).
// basic form of the graph is {"nodes":[<node>, ...], "edges": [<edge>, ...]}
// A <node> is either a string (eg. "node_id_string") or and object (eg. {"id":"node_id_string", ...}
// An <edge> is an array [<from_index_integer>, <to_index_integer>, <edge_type>, ...]
(function(_) {
  var g = {};
  var graph_properties = {};
  grapel = {
    load: function(graph) {
        g = graph;
        // detect the properties of the graph
        if (g.nodes.length > 0) {
            if (_.isString(g.nodes[0])) {
               graph_properties.nodeType='string';
            }
            if (_.isObject(g.nodes[0])) {
               graph_properties.nodeType='object';
               if (_.has(g.nodes[0], "id")) {
                   graph_properties = _.defaults(graph_properties, {"IdPropertyName": "id"});
               }
            }
        }
    },
    
    
    get_node_index: function(id) {
        if (graph_properties.nodeType === "string") {
            return _.indexOf(g.nodes, id);
        }
        if (graph_properties.nodeType === "object") {
            return  _.find(_.map(g.nodes, function(node, index) { if (node[graph_properties.IdPropertyName] === id) {return index;} else {return -1;}}), 
                function(index){ return index !== -1; });
        }
        return -1;
    },
    get_node_info: function(id) {
      var index = this.get_node_index(id);
      return {"id":id, "index":index};
    },
    get_node: function(arg) {
      var req = _.extend({id:"start"}, arg);
      var index_obj = this.get_node_info(arg.id);
      return g.nodes[index_obj.index];
    },
    get_linked_nodes: function(arg, type, opt) {
      var req = _.extend({id:"start"}, arg);
      var filter_type = type || '';
      var node = this.get_node_info(arg.id);
      var outedges = _.filter(g.edges, function(o) {return o[0] === node.id && ((_.isUndefined(o[2]) &&  filter_type === '') || o[2] === filter_type);});
      return _.map(outedges, function(edge) { return edge[1]});
    },
    get_nodes: function() {
      return g.nodes;
    },
    get_edges: function() {
      return g.edges;
    }
  };
})(_);

