var GuideUI = function() {
  this.handlers = {};
  this.tutorials = {};

  //this.registerHandler("nextAction",    this.nextActionHandler.bind(this));
  //this.registerHandler("showAction",    this.showActionHandler.bind(this));
  this.registerHandler("startTutorial",   this.startTutorial.bind(this));
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

GuideUI.prototype.startTutorial = function(request, sender, sendResponse)
{
  console.log("Start tutorial: " + request.tutorialId);
  // TODO:check that we are not in the middle of another tutorial

  // Check if we have this tutorial
  if (request.tutorialId in this.tutorials)
  {
    tutorial = this.tutorials[request.tutorialId];
    action = tutorial[tutorial.start];
    
    chrome.extension.sendMessage({method: "actionStarted", tutorialId:tutorial.id, actionId:action.id});

    this.showAction(action);
  }
}

GuideUI.prototype.getAction = function(tutorialId, actionId)
{
  var tutorial = this.tutorials[tutorialId];
  var action = tutorial[actionId];
  return action;
}

GuideUI.prototype.runAction = function(tutorialId, actionId)
{
  action = this.getAction(tutorialId, actionId);
  this.showAction(action);
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
  if (response.state != null) // we are in the middle of the tutorial
  {
    var tutorialId = response.state.tutorialId;
    var actionId   = response.state.actionId;
    
    console.log("Resume tutorial: " + tutorialId + " from action: " + actionId);

    var action = guideui.getAction(tutorialId, actionId)
    if (action != null) 
    {
        // Check if post conditions of the current action are satisfied, move to the next one
        if (action.post() == true)
        {
            guideui.runAction(tutorialId, action.next);
        }
    }
    else
    {
      console.error("Unable to resume tutorial: " + tutorialId + ", action not found: " + actionId);
    }
  }
});
