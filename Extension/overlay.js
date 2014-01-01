console.log("GuideMe overlay.js loaded");

chrome.extension.sendMessage({method: "uiLoaded"}, function(response) {
  console.log(response);
  var action = response.action;
  if (action != null) 
  {
      if (action.post() == true)
      {
          nextAction(action);
      }
  }

});

var guide = null;

function nextAction(action)
{
    chrome.extension.sendMessage({method: "nextAction", action:action}, function(response) {
        console.log(response);
    });
}


function showAction(action) 
{
    guide = guiders.createGuider({
      attachTo: action.selector,
      buttons: [{name: "Next", onclick: nextAction}],
      description: action.description,
      title: action.title,
      id: action.id,
      next: "fourth", //TODO: Think how to implement UI state machine
      position: 9,
      width: 300
    });
    
    guide.action = action;
    guide.show();
}

// Initialize event listener
chrome.extension.onMessage.addListener( 
  function(request, sender, sendResponse) {
    console.log("Got message");
    if (typeof request.method != 'undefined')
    {
      var method = request.method;
      if (method == "showAction")
      {
          showAction(request.action);
      }
      console.log("Processing message: " + method);
    }
    else
    {
      console.error("No method in message");
      console.error(request);
    }
    return true;
});
