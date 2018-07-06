//toggle variables
var toggle = $('.toggleButton');
var toggleD= $('#toggle-container');
var toggleNumber;
//toggle function runners
$(window).on("load", toggler);
$(document).on("click", ".inner-container", toggler);
$(document).on("click", "#page1", goBack);
$(document).on("click", "#emailMe", mailBox);
//toggle function -- true is list, false is macros 
//the css change is just to illustrate where the data will be dumped
function toggler () {
    toggleNumber =!toggleNumber

    if (toggleNumber === false) {
        //Macro Dump
        $(".inner-container:nth-child(2)").css({"background": "whitesmoke", "color": "#a9a9a9"});
        $(".inner-container:first-child").css({"background": "#DA4E46", "color": "white"})
        $(".infoBox").css({"background": "#C4E5A9"})      
    } else {//toggleNumber === true//
        //List Dump
        $(".inner-container:nth-child(2)").css({"background": "#DA4E46", "color": "white"});
        $(".inner-container:first-child").css({"background": "whitesmoke", "color": "#a9a9a9"})        
        $(".infoBox").css({"background": "#B2E0E6"})      
    }
    console.log(toggleNumber)
};
//button function to page1 
function goBack () {
    window.location='index.html';
  };

//send to mailbox function 
function mailBox () {
   window.location="https://mail.google.com/";
};
  