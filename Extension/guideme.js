 var GuideMe = function() {
  this.settings = new GuideMeSettings();
  this.handlers = {};
  this.menu = {
    "moodle.tau.ac.il" : ["Embed Slideshare presentation", "Create label from template"]
  };

  // Register handlers
  this.registerHandler("getMenu", this.getMenuHandler.bind(this));
  this.registerHandler("pageLoaded", this.pageLoadedHandler.bind(this));
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

  if (request.method != 'undefined')
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

//
chrome.extension.onMessage.addListener(
  function(request, sender, sendResponse) {
    /* // This works
    console.log("=======================================");
    console.log(request);
    console.log(sender);
    console.log(sendResponse);
    if (typeof  sender.tab != 'undefined' && typeof sender.tab.id != 'undefined') {
      chrome.pageAction.show(sender.tab.id);
    }
    sendResponse("test");
    */

    var b = chrome.extension.getBackgroundPage();
    b.guideme.onMessage(request, sender, sendResponse);
    return true;
  });
