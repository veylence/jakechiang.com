(function ($) {
    "use strict";

    const ALPHABET = "abcdefghijklmnopqrstuvwxyz";
    const NGRAM_SIZE = 4;
    const RESTART_LIMIT = 200;

    var ngramData = {};
    var floor;
    var countSum;

    $(document).ready(function () {
        loadNGrams();

        document.getElementById("caesar-cipher-encipher").onclick = caesarCipherEncipher;
        document.getElementById("caesar-cipher-decipher").onclick = caesarCipherDecipher;
        document.getElementById("caesar-cipher-break").onclick = caesarCipherBreak;

        document.getElementById("simple-sub-encipher").onclick = simpleSubEncipher;
        document.getElementById("simple-sub-decipher").onclick = simpleSubDecipher;
        document.getElementById("simple-sub-break").onclick = simpleSubBreak;
        document.getElementById("simple-sub-make-alphabet").onclick = simpleSubMakeAlphabet;
    });

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

    function scoreText(text) {
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
        if (caesarCipherErrorCheck(shift)) {
            var plaintext = document.getElementById("caesar-cipher-plaintext").value;
            var ciphertext = caesarCipher(plaintext, parseInt(shift)).toUpperCase();
            document.getElementById("caesar-cipher-ciphertext").value = ciphertext;
        }
    }

    function caesarCipherDecipher() {
        var shift = document.getElementById("caesar-cipher-key").value;
        if (caesarCipherErrorCheck(shift)) {
            var ciphertext = document.getElementById("caesar-cipher-ciphertext").value;
            var plaintext = caesarCipher(ciphertext, -parseInt(shift)).toLowerCase();
            document.getElementById("caesar-cipher-plaintext").value = plaintext;
        }
    }

    function caesarCipherErrorCheck(shift) {
        if (isNaN(shift) || shift === "") {
            logError("caesar-cipher", "An integer shift value must be given.");
            return false;
        }
        return true;
    }

    function caesarCipher(input, shift) {
        input = sanitize(input);

        var output = ""
        for (var i = 0; i < input.length; i++) {
            var c = input.charCodeAt(i);
            output += String.fromCharCode((((c - 97) + shift) % 26 + 26) % 26 + 97);
        }

        return output;
    }

    function caesarCipherBreak() {
        var ciphertext = document.getElementById("caesar-cipher-ciphertext").value;

        if (ciphertext.length < 4) {
            logError("caesar-cipher", "Ciphertext must be at least 4 characters long to attempt to break.");
            return;
        }

        var bestPlaintext = null;
        var bestScore;
        var bestShift;
        for (var i = 0; i < 26; i++) {
            var plaintext = caesarCipher(ciphertext, i);
            var score = scoreText(plaintext);
            logMessage("caesar-cipher", rpad("Shift: " + i, 12) + "Score: " + score + "\t" + plaintext);
            if (bestPlaintext === null || score > bestScore) {
                bestPlaintext = plaintext;
                bestScore = score;
                bestShift = i;
            }
        }
        bestShift = (26 - bestShift) % 26;

        logMessage("caesar-cipher", "Most probable shift is " + bestShift + " with a score of " + bestScore)

        document.getElementById("caesar-cipher-plaintext").value = bestPlaintext;
        document.getElementById("caesar-cipher-key").value = bestShift;
    }

    function simpleSubEncipher() {
        var ciphertextAlphabet = document.getElementById("simple-sub-key").value;
        if (simpleSubErrorCheck(ciphertextAlphabet)) {
            var plaintext = document.getElementById("simple-sub-plaintext").value;
            var ciphertext = simpleSub(plaintext, ALPHABET, ciphertextAlphabet).toUpperCase();
            document.getElementById("simple-sub-ciphertext").value = ciphertext;
        }
    }

    function simpleSubDecipher() {
        var ciphertextAlphabet = document.getElementById("simple-sub-key").value;
        if (simpleSubErrorCheck(ciphertextAlphabet)) {
            var ciphertext = document.getElementById("simple-sub-ciphertext").value;
            var plaintext = simpleSub(ciphertext, ciphertextAlphabet, ALPHABET).toLowerCase();
            document.getElementById("simple-sub-plaintext").value = plaintext;
        }
    }

    function simpleSubErrorCheck(ciphertextAlphabet) {
        if (ciphertextAlphabet.length != ALPHABET.length) {
            logError("simple-sub", "Ciphertext alphabet must be " + ALPHABET.length + " characters long");
            return false;
        } else if (!ciphertextAlphabet.match(/^[a-zA-Z]+$/)) {
            logError("simple-sub", "Ciphertext alphabet must consist of only alphabetic characters");
            return false;
        }
        return true;
    }

    function simpleSub(input, alphabet1, alphabet2) {
        input = sanitize(input);

        var output = "";
        for (var i = 0; i < input.length; i++) {
            var c = input.charAt(i);
            output += alphabet2.charAt(alphabet1.indexOf(c));
        }

        return output;
    }

    function simpleSubBreak() {
        var ciphertext = document.getElementById("simple-sub-ciphertext").value;

        if (ciphertext.length < 4) {
            logError("simple-sub", "Ciphertext must be at least 4 characters long to attempt to break.");
            return;
        }

        var ciphertextAlphabet = ALPHABET;
        // Generate a (semi) random ciphertext alphabet
        ciphertextAlphabet = shuffle(ciphertextAlphabet)

        var bestPlaintext = null;
        var bestScore;
        var bestCiphertextAlphabet;
        var prevBestScore = null;
        var restartsWithoutImprovement = 0;

        while (true) {
            var candidateAlphabet = ciphertextAlphabet;
            for (var j = 0; j < ALPHABET.length / 2; j++) {
                for (var k = 0; k < ALPHABET.length; k++) {
                    var plaintext = simpleSub(ciphertext, candidateAlphabet, ALPHABET);
                    var score = scoreText(plaintext);
                    if (bestPlaintext === null || score > bestScore) {
                        bestPlaintext = plaintext;
                        bestScore = score;
                        bestCiphertextAlphabet = candidateAlphabet;
                        logMessage("simple-sub", "New best found: " + score + "\t" + bestCiphertextAlphabet);
                    }
                    candidateAlphabet = swap(ciphertextAlphabet, j, k);
                }
            }
            ciphertextAlphabet = bestCiphertextAlphabet;

            if (prevBestScore != null && bestScore === prevBestScore) {
                restartsWithoutImprovement++;

                var ciphertextAlphabet = ALPHABET;
                ciphertextAlphabet = shuffle(ciphertextAlphabet);
            }
            prevBestScore = bestScore;

            if (restartsWithoutImprovement > RESTART_LIMIT) {
                logMessage("simple-sub", RESTART_LIMIT + " restarts with no improvement");
                break;
            }
            //            var index1 = Math.floor(Math.random() * ALPHABET.length);
            //            var index2 = Math.floor(Math.random() * ALPHABET.length);
            //            ciphertextAlphabet = swap(ciphertextAlphabet, index1, index2);
        }
    }
    
    function simpleSubBreakIteration() {
        
    }

    function shuffle(str) {
        for (var i = 0; i < 100; i++) {
            var index1 = Math.floor(Math.random() * str.length);
            var index2 = Math.floor(Math.random() * str.length);
            str = swap(str, index1, index2);
        }
        return str;
    }

    function swap(str, index1, index2) {
        if (index1 === index2) {
            return str;
        }

        var first = Math.min(index1, index2);
        var last = Math.max(index1, index2);
        return str.substring(0, first) + str.charAt(last) + str.substring(first + 1, last) + str.charAt(first) + str.substring(last + 1);
    }

    function simpleSubMakeAlphabet() {
        var key = sanitize(document.getElementById("simple-sub-key").value);

        var availableLetters = [];
        for (var i = 0; i < 26; i++) {
            availableLetters.push(String.fromCharCode(97 + i));
        }
        var alphabet = ""
        for (var i = 0; i < key.length; i++) {
            var c = key.charAt(i);
            if (availableLetters.indexOf(c) >= 0) {
                alphabet += c;
                availableLetters.splice(availableLetters.indexOf(c), 1);
            }
        }
        for (var i = 0; i < availableLetters.length; i++) {
            alphabet += availableLetters[i];
        }

        document.getElementById("simple-sub-key").value = alphabet;
    }

    function flash(id) {
        $("#" + id).fadeIn(100).fadeOut(100).fadeIn(100).fadeOut(100).fadeIn(100);
    }

    function logError(id, message) {
        logMessage(id, "ERROR: " + message);
    }

    function logMessage(id, message) {
        var log = document.getElementById(id + "-log");
        log.value += "\n" + message;
        log.scrollTop = log.scrollHeight;
    }

    function sanitize(str) {
        return str.replace(/[^a-zA-Z]/g, "").toLowerCase();
    }

    function rpad(str, len) {
        while (str.length < len) {
            str += " ";
        }
        return str;
    }
})(jQuery);
