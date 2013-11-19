var comparable_diff = null;
jQuery(function($) {
   comparable_diff = function(obj1, obj2, diff) {
    var parsed_attr_delta_lists = {};
    var parsed_attr_delta_lists2 = {};
    var attrs1, attrs2, text1, text2;
    var elm1 = obj1[0];
    var elm2 = obj2[0];
    clear_messages();
    if ( !elm2 ) { alert("no elm2"); return; }
    if (elm1.nodeType === 3 && elm2.nodeType === 3) { // these are both text nodes
        text1 = $.trim(obj1.text());
        text2 = $.trim(obj2.text());
        if (text1.localeCompare(text2)) {
            display_message("plaintext " + obj1.text() + " | " + obj2.text() + "<hr/>");
            obj2.parent().addClass("diff");
        }
        else {
            obj2.parent().removeClass("diff");
        }
        return;
    }
    // convert attributes into a straight array
    if (!elm1 || !elm1.attributes) { return; }
    attrs1 = [];
    $('<'+obj1.nodeName+'>test</'+obj1.nodeName+'>').appendTo(diff);
    for (index = 0; index < elm1.attributes.length; ++index) {
        attrs1[index] = elm1.attributes[index];
    }
    if (!elm2 || !elm2.attributes) { return; }
    attrs2 = [];
    for (index = 0; index < elm2.attributes.length; ++index) {
        attrs2[index] = elm2.attributes[index];
    }
    
    // use a symetry of attr_diff(a, b) to calculate attr.insertion as attr_diff(b, a).removal.
    parsed_attr_delta_lists = attr_diff(attrs1, attrs2);
    parsed_attr_delta_lists2 = attr_diff(attrs2, attrs1);
    parsed_attr_delta_lists.insertion = parsed_attr_delta_lists2.removal;
    display_message("parsed_attr_delta_lists " + JSON.stringify(parsed_attr_delta_lists, null, " "));
    // do "value comparison" on matched attribute keys
    
    obj1.contents().each(function(i, o) {
      comparable_diff($(o), $(obj2.contents()[i]));
    });    
  };
  function display_message(msg) {
    $("<p>").html(msg).appendTo("#debug");
  }
  function clear_messages() {
    //$("#debug").replace("<p>running compare...</p>");
  }
  function compare_nodeNames(a,b) {
      return a.nodeName.localeCompare(b.nodeName);
  }
  function key_position( arr, key) {
      var i = 0;
      while( i < arr.length) {
          if (arr[i].key === key.nodeName) {
              return i;
          }
          i += 1;
      }
      return -1;
  }
  function attr_diff(attrs1, attrs2) {
    var attr1, attr2, text1, text2, index, found = 0, index2 = 0, pos;
    var parsed_attr_delta_lists = {"removal":{}, "key_match":{}}, 
        comp;
    attrs1.sort(compare_nodeNames);
    attrs2.sort(compare_nodeNames);
    //display_message(" attr lengths "+ attrs1.length + " and " + attrs2.length);
    for (index = 0; index < attrs1.length; index+=1) {
        index2 = 0;
        attr1 = attrs1[index];
        //display_message(" check all against attr1 "+ attr1.nodeName);
        // look through the second list until a greater or matching element is found
        found = 0;
        while (index2 < attrs2.length) {
            // if (2) is greater (1) then add this attribute (1) to the removal hash.
            // or if a match, mark it to go through "value comparison"
            // else if (2) is less than (1), add this attribute (1) to the insertion list.
            attr2 = attrs2[index2];
            comp = compare_nodeNames(attr2, attr1);
            if (comp > 0) {
                parsed_attr_delta_lists.removal[attr1.nodeName] = attr1.nodeValue;
                break;
            }
            else if (comp === 0) {
                // nodeNames (aka attribute keys) are the same...
                // only add to delta lsit if the values are different. 
                if (attr1.nodeValue !== attr2.nodeValue) {
                    parsed_attr_delta_lists.key_match[attr1.nodeName] = [attr1.nodeValue, attr2.nodeValue];
                }
                found = 1;
                break;
            }
            index2 += 1;
        }
        if (!found) {
            parsed_attr_delta_lists.removal[attr1.nodeName] = attr1.nodeValue;
        }
    }
    
    return parsed_attr_delta_lists;
  }
});
