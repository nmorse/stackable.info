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
				"background-color": "#f9dc7a",
				"border-color": "#d3b347",
                "color": "#c4a987"
			})
		.selector("edge")
			.css({
				"width": "mapData(weight, 0, 100, 1, 4)",
				"target-arrow-shape": "triangle",
				"target-arrow-color": "#f2c641",
				"source-arrow-shape": "circle",
				"source-arrow-color": "#f2c641",
				"line-color": "#f2dc93",
			})
		.selector(":selected")
			.css({
				"background-color": "#d1280e",
				"line-color": "#a82714",
                "border-color": "#a82714",
				"source-arrow-color": "#d1280e",
				"target-arrow-color": "#d1280e"
			})
		.selector(".ui-cytoscape-edgehandles-source")
			.css({
				"border-color": "#f2c641",
				"border-width": 3
			})
		.selector(".ui-cytoscape-edgehandles-target, node.ui-cytoscape-edgehandles-preview")
			.css({
				"background-color": "#f2c641"
			})
		.selector("edge.ui-cytoscape-edgehandles-preview")
			.css({
				"line-color": "#d1280e"
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
