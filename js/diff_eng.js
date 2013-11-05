jQuery(function($) {
  var diff = function(obj) {
    var attrs, index, attr;
    var elm = obj[0];
    if (elm.nodeType === 3) { // this is a text node
      display("plaintext "+obj.text() + "<hr/>");
      return;
    }
    display(elm.nodeName + " :");
    attrs = elm.attributes;
    for (index = 0; index < attrs.length; ++index) {
      attr = attrs[index];
      display(attr.nodeName + " = " + attr.nodeValue);
    }
    
    obj.contents().each(function() {
      diff($(this));
    });    
  };
  function display(msg) {
    $("<p>").html(msg).appendTo(document.body);
  }
  
  $("div").each(function() {
    diff($(this));
  });
});
