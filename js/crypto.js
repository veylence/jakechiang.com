//TODO: Make more efficient: don't recreate the entire map each time (?) may not be possible

(function () {
    "use strict";

    var FREQ = ["e", "t", "a", "o", "i", "n", "s", "h", "r", "d", "l", "c", "u", "m", "w", "f", "g", "y", "p", "b", "v", "k", "j", "x", "q", "z"];


    $("#freq-input").on("input propertychange", function () {
        var input = $("#freq-input").val();
        
        input = input.replace(/[^a-zA-Z ]/g, '');
        input = input.toLowerCase();

        if (input == "") {
            var output = "";
        } else {
            var freq = getFrequency(input);
            var sortedFreq = sort(freq);
            var replaceMap = getReplaceMap(sortedFreq);
            var output = mapReplace(input, replaceMap);
        }

        $("#freq-output").val(output);
    });

    function mapReplace(str, replaceMap) {
        delete replaceMap[" "]; //Preserve spaces
        
        var regex = new RegExp(Object.keys(replaceMap).join("|"), "g");
        return str.replace(regex, function (m) {
            return replaceMap[m];
        });
    }

    function getReplaceMap(freq) {
        var replaceMap = {};

        for (var i = 0; i < freq.length; i++) {
            replaceMap[freq[i]] = FREQ[i];
        }

        return replaceMap;
    }

    function sort(freq) {
        var sorted = Object.keys(freq).sort(function (a, b) {
            return freq[b] - freq[a];
        });

        return sorted;
    }

    function getFrequency(str) {
        var freq = {};

        for (var i = 0; i < str.length; i++) {
            var char = str.charAt(i);

            if (freq[char]) {
                freq[char]++;
            } else {
                freq[char] = 1;
            }
        }

        return freq;
    }

    //From https://stackoverflow.com/questions/3446170/
    function escapeRegExp(str) {
        return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
    }
})();
