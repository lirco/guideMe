
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
activating editing mode
url : http://moodle.tau.ac.il/course/view.php?id=SOME_ID
 */

var status = $(".tree_item.leaf > a ").css("background-color","yellow");



location.href;

