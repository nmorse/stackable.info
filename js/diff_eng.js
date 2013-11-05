jQuery(function($) {
var diff = function(obj) {
    var attrs, index, attr;
    var elm = obj[0];
    
    display(elm.nodeName + " :");
    attrs = elm.attributes;
    for (index = 0; index < attrs.length; ++index) {
      attr = attrs[index];
      display(attr.nodeName + " = " + attr.nodeValue);
    }
    if (obj.children().length > 0) {
      obj.children().each(function() {
        diff($(this));
      });
    }
    else {
      display("text : "+obj.text() + "<hr/>");
    }
  };
      $("div").each(function() {
        diff($(this));
      });
  function display(msg) {
    $("<p>").html(msg).appendTo(document.body);
  }
});
