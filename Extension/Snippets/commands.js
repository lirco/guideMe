
/*
verify if user is logged in
The function should get the body of the document as input.
url : moodle.tau.co.il
 */
var isLoggedIn = function() {
    var status = $(".logininfo > a ").html();
    if (status == "התחבר/י" || status == "Login")
        alert('Log in first please');
    else
        alert('Welcome to this tutorial, ' + status);
};

/*
Identify the course
url : moodle.tau.co.il
 */
var chooseCourse = function() {
    $("#coursestable").css("background-color","yellow");
    alert('Choose a course please');
    $( ".courselink" ).click(function() {
        var courseName = $(".courselink > a ").html();
        alert( "the course clicked is " + courseName );
    });
};

/*
activating edit mode
url : http://moodle.tau.ac.il/course/view.php?id=SOME_ID
 */

var enableEditMode = function() {
    var status = $(".tree_item.leaf > a:first ").text();
    if (status == "כיבוי עריכה" || status == "Turn editing off") {
        alert('מעולה, מצב עריכה פועל כרגע, אפשר להמשיך');
    } else if (status == "הפעלת עריכה" || status == "Turn editing on") {
        alert('הפעל מצב עריכה כדי להמשיך');
    } else {
        alert('huston, we have a problem here.. check the code');
    }
};


/*
Choose asection of the course to add the content, and click on 'Add an activity or resource' button
url : http://moodle.tau.ac.il/course/view.php?id=SOME_ID
 */

var addActivity = function() {
    alert('בחר נושא בקורס אליו תרצה להוסיף תוכן ולחץ על "הוסף משאב או פעילות"');
    $("#gtopics > li .content > h3").css("color", "brown");
    $("#gtopics > li > .content .section-modchooser-text").css("color" , "blue");
    $("#gtopics > li > .content .section-modchooser-text").click(function() {
        alert('מעולה, נמשיך הלאה!')
    });
};


$("iframe #chooserform > .options > .alloptions > .option").text();



/**
 * chrome.tabs.getSelected(null,function(tab) {
    var url = tab.url;
 */


