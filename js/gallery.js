(function ($) {
    "use strict"; // Start of use strict

    var HEIGHT = 800;
    var ANIMATE_TIME = 500;

    var openProjectId = -1;

    $(document).ready(function () {
        // Begin with all videos paused
        for(var i = 0; i < $(".gallery-section video").length; i++) {
            $(".gallery-section video").get(i).onloadstart = function() {
                this.pause();
            };
        }
        
        //TODO Make more responsible to fast consecutive clicks
        $(".gallery-button").click(function (event) {
            var id = $(this).attr("data-gallery-button-id");
            var gallerySections = $(".gallery-section");

            //Find the gallery section with the corresponding ID as the button
            for (var i = 0; i < gallerySections.length; i++) {
                var gallerySection = gallerySections[i];

                //If the gallery section is found and is closed, open it
                if ($(gallerySection).attr("data-gallery-id") == id && "0" == $(gallerySection).height()) {
                    //Let the gallery section decide it's own height via "auto"
                    //then store and use for animation.
                    //TODO Find a better method than this hack
                    $(gallerySection).css("height", "auto");
                    var expandHeight = $(gallerySection).height();
                    $(gallerySection).css("height", 0);

                    //Animate open
                    $(gallerySection).animate({
                        height: expandHeight
                    }, ANIMATE_TIME);

                    // Play video when section is opened
                    if ($(gallerySection).find("video").length) {
                        $(gallerySection).find("video").get(0).play();
                    }

                    //Set this gallery section as "open"
                    $(gallerySection).attr("data-open", "true");
                    openProjectId = id;

                    setTimeout(fixOpenSectionSize, 500);
                }
                //Otherwise, close it if it's not the desired gallery, or even
                //if it is, since that means it should be closed
                else {
                    //Animate closed
                    $(gallerySection).animate({
                        height: 0
                    }, ANIMATE_TIME);

                    // Pause video when section is closed
                    if ($(gallerySection).find("video").length) {
                        $(gallerySection).find("video").get(0).pause();
                    }
                    
                    //Set this gallery section as "closed"
                    $(gallerySection).attr("data-open", "false");
                    if ($(gallerySection).attr("data-gallery-id") == id) {
                        openProjectId = -1;
                        /* TODO Ensure that this runs before the other in agency.js */
                        $("html, body").stop();
                    }
                }
            }

            event.preventDefault();
        });


        //If the window is resized, auto adjust the height of the open section
        $(window).resize(function () {
            fixOpenSectionSize();
        });
    });

    function fixOpenSectionSize() {
        var gallerySections = $(".gallery-section");

        for (var i = 0; i < gallerySections.length; i++) {
            var gallerySection = gallerySections[i];

            if ($(gallerySection).attr("data-gallery-id") == openProjectId) {
                $(gallerySection).css("height", "auto");
            }
        }
    }
})(jQuery); // End of use strict


//TODO
//TODO
//Make HTTPS of Shim and Respond and/or have own copy
