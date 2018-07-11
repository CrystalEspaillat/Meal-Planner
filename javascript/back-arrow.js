// when the user clicks the meal icon ...
$(".back-arrow").on("click", function() {
        //slide icon back to center
        $(".icon-div").addClass("animate close-panels");
        $(".icon-div").removeClass("animate slide-icon");


        // hide the panels
        $(".right-side").removeClass("display");
        $(".search-div").removeClass("display");
        $(".menu-div").removeClass("display");
        $(".back-arrow").removeClass("display");

        // show content to the right
        $(".content").fadeOut(1050);

        $('.meal-icon').show();
        if($('.meal-icon').attr('click-status') === 'yes'){
                $(this).attr('click-status', 'no');
        }

        $('#search').val('');
});