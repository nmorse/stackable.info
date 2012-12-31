$(function(){
	var raw_nodes = grapel.get_nodes();
	var raw_edges = grapel.get_edges();
	var demoNodes = [];
	var demoEdges = [];
	var i, o;
	for (i = 0; i < raw_nodes.length; i++) {
        o = {data:raw_nodes[i]};
        if (!raw_nodes[i].view) {
            o.position = [((i/4)+1)*20, ((i%4)+1)*20];
        }
        demoNodes.push(o);
    }
    for (i = 0; i < raw_edges.length; i++) {
        o = {data:{id:"e" + (i * 2), source: raw_edges[i][0], target: raw_edges[i][1], weight: 30}};
        demoEdges.push(o);
    }


  $('#graph_vis').cytoscape({
    elements: { // TODO specify some elements like http://cytoscapeweb.cytoscape.org/demos/simple
      nodes: demoNodes,
      edges: demoEdges
    },

	// TODO specify a nice style like http://cytoscapeweb.cytoscape.org/demos/simple
    style: cytoscape.stylesheet()
      .selector("node")
			.css({
				"content": "data(id)",
				"shape": "data(shape)",
				"border-width": 3,
				"background-color": "#DDD",
				"border-color": "#555"
			})
		.selector("edge")
			.css({
				"width": "mapData(weight, 0, 100, 1, 4)",
				"target-arrow-shape": "triangle",
				"source-arrow-shape": "circle",
				"line-color": "#444",
			})
		.selector(":selected")
			.css({
				"background-color": "#000",
				"line-color": "#000",
                "border-color": "#955",
				"source-arrow-color": "#000",
				"target-arrow-color": "#000"
			})
		.selector(".ui-cytoscape-edgehandles-source")
			.css({
				"border-color": "#5CC2ED",
				"border-width": 3
			})
		.selector(".ui-cytoscape-edgehandles-target, node.ui-cytoscape-edgehandles-preview")
			.css({
				"background-color": "#5CC2ED"
			})
		.selector("edge.ui-cytoscape-edgehandles-preview")
			.css({
				"line-color": "#5CC2ED"
			})
		.selector("node.ui-cytoscape-edgehandles-preview, node.intermediate")
			.css({
				"shape": "rectangle",
				"width": 15,
				"height": 15
			})

    
    
    
		
  });
  
  
  
});
