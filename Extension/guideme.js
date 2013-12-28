var GuideMe = function() {
    Settings: new GuideMeSettings()
}

var guideme = new GuideMe();

chrome.extension.onMessage.addListener(
  function(request, sender, sendResponse) {
    console.log(sender.tab ? "from a content script:" + sender.tab.url : "from the extension");
    if (request.enabled != 'undefined')
    {
      // Context script 
      var b = chrome.extension.getBackgroundPage();
      var guidemeEnabled = b.guideme.Settings.get("enabled", "true");

      if (guidemeEnabled === "true") 
      {
        var hostname = $('<a>').prop('href', sender.tab.url).prop('hostname');
        console.log(hostname);
        // check if this extension is enabled for this domain
        if (hostname === "localhost")
        {
            guidemeEnabled = "false";
        }
      }

      sendResponse({enabled: guidemeEnabled});
    }
  });
