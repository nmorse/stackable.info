
(function($, g){
    	var config = {"logging":{"status":"off"}};
	var $log_element = null;
    var current_parse_root = null;
	var tag_graph = {
     "nodes": [
      {
       "id": "div",
       "start": true,
       "view": {
        "position": {
         "x": 62,
         "y": 71
        }
       }
      },
      {
       "id": "ul",
       "start": true,
       "view": {
        "position": {
         "x": 169,
         "y": 113
        }
       }
      },
      {
       "id": "ol",
       "start": true,
       "view": {
        "position": {
         "x": 189,
         "y": 42
        }
       }
      },
      {
       "id": "li",
       "view": {
        "position": {
         "x": 332,
         "y": 71
        }
       }
      },
      {
       "id": "h#",
       "start": true,
       "view": {
        "position": {
         "x": 62,
         "y": 242
        }
       }
      },
      {
       "id": "p",
       "start": true,
       "view": {
        "position": {
         "x": 125,
         "y": 181
        }
       }
      },
      {
       "id": "text",
       "view": {
        "position": {
         "x": 332,
         "y": 242
        }
       }
      },
      {
       "id": "em",
       "view": {
        "position": {
         "x": 258,
         "y": 181
        }
       }
      }
     ],
     "edges": [
      [
       "div",
       "h#",
       "tag_path"
      ],
      [
       "div",
       "p",
       "tag_path"
      ],
      [
       "div",
       "ul",
       "tag_path"
      ],
      [
       "div",
       "ol",
       "tag_path"
      ],
      [
       "div",
       "div",
       "tag_path"
      ],
      [
       "h#",
       "text",
       "tag_path"
      ],
      [
       "p",
       "text",
       "tag_path"
      ],
      [
       "ul",
       "li",
       "tag_path"
      ],
      [
       "ol",
       "li",
       "tag_path"
      ],
      [
       "li",
       "p",
       "tag_path"
      ],
      [
       "li",
       "ul",
       "tag_path"
      ],
      [
       "li",
       "ol",
       "tag_path"
      ],
      [
       "li",
       "text",
       "tag_path"
      ],
      [
       "li",
       "em",
       "tag_path"
      ],
      [
       "p",
       "em",
       "tag_path"
      ],
      [
       "em",
       "text",
       "tag_path"
      ]
     ]
    };
	    var style_map = {"p": "border: solid gray 1px; margin: 2px; padding: 2px; background-color: #FFFFFF;",
	                   "div": "border: dashed green 1px; padding: 2px; width: 600px; background-color: #FFFFFF;",
	                   "ul": "border: solid yellow 1px; margin: 2px; padding: 2px 2px 2px 20px; background-color: #FFFFFF;",
	                   "li": "border: solid blue 1px; margin: 2px; padding: 2px; background-color: #FFFFFF;",
	                   "h1": "border: solid red 1px; margin: 2px; padding: 6px; background-color: #FFFFFF;",
	                   "h2": "border: solid red 1px; margin: 2px; padding: 4px; background-color: #FFFFFF;"};
	    
	$.fn.stackable = function(settings) {
		
		if (settings) {$.extend(true, config, settings);}
		if (config.stacks || typeof config.stacks == 'array') {}
		if (config.logging.status == 'on') {
			$log_element = $("#"+config.logging.dom_element_id);
		}
		
		g.load(tag_graph);
		
		this.each(function() {
		    var tag = this.nodeName.toLowerCase();
		    $(this).attr("style", style_map[tag]);
		    $().appendTo("body");
			parse(this, tag, []);
		});
		return this;
	};
	
	function is_whitespace(s) {
	    s = s.replace(/[\s|\t|\n]/g, "");
	    return $.trim(s) === "";
	}
	
	function parse(it, tg, tg_path) {
        current_parse_root = it;
        if (tg_path.length > 0 || g.get_node({id:tg}).start) {
            parse_aux(it, tg, tg_path);
        }
        else {
            alert("Unable to 'start' parsing form this tag: '" + tg + "' is not stackable! " + JSON.stringify(g.get_node({id:tg})));
        }
    }
    
	function parse_aux(it, tg, tg_path) {
	    //alert("parse "+$(it).html());
	    // dig down through the tags in this HTML fragment... checking to see if it conforms to the tag_graph
	    $(it).contents().each(function() {
	        var tg_p = _.clone(tg_path);
            var node = g.get_node({id:tg}), 
            poss = g.get_linked_nodes(node, "tag_path"), 
                tag, lookup_tag;
	        if (this.nodeType === 3) { // this is a text node
                if (_.indexOf(poss, "text") >= 0) {
                    //alert("from tag: "+ tg + " to text: "+ $(this).text());
                    // may need to wrap this text in a tag to edit it...
                    $(this).parent().each(function() {
                        this.contentEditable = true;
                    });
                    
	            }
                else  {
                    // this might just be white space?, but otherwise it is not in the graph
                    if (!is_whitespace($(this).text())) {
                        $(this).wrap('<span style="color: red;"></span>');
                        $(this).parent().prepend("Warning! Quarantined text node at "+tg_p.join(":>")+": ");
                        //alert("parse error: text content inside a "+tg+" tag. Path not found in the tag graph.");
                        //$(this).remove();
                    }
                }
	        }
	        else { // this is a tag 
                tag = this.nodeName.toLowerCase();
                lookup_tag = tag;
                if (_.indexOf(['h1', 'h2', 'h3', 'h4', 'h5', 'h6'], tag, true) >= 0) {lookup_tag = 'h#';}
                if (_.indexOf(poss, lookup_tag) >= 0) { // a tag_graph acceptable tag as well
                    tg_p.push(tag);
                    $(this).attr("style", style_map[tag]);
                    $(this).data("path", tg_p.join(">"));
                    $(this).hover(function() {
                        $(this).css({"background-color": "#EEEEEE"});
                        var offset = $(this).offset();
                        var top = offset.top;
                        var left = $(this).width()+offset.left+20;
                        $('#stackable_control_panel').html($(this).data("path")).show();
                        $('#stackable_control_panel').css({"position": "absolute", "top":top, "left":left, "width":"350px", "height":"50px"});
                        return false;
                    }, 
                    function() {
                        $(this).css("background-color", "#FFFFFF");
                        //$('#stackable_control_panel').hide();
                    });
                    parse(this, lookup_tag, tg_p);
                }
                else  { 
                    $(this).wrap('<span style="color: red;"></span>');
                    $(this).parent().prepend("Warning! Quarantined &lt;"+tag+"/&gt; tag: ");
                    //alert("parse error: text content inside a "+tg+" tag. Path not found in the tag graph.");
                    //alert("not able to parse HTML stucture <"+tg+"/> -> <"+tag+"/> against the tag graph");
                }
            }
	    });
	}
	
})(jQuery, grapel);
