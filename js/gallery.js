(function ($) {
    "use strict"; // Start of use strict

    var HEIGHT = 800;
    var ANIMATE_TIME = 500;

    var openProjectId = -1;

    $(document).ready(function () {
        $(".gallery-button").click(function (event) {
            var id = $(this).attr("data-gallery-button-id");
            var gallerySections = $(".gallery-section");

            for (var i = 0; i < gallerySections.length; i++) {
                var gallerySection = gallerySections[i];

                if ($(gallerySection).attr("data-gallery-id") == id && "0" == $(gallerySection).height()) {
                    //TODO Find a better method than this hack
                    $(gallerySection).css("height", "auto");
                    var expandHeight = $(gallerySection).height();
                    $(gallerySection).css("height", 0);

                    $(gallerySection).animate({
                        height: expandHeight
                    }, ANIMATE_TIME);

                    $(gallerySection).attr("data-open", "true");
                    openProjectId = id;
                } else {
                    $(gallerySection).animate({
                        height: 0
                    }, ANIMATE_TIME);

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


        $(window).resize(function () {
            var gallerySections = $(".gallery-section");

            for (var i = 0; i < gallerySections.length; i++) {
                var gallerySection = gallerySections[i];

                if ($(gallerySection).attr("data-gallery-id") == openProjectId) {
                    $(gallerySection).css("height", "auto");
                }
            }
        });
    });
})(jQuery); // End of use strict


//TODO
//TODO
//Make HTTPS of Shim and Respond and/or have own copy
