(function ($) {
    "use strict"; // Start of use strict

    var BOX_SIZE = 15;
    var GRID_HEIGHT = 20;

    var grid = [];
    var gridWidth = 0;

    $(document).ready(function () {
        initializeGrid();
    });

    function initializeGrid() {
        $("#grid").height(GRID_HEIGHT * BOX_SIZE);

        for (var y = 0; y < GRID_HEIGHT; y++) {
            grid.push([]);
        }

        fillGrid();
        
        setInterval(function() {
            var y = Math.round(Math.random() * GRID_HEIGHT);
            var x = Math.round(Math.random() * gridWidth);
//            grid[y][x].css("background-color","rgb("+55+","+(Math.round(Math.random()*100)+155)+","+(Math.round(Math.random()*200)+55)+")");
        }, 100);
    }
    
    //Adds columns of grid boxes until window is filled horizontally
    function fillGrid() {
        var windowWidth = $(window).width();
        var currGridWidth = grid[0].length * BOX_SIZE;

        if (currGridWidth < windowWidth) {
            var columnsToAdd = Math.ceil((windowWidth - currGridWidth) / BOX_SIZE);
            gridWidth += columnsToAdd;
            
            for (var i = 0; i < columnsToAdd; i++) {
                for (var y = 0; y < grid.length; y++) {
                    addNewBox(grid[y].length, y);
                }
            }
        }
    }

    //Adds a new box at the x,y position
    function addNewBox(x, y) {
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

        $("#grid").append(box);
        grid[y].push(box);
    }

    //Attempts to fill grid (if window is resized to be larger)
    $(window).resize(function () {
        fillGrid();
    });

    //
    //    function updateOverlay() {        
    //        var height = BOX_SIZE * grid.height;
    //
    //        $("#grid-area-overlay").css({
    //            height: height
    //        });
    //    }
})(jQuery); // End of use strict
