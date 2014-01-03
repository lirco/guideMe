var GuideMeMenu = function() {

}


$( document ).ready(function() {
  // Get the contents of the menu from the background script
  console.log("Sending message to background");
  chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
    var url = tabs[0].url;
    var tabId = tabs[0].id;
    chrome.extension.sendMessage({method:'getMenu', url:url}, function(response)
    {
      var menuItems = response['menu'];
      _.each(menuItems, function(item) {
        $('#guideme_menu').append('<p><a href="#" class="guideme_menu_item" id="'+item.id+'">'+item.title+'</a></p>');
      });

      // Attach on click handler
      $('.guideme_menu_item').click(function(){
        var tutorialId = $(this).attr('id');
        chrome.tabs.sendMessage(tabId, {method:'startTutorial', tutorialId:tutorialId});
        window.close();
      });
    });
  });
  
});