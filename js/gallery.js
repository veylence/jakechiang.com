(function ($) {
    "use strict";

    var HEIGHT = 800;
    var ANIMATE_TIME = 500;

    var openProjectId = -1;

    $(document).ready(function () {
        // Hide gallery sections so that LazyLoad doesn't load their media yet
        $(".gallery-section").each(function() {
            $(this).css("visibility", "hidden");
            $(this).css("display", "none");
        });


        // Initialize LazyLoad
        runLazyLoad();


        // Begin with all videos paused
        for(var i = 0; i < $(".gallery-section video").length; i++) {
            $(".gallery-section video").get(i).onloadstart = function() {
                this.pause();
            };
        }

        // Disable scrolling if on a large screen (desktop), since then
        // the user can already see the gallery section area and doesn't
        // need assistance scrolling to it.
        if ($(window).width() >= 768) {
            $("#projects-section").find(".gallery-button").each(function(index) {
                $(this).attr("href", "javascript:void(0);");
            });
        }

        // TODO Make more responsible to fast consecutive clicks
        $(".gallery-button").click(function (event) {
            var id = $(this).attr("data-gallery-button-id");
            var gallerySections = $(".gallery-section");

            // Find the gallery section with the corresponding ID as the button
            for (var i = 0; i < gallerySections.length; i++) {
                var gallerySection = gallerySections[i];

                // If the gallery section is found and is closed, open it.
                // If the gallery section has the "data-always-open" tag, then
                // open it no matter what.
                if ($(gallerySection).attr("data-gallery-id") == id && ("0" == $(gallerySection).height() || hasAttr($(this).attr("data-always-open")))) {
                    // Let the gallery section decide it's own height via "auto"
                    // then store and use for animation.
                    $(gallerySection).css("height", "auto");
                    var expandHeight = $(gallerySection).height();
                    $(gallerySection).css("height", 0);

                    // Make gallery visible so that LazyLoad loads media
                    $(gallerySection).each(function() {
                        $(this).css("visibility", "visible");
                        $(this).css("display", "inline");
                    });

                    //Animate open
                    $(gallerySection).animate({
                        height: expandHeight
                    }, ANIMATE_TIME);

                    // Play video when section is opened
                    if ($(gallerySection).find("video").length !== 0) {
                        var video = $(gallerySection).find("video").get(0);

                        var isLoaded = $(video).attr("data-loaded");
                        if (!hasAttr(isLoaded)) {
                            var source = $(video).find("source").get(0);
                            $(source).attr("src", $(source).attr("data-lazy-src"));
                            $(video).attr("data-loaded", "true");
                            video.load();
                        }
                        playVideo(video);
                    }

                    // Load lazy gallery images
                    // $(gallerySection).find("img").each(function() {
                    //     var lazySrc = $(this).attr("data-lazy-src");
                    //     if (typeof lazySrc !== typeof undefined && lazySrc !== false) {
                    //         $(this).attr("data-src", lazySrc);
                    //     }
                    // });
                    // runLazyLoad();

                    // Set this gallery section as "open"
                    $(gallerySection).attr("data-open", "true");
                    openProjectId = id;

                    // $(window).trigger("gallerySectionOpened");
                    // window.dispatchEvent(gallerySectionOpenedEvent);

                    $(gallerySection).find("img").each(function() {
                        $(this).lazyLoadXT({show: true});
                    });

                    // setTimeout(fixOpenSectionSize, 500);
                }
                // Otherwise, close it if it's not the desired gallery, or even
                // if it is, since that means it should be closed
                else {
                    //Animate closed
                    $(gallerySection).animate({
                        height: 0
                    }, ANIMATE_TIME);


                    // Pause video when section is closed
                    if ($(gallerySection).find("video").length !== 0) {
                        $(gallerySection).find("video").get(0).pause();
                    }
                    
                    // Set this gallery section as "closed"
                    $(gallerySection).attr("data-open", "false");
                    if ($(gallerySection).attr("data-gallery-id") == id) {
                        openProjectId = -1;
                        /* TODO Ensure that this runs before the other in main.js */
                        $("html, body").stop();
                    }
                }
            }
            event.preventDefault();

            // Disable scrolling if on a large screen (desktop), since then
            // the user can already see the gallery section area and doesn't
            // need assistance scrolling to it.
            if ($(window).width() >= 768) {
                $("#projects-section").find(".gallery-button").each(function(index) {
                    $(this).attr("href", "javascript:void(0);");
                });
            }
        });

        setInterval(fixOpenSectionSize, 200);

        //If the window is resized, auto adjust the height of the open section
        $(window).resize(function () {
            fixOpenSectionSize();
        });
    });

    // Fix painting gallery size as images load
    $(".painting-gallery-image").bind("load", function() {
        fixOpenSectionSize();
    })
//        .each(function() {
//        if(this.complete) {
//            $(this).load();
//        }
//    });

function hasAttr(attr) {
    return typeof attr !== typeof undefined && attr !== false;
}

function fixOpenSectionSize() {
    var gallerySections = $(".gallery-section");

    for (var i = 0; i < gallerySections.length; i++) {
        var gallerySection = gallerySections[i];

        if ($(gallerySection).attr("data-gallery-id") == openProjectId) {
            $(gallerySection).css("height", "auto");
        }
    }
}

function playVideo(video) {
    if (video.readyState > 2) {
        video.play();
    } else {
        setTimeout(function() {
            playVideo(video);
        }, 10);
    }
}

function runLazyLoad() {
    if($("#lazy-load-script").length !== 0) {
        $("#lazy-load-script").remove();
    }

    var head = document.getElementsByTagName("head")[0];
    var script = document.createElement("script");
    script.id = "lazy-load-script";
    script.src = "/vendor/lazy-load/jquery.lazyloadxt.extra.js";
    head.appendChild(script);
}
})(jQuery);
