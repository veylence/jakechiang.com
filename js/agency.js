// Agency Theme JavaScript

(function ($) {
    "use strict"; // Start of use strict

    // jQuery for page scrolling feature - requires jQuery Easing plugin
    $("a.page-scroll").bind("click", function (event) {
        var $anchor = $(this);
        $("html, body").stop().animate({
            scrollTop: ($($anchor.attr("href")).offset().top - 50)
        }, 1250, "easeInOutExpo");
        event.preventDefault();
    });

    // Scrolling, only when page is smaller than a certain width
    $("a.page-scroll-mobile").bind("click", function (event) {
        if ($(window).width() < 768) {
            var $anchor = $(this);
            $("html, body").stop().animate({
                scrollTop: ($($anchor.attr("href")).offset().top - 50)
            }, 1250, "easeInOutExpo");
            event.preventDefault();
        }
    });

    // Highlight the top nav as scrolling occurs
    $("body").scrollspy({
        target: ".navbar-fixed-top",
        offset: 51
    });

    // Closes the Responsive Menu on Menu Item Click
    $(".navbar-collapse ul li a:not(.dropdown-toggle)").click(function () {
        $(".navbar-toggle:visible").click();
    });

    // Offset for Main Navigation
    $("#mainNav").affix({
        offset: {
            top: 100
        }
    })

    //Enable all tooltips
    $(document).ready(function () {
        $('[data-toggle="tooltip"]').tooltip();
    });

})(jQuery); // End of use strict
