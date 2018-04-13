(function () {
    "use strict";
    
    // Size of a tile in the tilemap in pixels
    var TILE_SIZE = 16;

    // Code editor
    var codeMirror;
    // Game object
    var Game;

    // Set up game once the page has loaded
    $(document).ready(function () {
        var mainEditor = document.getElementById("main-editor");
        codeMirror = CodeMirror(function (elt) {
            mainEditor.parentNode.replaceChild(elt, mainEditor);
            elt.id = "main-editor";
        }, {
            mode: "javascript",
            lineNumbers: true,
            height: "100%"
        })
        codeMirror.setValue("function foo() { console.log(100); }");
        
        Game = {
            // The display console
            display: null,
            // Maps cells to values
            // Key: "x,y", Value: char
            map: {},

            init: function () {
                // Load tilemap
                var tileSetImage = document.createElement("img");
                tileSetImage.src = "/img/game/tileset.png";

                // Create display console
                this.display = new ROT.Display({
                    width: 50,
                    height: 50,
                    forceSquareRatio: true,
                    
                    layout: "tile",
                    tileWidth: TILE_SIZE,
                    tileHeight: TILE_SIZE,
                    tileSet: tileSetImage,
                    tileMap: {
                        "floor0": [TILE_SIZE * 0, TILE_SIZE * 1],
                        "floor1": [TILE_SIZE * 1, TILE_SIZE * 1],
                        "floor2": [TILE_SIZE * 2, TILE_SIZE * 1],
                        "floor3": [TILE_SIZE * 3, TILE_SIZE * 1],
                    }
                });
                document.getElementById("game-area").appendChild(this.display.getContainer());

                this._generateMap();
            },

            _generateMap: function () {
                var digger = new ROT.Map.Digger(40,40);
                var freeCells = [];

                var digCallback = function (x, y, value) {
                    if (value) {
                        return;
                    }

                    var key = x + "," + y;
                    this.map[key] = "floor0";
                    freeCells.push(key);
                }
                digger.create(digCallback.bind(this));

                this._generateBoxes(freeCells);

                this._drawWholeMap();
            },

            _generateBoxes: function (freeCells) {
                for (var i = 0; i < 10; i++) {
                    var index = Math.floor(ROT.RNG.getUniform() * freeCells.length);
                    var key = freeCells.splice(index, 1)[0];
                    // this.map[key] = "*";
                }
            },

            _drawWholeMap: function () {
                for (var key in this.map) {
                    var parts = key.split(",");
                    var x = parseInt(parts[0]);
                    var y = parseInt(parts[1]);
                    this.display.draw(x, y, this.map[key]);
                }
            }
        };

        Game.init();
    });
})();
