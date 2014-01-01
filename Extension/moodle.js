
/*
verify if user is logged in
The function should get the body of the document as input.
url : moodle.tau.co.il
 */
function isLoggedIn() {
    var status = $(".logininfo > a ").html();
    return (status != "התחבר/י" && status != "Login") 
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

/*
Choose the Lable option and clicking on "add" submit button
url : http://moodle.tau.ac.il/course/view.php?id=SOME_ID
 */
var chooseResourse = function() {
    $("#chooserform > .options > .alloptions > .option:nth-child(39) .typename").css("background-color", "gray");
    alert('בחר ב"פסקה מעוצבת"')
    $("#chooserform > .options > .alloptions > .option:nth-child(39) .typename").click(function() {
        alert('מעולה, בחרת בפיסקה מעוצבת');
        $("#chooseform .submitbuttons > .submitbutton").css("color","blue");
        alert('כעת לחץ על "הוספה"');
        $("#chooseform .submitbuttons > .submitbutton").click(function() {
            alert('מעולה, עכשיו נוסיף את הלינק');
        });
    });
};

/*
Adding the url to the dedicated field and saving changes
url :
 */
var insertString = function() {
    $("#id_introeditor_ifr").css("height","60px");
    $("#id_submitbutton2").css("color","blue");
    alert('הכנס את הלינק לכאן ולחץ על "שמירת שינויים וחזרה לקורס"');
    $("#id_submitbutton2").click(function() {
       alert('נהדר, סיימנו! התוכן החדש מחכה לך בדף הקורס');
    });
};



/**
 * chrome.tabs.getSelected(null,function(tab) {
    var url = tab.url;
 */


