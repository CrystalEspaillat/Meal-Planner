// when the user clicks the back arrow ...
$(".back-arrow").on("click", function() {
        //slide icon back to center
        $(".icon-div").addClass("animate close-panels");
        $(".icon-div").removeClass("animate slide-icon");

        // hide the recipe side panel
        $(".right-side").removeClass("display");
        //hide the search div
        $(".search-div").removeClass("display");
        //hide the menu div
        $(".menu-div").removeClass("display");
        //hide the back arrow itself
        $(".back-arrow").removeClass("display");

        // show content to the right
        $(".content").fadeOut(1050);

        // Show the meal icons
        $('.meal-icon').show();

        // if the meal plan was clicked ....
        if($('.meal-icon').attr('click-status') === 'yes'){

                // Toggle back to unclicked status
                $(this).attr('click-status', 'no');
        }

        // Clear out search form
        $('#search').val('');
});