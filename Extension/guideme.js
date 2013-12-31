 var GuideMe = function() {
  this.settings = new GuideMeSettings();
  this.handlers = {};
  this.menu = {
    "moodle.tau.ac.il" : [
      {
        id:"moodle_menu_slideshare", 
        title:"Embed Slideshare presentation"
      }, 
      { 
        id:"moodle_menu_label", 
        title:"Create label from template",
      }
    ]
  };

  this.actions = {
    "moodle_menu_slideshare" : 
      {
          "start" : "moodle_login",
          "moodle_login" : {
              // Login action
              description: "You have to login to moodle in order to continue",
              title: "",
              next: "moodle_enter_course"
          },
          "moodle_enter_course" : {
              description: "Now enter your course",
              title: ""   
          }
      },
  }

  // Register handlers
  this.registerHandler("getMenu",    this.getMenuHandler.bind(this));
  this.registerHandler("onMenu",     this.onMenuHandler.bind(this));
  this.registerHandler("pageLoaded", this.pageLoadedHandler.bind(this));
  this.registerHandler("nextAction", this.nextActionHandler.bind(this));
};

GuideMe.prototype.getMenuHandler = function(request, sender, sendResponse)
{
  var hostname = $('<a>').prop('href', request.url).prop('hostname');
  console.log("getMenuHandler: " + hostname);
  if (hostname in this.menu)
  {
    sendResponse({"menu":this.menu[hostname]});
  }
  else
  {
    console.error("Menu not defined for: " + hostname);
  }
}

GuideMe.prototype.runAction = function(tabId, tutorialId, actionId)
{
    console.log("runAction: tabId = "+ tabId + " tutorialId = " + tutorialId + " actionId = " + actionId);
    // TODO: Check that tutorial exists
    var tutorial = this.actions[tutorialId];
    var action = tutorial[actionId];
    
    chrome.tabs.sendMessage(tabId, {method: "showAction", action:action}, function(response) {
        console.log("Running action");
        console.log(response);
    });
}

GuideMe.prototype.onMenuHandler = function(request, sender, sendResponse)
{
  console.log("On Menu: " + request.id);
  // find the first action in the activated tutorial and run it
  
  // TODO:check that we are not in the middle of another tutorial
}

GuideMe.prototype.nextActionHandler = function(request, sender, sendResponse)
{
  this.runAction(sender.tab.id, request.tutorialId, request.actionId);
}

GuideMe.prototype.pageLoadedHandler = function(request, sender, sendResponse)
{
  var hostname = $('<a>').prop('href', sender.tab.url).prop('hostname');
  console.log("pageLoadedHandler: " + hostname);

  // Check if we support the site
  if (hostname in this.menu) 
  {
    chrome.pageAction.show(sender.tab.id);
    sendResponse({enabled: true});

  }
  return true;
}

GuideMe.prototype.registerHandler = function(method, handler)
{
  console.log("Register handler for message: " + method);
  this.handlers[method] = handler;
}

GuideMe.prototype.onMessage = function(request, sender, sendResponse)
{
  // TODO: Add check that extension is enabled in settings
  // var guidemeEnabled = b.guideme.settings.get("enabled", "true");

  if (typeof request.method != 'undefined')
  {
    var method = request.method;
    console.log("Processing message: " + method);
    
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

// Main object which holds application business logic and state
var guideme = new GuideMe();

// Setup message listener
chrome.extension.onMessage.addListener(
  function(request, sender, sendResponse) {
    var b = chrome.extension.getBackgroundPage();
    b.guideme.onMessage(request, sender, sendResponse);
    return true;
  });
