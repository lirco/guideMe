var GuideUI = function() {
  this.handlers = {};
  this.tutorials = {};

  //this.registerHandler("nextAction",    this.nextActionHandler.bind(this));
  //this.registerHandler("showAction",    this.showActionHandler.bind(this));
  this.registerHandler("startTutorial",   this.startTutorialHandler.bind(this));
};

GuideUI.prototype.registerHandler = function(method, handler)
{
  this.handlers[method] = handler;
}

GuideUI.prototype.onMessage = function(request, sender, sendResponse)
{
  // TODO: Add check that extension is enabled in settings
  // var guidemeEnabled = b.guideme.settings.get("enabled", "true");

  if (typeof request.method != 'undefined')
  {
    var method = request.method;
    console.log("GuideUI: processing message: " + method);
    
    if (method in this.handlers)
    {
      this.handlers[method](request, sender, sendResponse);
    }
    else
    {
      console.error("Unknown message: " + method);
    }
  }
  else
  {
    console.error("No method in message");
    console.error(request);
  }
}

GuideUI.prototype.startTutorialHandler = function(request, sender, sendResponse)
{
  console.log("Start tutorial: " + request.tutorialId);
  // TODO:check that we are not in the middle of another tutorial

  // Check if we have this tutorial
  if (request.tutorialId in this.tutorials)
  {
    var tutorial = this.tutorials[request.tutorialId];
    var action = tutorial[tutorial.start];
    
    // Report state to extension

    this.showAction(action);
  }
}

GuideUI.prototype.nextAction = function(action)
{
    chrome.extension.sendMessage({method: "nextAction", action:action}, function(response) {
        console.log(response);
    });
}

GuideUI.prototype.addTutorial = function(tutorial)
{
  this.tutorials[tutorial.id] = tutorial;
}

GuideUI.prototype.showAction = function(action) 
{
    this.guide = guiders.createGuider({
      attachTo: action.selector,
      buttons: [{name: "Next", onclick: guideui.nextAction}],
      description: action.description,
      title: action.title,
      id: action.id,
      next: "fourth", //TODO: Think how to implement UI state machine
      position: 9,
      width: 300
    });
    
    this.guide.action = action;
    this.guide.show();
}

var guideui = new GuideUI();

// Initialize message listener
chrome.extension.onMessage.addListener( 
  function(request, sender, sendResponse) {
    guideui.onMessage(request, sender, sendResponse);
    return true;
});

console.log("GuideUI loaded");

// Reload state from the extension
chrome.extension.sendMessage({method: "uiLoaded"}, function(response) {
  console.log(response);
  var action = response.action;
  if (action != null) 
  {
      // Check if post conditions of the current action are satisfied, move to the next one
      if (action.post() == true)
      {
          nextAction(action);
      }
  }
});
