
(function ($) {
    "use strict"; // Start of use strict

    var GRID_WIDTH = 100;
    //    var GRID_HEIGHT = 100; //TODO

    var BOX_SIZE = 15;

    var grid = {};

    $(document).ready(function () {
        initializeGrid();
    });

    function initializeGrid() {
        var height = $("#header").height() / BOX_SIZE;
        grid.height = height;

        for (var y = 0; y < height; y++) {
            for (var x = 0; x < GRID_WIDTH; x++) {
                var box = $(document.createElement("div"));
                box.addClass("grid-box");
                $(box).css({
                    left: x * BOX_SIZE,
                    top: y * BOX_SIZE
                });
                $(box).css({
                    width: BOX_SIZE,
                    height: BOX_SIZE
                });
                $("#grid-area").append(box);
            }
        }

        updateOverlay();
    }

    function updateOverlay() {        
        var height = BOX_SIZE * grid.height;

        $("#grid-area-overlay").css({
            height: height
        });
    }
})(jQuery); // End of use strict
