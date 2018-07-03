// when the user clicks the meal icon ...
$(".meal-icon").on("click", function() {

    //slide icon to the top left
    $(".icon-div").addClass("animate slide-icon");

    // show hidden panels
    $(".right-side").addClass("display");
    $(".search-div").addClass("display");
    $(".menu-div").addClass("display");

    // show content to the right
    $(".content").fadeIn(1050);
});