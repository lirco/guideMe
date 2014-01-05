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
    chrome.extension.sendMessage({method: "startTutorial", tutorialId:request.tutorialId, domains:tutorial.domains});
    this.showAction(request.tutorialId, tutorial.start);
  }
}

GuideUI.prototype.updateStatus = function(action)
{
  chrome.extension.sendMessage({method: "actionStarted", tutorialId:action.tutorialId, actionId:action.id});
}

GuideUI.prototype.getAction = function(tutorialId, actionId)
{
  var tutorial = this.tutorials[tutorialId];
  var action   = tutorial[actionId];

  if (typeof action != 'undefined')
  {
    action.id         = actionId;
    action.tutorialId = tutorialId;    
  }
  else
  {
    console.error("No action found: tutorialId: " + tutorialId + " actionId: " + actionId);
  }

  return action;
}

GuideUI.prototype.addTutorial = function(tutorial)
{
  this.tutorials[tutorial.id] = tutorial;
  chrome.extension.sendMessage({method: "registerTutorial", tutorial:tutorial});
}

GuideUI.prototype.showAction = function(tutorialId, actionId) 
{
  var action = this.getAction(tutorialId, actionId);

  this.updateStatus(action);
  
  var buttons = [{name: "Next", onclick: function() {
     
    if (action.post() == true)
    {
      guiders.hideAll();
      guideui.showAction(tutorialId, action.next);
    }
    return true;
  }}];
  
  if (action.hasOwnProperty('act'))
  {
      buttons.push({name: action.actionLabel, onclick: function() {
          action.act();   
      }});
  }

  this.guide = guiders.createGuider({
    attachTo: action.selector,
    position: action.position,
    buttons: buttons,
    description: action.description,
    title: action.title,
    autoFocus: action.hasOwnProperty('autoFocus') ? action.autoFocus : false,
    id: action.id,
    next: "fourth", //TODO: Think how to implement UI state machine
    width: action.width
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
            guideui.showAction(tutorialId, action.next);
        }
    }
    else
    {
      console.error("Unable to resume tutorial: " + tutorialId + ", action not found: " + actionId);
    }
  }
});
