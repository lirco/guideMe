 var GuideMe = function() {
  this.settings = new GuideMeSettings();
  this.handlers = {};

  // Holds the state of the curren
  this.state = {}
  this.menu = {
    "moodle.tau.ac.il" : [
      {
        id:"moodle_embed_slideshare", 
        title:"Embed Slideshare presentation"
      }, 
      { 
        id:"moodle_menu_label", 
        title:"Create label from template",
      }
    ]
  };

  // Register handlers
  this.registerHandler("getMenu",           this.getMenu.bind(this));
  this.registerHandler("uiLoaded",          this.uiLoaded.bind(this));
  this.registerHandler("actionStarted",     this.actionStarted.bind(this));

};

GuideMe.prototype.getMenu = function(request, sender, sendResponse)
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

// We assume one tutorial per taba at this point
GuideMe.prototype.actionStarted = function(request, sender, sendResponse)
{
  if (sender.tab.id in this.state)
  {
    this.state[sender.tab.id].actionId = request.actionId;
  }
  else
  {
    this.state[sender.tab.id] = {tutorialId: request.tutorialId, actionId:request.actionId}
  } 
}

GuideMe.prototype.uiLoaded = function(request, sender, sendResponse)
{
  var hostname = $('<a>').prop('href', sender.tab.url).prop('hostname');
  console.log("pageLoadedHandler: " + hostname);

  // Check if we support the site
  if (hostname in this.menu) 
  {
    var tabId = sender.tab.id;  
    chrome.pageAction.show(tabId);
    sendResponse({state: (tabId in this.state) ? this.state[tabId] : null});
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
  


