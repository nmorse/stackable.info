var comparable_diff = null;
jQuery(function($) {
   comparable_diff = function(obj1, obj2, diff) {
    var attrs1, attrs2, index, attr1, attr2, text1, text2;
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
    
    attrs1.sort(function(a,b){return a.nodeName.localeCompare(b.nodeName);});
    attrs2.sort(function(a,b){return a.nodeName.localeCompare(b.nodeName)});
    for (index = 0; index < attrs1.length; ++index) {
        attr1 = attrs1[index];
        attr2 = attrs2[index];
        if (attr1.nodeName !== attr2.nodeName || attr1.nodeValue !== attr2.nodeValue) {
            display_message("diff in " + attr1.nodeName + ": " + attr1.nodeValue + " to " + attr2.nodeName + ": " + attr2.nodeValue);
        }
    }
    
    
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
});
