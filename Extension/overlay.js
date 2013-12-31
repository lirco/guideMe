console.log("GuideMe overlay.js loaded");

chrome.extension.sendMessage({method: "pageLoaded"}, function(response) {
  // check the response
  console.log("Received response !!!!!");
  if(response.enabled == true) { // inject overlay if necessary
    console.log("GuideMe Enabled: page supported - initializing UI");
  }
});

var guide = null;

function nextAction(tutorialId, actionId)
{
    console.log("Run next action, tutorialId = " + tutorialId + " actionId = " + actionId);

    chrome.extension.sendMessage({method: "nextAction", tutorialId:tutorialId, actionId:actionId}, function(response) {
        console.log(response);
    });
}


function showAction(action) 
{
    guide = guiders.createGuider({
      attachTo: action.selector,
      buttons: [{name: "Go to next one", onclick: nextAction}],
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

//nextAction("moodle_menu_slideshare","moodle_login");