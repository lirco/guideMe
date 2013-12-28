chrome.extension.onMessage.addListener(
  function(request, sender, sendResponse) {
    console.log(sender.tab ? "from a content script:" + sender.tab.url : "from the extension");
    if (request.enabled != 'undefined')
    {
      // Context script 
      var b = chrome.extension.getBackgroundPage();
      var sharezEnabled = b.sharez.Settings.get("enabled", "true");

      if (sharezEnabled === "true") 
      {
        var hostname = $('<a>').prop('href', sender.tab.url).prop('hostname');
        console.log(hostname);
        // check if this extension is enabled for this domain
        if (hostname === "localhost")
        {
            sharezEnabled = "false";
        }
      }

      sendResponse({enabled: sharezEnabled});
    }
  });
