(function () {
    "use strict";

    const NGRAM_SIZE = 4;

    var ngramData = {};
    var floor;
    var countSum;

    document.onready = function () {
        loadNGrams();
        
        document.getElementById("caesar-cipher-encipher").onclick = caesarCipherEncipher;
        document.getElementById("caesar-cipher-decipher").onclick = caesarCipherDecipher;
        document.getElementById("caesar-cipher-break").onclick = caesarCipherBreak;
    }
    
    function loadNGrams() {
        countSum = 0;

        var i = 0;
        while (i < NGRAMS.length) {
            var ngram = "";
            var count = "";

            // Parse ngram
            for (var j = 0; j < NGRAM_SIZE; j++) {
                ngram += NGRAMS.charAt(i + j);
            }
            i += NGRAM_SIZE;

            // Parse count
            var c = NGRAMS.charAt(i);
            while (c >= '0' && c <= '9') {
                count += c;
                i++;
                c = NGRAMS.charAt(i);
            }
            var countNum = parseInt(count);
            countSum += countNum;

            // Add to map
            ngramData[ngram] = countNum;
        }

        for (var ngram in ngramData) {
            ngramData[ngram] = Math.log10(ngramData[ngram] / countSum);
        }
        floor = Math.log10(0.01 / countSum);
    }

    function score(text) {
        text = text.toUpperCase();
        
        var score = 0;
        for (var i = 0; i < text.length - NGRAM_SIZE + 1; i++) {
            var ngram = "";
            for (var j = 0; j < NGRAM_SIZE; j++) {
                ngram += text.charAt(i + j);
            }
            if (ngram in ngramData) {
                score += ngramData[ngram];
            } else {
                score += floor;
            }
        }
        return score;
    }
    
    function caesarCipherEncipher() {
        var shift = document.getElementById("caesar-cipher-key").value;
        if(isNaN(shift) || shift === "") {
            flash("caesar-cipher-error");
            showError("caesar-cipher-error", "An integer shift value must be given.");
            flash("caesar-cipher-key");
        } else {
            var plaintext = document.getElementById("caesar-cipher-plaintext").value;
            var ciphertext = caesarCipher(plaintext, parseInt(shift)).toUpperCase();
            document.getElementById("caesar-cipher-ciphertext").value = ciphertext;
            flash("caesar-cipher-ciphertext");
        }
    }
    
    function caesarCipherDecipher() {
        var shift = document.getElementById("caesar-cipher-key").value;
        if(isNaN(shift) || shift === "") {
            flash("caesar-cipher-error");
            showError("caesar-cipher-error", "An integer shift value must be given.");
            flash("caesar-cipher-key");
        } else {
            var ciphertext = document.getElementById("caesar-cipher-ciphertext").value;
            var plaintext = caesarCipher(ciphertext, -parseInt(shift)).toLowerCase();
            document.getElementById("caesar-cipher-plaintext").value = plaintext;
            flash("caesar-cipher-plaintext");
        }
    }
    
    function caesarCipher(input, shift) {
        input = input.replace(/[^a-zA-Z]/g, "").toLowerCase();
        
        var output = ""
        for(var i = 0; i < input.length; i++) {
            var c = input.charCodeAt(i);
            output += String.fromCharCode((((c - 97) + shift) % 26 + 26) % 26 + 97);
        }
        
        clearError("caesar-cipher-error");
        return output;
    }
    
    function caesarCipherBreak() {
        clearError("caesar-cipher-error");
    }
    
    function flash(id) {
        $("#" + id).fadeIn(100).fadeOut(100).fadeIn(100).fadeOut(100).fadeIn(100);
    }
    
    function showError(id, message) {
        var alertBox = document.getElementById(id);
        alertBox.innerHTML = "<strong>Error:</strong> " + message
        alertBox.style.display = "block";
    }
    
    function clearError(id) {
        document.getElementById(id).style.display = "none";
    }
})();
