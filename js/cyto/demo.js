$(function(){
	var raw_nodes = grapel.get_nodes();
	var raw_edges = grapel.get_edges();
	var demoNodes = [];
	var demoEdges = [];
	var i, o;
    var g;
	for (i = 0; i < raw_nodes.length; i++) {
        o = {data:raw_nodes[i]};
        demoNodes.push(o);
    }
    for (i = 0; i < raw_edges.length; i++) {
        o = {data:{id:"e" + (i * 2), source: raw_edges[i][0], target: raw_edges[i][1], weight: 30}};
        demoEdges.push(o);
    }


    $('#graph_vis').cytoscape({
    elements: { 
      nodes: demoNodes,
      edges: demoEdges
    },
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
    , ready: function(){
        var nodeCount, nodes;
        var i, pos, data;
        nodes = g.nodes();
        nodeCount = nodes.length;
        for (i = 0; i < nodeCount; i++) {
            data = nodes[i].data();
            if (data && data.view && data.view.position) {
                pos = data.view.position;
                //alert(pos.x + " " + pos.y);
                nodes[i].position({x: pos.x, y: pos.y});
            }
        }
      }
    });
    g = $("#graph_vis").cytoscape("get");

});
