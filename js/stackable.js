
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
            "id": "p",
            "start": true,
            "view": {
            "position": {
             "x": 125,
             "y": 181
            }
            }
            }],
            "edges": [
            ["div", "p", "tag_path"
            ]]};
        var style_map = {"p": "border: solid #f2dc93 1px; margin: 2px; padding: 2px; background-color: #FFFFFF;",
                       "div": "border: dashed #f2dc93 1px; padding: 2px; width: 600px; background-color: #FFFFFF;",
                       "ul": "border: solid #f2dc93 1px; margin: 2px; padding: 2px 2px 2px 20px; background-color: #FFFFFF;",
                       "li": "border: solid #f2dc93 1px; margin: 2px; padding: 2px; background-color: #FFFFFF;",
                       "h1": "border: solid #f2dc93 1px; margin: 2px; padding: 6px; background-color: #FFFFFF;",
                       "h2": "border: solid #f2dc93 1px; margin: 2px; padding: 4px; background-color: #FFFFFF;"};
        
    $.fn.stackable = function(settings) {
        
        if (settings) {$.extend(true, config, settings);}
        if (config.stacks || typeof config.stacks == 'array') {}
        if (config.logging.status == 'on') {
            $log_element = $("#"+config.logging.dom_element_id);
        }
        
        g.load(settings.tag_graph);
        
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
            var node = g.get_node({"id":tg}), node2, 
            poss = g.get_linked_nodes(node, "tag_path"), 
                tag, lookup_tag, in_poss = [];
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
                        alert(tg+" "+this.nodeName);
                        $(this).text($(this).text());
                        //$(this).remove();
                        
                        // //$(this).wrap('<span style="color: red;"></span>');
                        // //$(this).parent().prepend("Warning! Quarantined text node at "+tg_p.join(":>")+": ");
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
                    node2 = g.get_node({"id":tag});
                    if (node2) {
                        in_poss = g.get_linked_nodes(node2, "tag_path");
                    }
                    $(this).hover(function() {
                        var ele = $(this);
                        var offset = ele.offset();
                        var top = offset.top;
                        var left = ele.width()+offset.left+20;
                        var opt_menu_a = "", opt_menu_b = "", opt_menu_in = "";
                        ele.css({"background-color": "#EEEEEE"});
                        //$('#stackable_control_panel').html($(this).data("path")).show();
                        //$('#remove_box').off('click');
                        //$('#add_p_above').off('click');
                        $.each(poss, function(i, o) {
                            if (o !== 'h#' || o !== 'text') {
                                opt_menu_a += ' <button id="add_'+o+'_above" data-tag="'+o+'" type="button" class="btn btn-primary">'+o+'</button>';
                                opt_menu_b += ' <button id="add_'+o+'_below" data-tag="'+o+'" type="button" class="btn btn-primary">'+o+'</button>';
                            }
                        });
                        $.each(in_poss, function(i, o) {
                            if (o !== 'h#' || o !== 'text') {
                                opt_menu_in += ' <button id="add_'+o+'_in" data-tag="'+o+'" type="button" class="btn btn-primary">'+o+'</button>';
                            }
                        });
                        $('#stackable_control_panel').html('<ul><li>add a new Tag ['+opt_menu_a+'] above</li><li><button id="remove_box" type="button" class="btn btn-primary">Remove this &lt;'+tag+'&gt; Tag!</button>  or add into this box '+opt_menu_in+'</li><li >add ['+opt_menu_b+'] box below</li></ul>').show();
                        $('#stackable_control_panel').css({"position": "absolute", "top":top, "left":left, "width":"350px"});
                        $('#remove_box').on('click', function() { 
                            ele.remove();
                            $('#stackable_control_panel').hide(); 
                        });
                        $.each(poss, function(i, o) {
                            if (o !== 'h#' || o !== 'text') {
                                $('#add_'+o+'_above').on('click', function() {
                                    var tag = $(this).data("tag");
                                    ele.before($('<'+tag+'/>').text(" "));
                                    $('#stackable_control_panel').hide();
                                    $('#demo1').stackable();
                                });
                                $('#add_'+o+'_below').on('click', function() {
                                    var tag = $(this).data("tag");
                                    ele.after($('<'+tag+'/>').text(" "));
                                    $('#stackable_control_panel').hide();
                                    $('#demo1').stackable();
                                });
                            }
                        });
                        $.each(in_poss, function(i, o) {
                            if (o !== 'h#') {
                                $('#add_'+o+'_in').on('click', function() {
                                    var tag = $(this).data("tag");
                                    ele.prepend($('<'+tag+'/>').text(" "));
                                    $('#stackable_control_panel').hide();
                                    $('#demo1').stackable();
                                });
                            }
                        });
                        return false;
                    }, 
                    function() {
                        // on leaving the element
                        $(this).css("background-color", "#FFFFFF");
                        //$('#stackable_control_panel').hide();
                    });
                    parse(this, lookup_tag, tg_p);
                }
                else  {
                    alert(tg+" to Tag "+this.nodeName);
                    $(this).text($(this).text());
                    $(this).wrap('<span style="color: red;"></span>');
                    //$(this).remove();
                    
                    // //$(this).wrap('<span style="color: red;"></span>');
                    // //$(this).parent().prepend("Warning! Quarantined &lt;"+tag+"/&gt; tag: ");
                    //alert("parse error: text content inside a "+tg+" tag. Path not found in the tag graph.");
                    //alert("not able to parse HTML stucture <"+tg+"/> -> <"+tag+"/> against the tag graph");
                }
            }
        });
    }
    
})(jQuery, grapel);
