console.log("GuideMe overlay.js loaded");

chrome.extension.sendMessage({method: "pageLoaded"}, function(response) {
  // check the response
  console.log("Received response !!!!!");
  if(response.enabled == true) { // inject overlay if necessary
    console.log("GuideMe Enabled: page supported - initializing UI");
  }
});

// Add specific UI handlers
function showBubble(selector) {
  var element = $(selector);

  // TODO: Change this example to actual code
  $(element).css("border", "1px solid red");
}

// Initialize event listener
chrome.extension.onMessage.addListener( 
  function(request, sender, sendResponse) {
    if (typeof request.method != 'undefined')
    {
      var method = request.method;
      console.log("Processing message: " + method);
    }
    else
    {
      console.error("No method in message");
      console.error(request);
    }
});

showBubble('#tau_header');
