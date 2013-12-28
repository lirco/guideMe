console.log("GuideMe overlay.js loaded");

chrome.extension.sendMessage({method: "pageLoaded"}, function(response) {
  // check the response
  console.log("Received response !!!!!");
  if(response.enabled == true) { // inject overlay if necessary
    console.log("GuideMe Enabled: page supported - initializing UI");

    /*
    $('head').append( $('<link rel="stylesheet" type="text/css" />')
        .attr('href', 'http://127.0.0.1:3000/stylesheets/style.css')
        .attr('href', 'http://127.0.0.1:3000/stylesheets/drawer.css')
        .load(function(){
      $.get("http://127.0.0.1:3000/extension", function(data){
        console.log("Adding drawer");
        $('body').append(data);
      });
    }) );
    */
  }
});

