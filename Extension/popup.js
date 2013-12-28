var GuideMeMenu = function() {

}

$( document ).ready(function() {
  // Get the contents of the menu from the background script
  console.log("Sending message to background");
  chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
    var url = tabs[0].url;
    chrome.extension.sendMessage({method:'getMenu', url:url}, function(response)
    {
      console.log("Received response, zzzzzzzzzzzzzzz");
      console.log(response);

      var menuItems = response['menu'];
      console.log(menuItems);
      _.each(menuItems, function(item) {
        console.log(item);
        $('#guideme_menu').append('<p>' + item + '</p>');
      });
    });
  });
  
});