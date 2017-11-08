// Agency Theme JavaScript

(function ($) {
    "use strict"; // Start of use strict

//    var NAVBAR_HIDE_HEIGHT = 150;
    var NAVBAR_HIDE_HEIGHT = 240;

    // jQuery for page scrolling feature - requires jQuery Easing plugin
    $("a.page-scroll").bind("click", function (event) {
        var $anchor = $(this);
        $("html, body").stop().animate({
            scrollTop: ($($anchor.attr("href")).offset().top - 50)
        }, 1250, "easeInOutExpo");
        event.preventDefault();
    });

    // Scrolling, only when page is smaller than a certain width
    $("a.page-scroll-mobile").bind("click.scroll", function (event) {
        //if ($(window).width() < 768) {
        var $anchor = $(this);
        $("html, body").stop().animate({
            scrollTop: ($($anchor.attr("href")).offset().top - 75)
        }, 1250, "easeInOutExpo");
        event.preventDefault();
        //}

        //        if ($(window).width() >= 768) {
        //            //            setTimeout(function() {
        //            var buttons = $("a.page-scroll-mobile");
        //            for (var i = 0; i < buttons.length; i++) {
        //                $(buttons[i]).unbind("click.scroll");
        //            }
        //            //            }, 1250);
        //        }
    });
    // Just disable all scrolling if on desktop (easier fix than removing class tags, and quicker to revert)
    //    if ($(window).width() >= 768) {
    //            setTimeout(function() {
    var buttons = $("a.page-scroll-mobile");
    for (var i = 0; i < buttons.length; i++) {
        $(buttons[i]).unbind("click.scroll");
    }
    //            }, 1250);
    //    }

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
            top: NAVBAR_HIDE_HEIGHT
        }
    })

    //    $(".hex").hover(function () {
    //        $(this).animate({
    //            nonExistantPropertyName: 100
    //        }, {
    //            step: function (now, fx) {
    //                $(this).css("-webkit-filter", "brightness(" + now + "%) invert(" + (100 - 100) + "%)");
    //            },
    //            duration: "slow"
    //        }, "linear");
    ////        $(this).css("-webkit-filter", "brightness(100%) invert(0%)");
    //    }, function () {
    //        $(this).animate({
    //            nonExistantPropertyName: 0
    //        }, {
    //            step: function (now, fx) {
    //                $(this).css("-webkit-filter", "brightness(" + now + "%) invert(" + (100 - 0) + "%)");
    //            },
    //            duration: "slow"
    //        }, "linear");
    ////        $(this).css("-webkit-filter", "brightness(0%) invert(100%)");
    //    });

    //Enable all tooltips
    $(document).ready(function () {
        // Hide navbar until the page is sufficiently scrolled
        $(".navbar-hide").hide();
        $(function () {
            $(window).scroll(function () {
                if ($(this).scrollTop() > NAVBAR_HIDE_HEIGHT) {
                    $(".navbar-hide").fadeIn();
                } else {
                    $(".navbar-hide").fadeOut();
                }
            });
        });

        $('[data-toggle="tooltip"]').tooltip();

        //Fixing iOS double-tap issue for links
        //via http://cssmenumaker.com/blog/solving-the-double-tap-issue-on-ios-devices
        //        $('a').on('click touchend', function (e) {
        //            var el = $(this);
        //            var link = el.attr('href');
        //            window.location = link;
        //        });

        //Cancels dragging immediately upon drag start
        $(".undraggable").on("dragstart", function (event) {
            return false;
        });

        //        //Navigation image grow on hover over
        //        $(".hex").hover(
        //            function () {
        //                $(this).animate({
        //                    width: 135,
        //                    height: 135
        //                }, 100);
        //            },
        //            function () {
        //                $(this).animate({
        //                    width: 125,
        //                    height: 125
        //                }, 100);
        //            }
        //        );

        //See function below
        $("header").css("height", $("header").height() + "px");
    });

    //Gets the natural height of the header and then locks it to be that height.
    //This way when the .hex buttons are hovered over and they change size the
    //header's height doesn't increase and push everything around.
    //TODO: Find a non-hacky way of doing this
    $(window).resize(function () {
        $("header").css("height", "inherit");
        $("header").css("height", $("header").height() + "px");
    });

    function updateHeader() {
        $("header").css("height", $("header").height() + "px");
    }

})(jQuery); // End of use strict
