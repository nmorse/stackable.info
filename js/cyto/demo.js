$(function(){

	var nodeCount = 6;
	var edgeCount = 12;
	
	var demoNodes = [
      {data: {id: "n0", weight: 10}, position:[20, 20]},
      {data: {id: "n1", weight: 10}, position:[20, 40]},
      {data: {id: "n2", weight: 10}, position:[40, 20]},
      {data: {id: "n3", weight: 10}, position:[40, 40]},
      {data: {id: "n4", weight: 10}, position:[20, 60]},
      {data: {id: "n5", weight: 10}, position:[40, 60]}
        ];
	var demoEdges = [];
	
	
	for (var i = 0; i < nodeCount; i++) {
		demoEdges.push({
			data: {
				id: "e" + (i * 2),
				source: "n" + ((i + 1) >= nodeCount ? i + 1 - nodeCount : i + 1),
				target: "n" + i,
				weight: 30
			}
		});
		
		if (i % 2 == 0) {
			demoEdges.push({
				data: {
					id: "e" + (i * 2 + 1),
					target: "n" + i,
					source: "n" + ((i + 3) >= nodeCount ? i + 3 - nodeCount : i + 3),
					weight: 21
				}
			});
		}
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
				"border-color": "#555",
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
