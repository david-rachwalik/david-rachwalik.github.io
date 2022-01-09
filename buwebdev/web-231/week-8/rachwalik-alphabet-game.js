/*
============================================
; Title:  rachwalik-alphabet-game.js
; Author: David Rachwalik
; Date:   2021/12/12
; Description: Exercise 8.2 for Bellevue University course WEB-231
;===========================================
*/

"use strict";
(function() {
    // -------- Define Variables --------
    const alphabet = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L",
        "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
    
    let alphabetOutput = "";
    for (let key in alphabet) {
        alphabetOutput += ", " + alphabet[key];
    }
    alphabetOutput = alphabetOutput.slice(2);

    // Display the letters in alphabet
    const txtAlphabet = document.getElementById("txtAlphabet");
    txtAlphabet.innerHTML = alphabetOutput;

    // On click action
    function toggleCard() {
        const txtPosition = document.getElementById("txtPosition");
        const pos = Number(txtPosition.value);
        console.log("pos: " + pos);
        const letter = alphabet[pos - 1];
        console.log("letter: " + letter);

        let result = "";
        if (letter === undefined) {
            result = `There are not ${pos} letters in the alphabet`;
        } else {
            result = `${letter} is at position ${pos} in the alphabet`;
        }
        // console.log("result: " + result);

        // Print result message to client display
        let txtResult = document.getElementById("txtResult");
        txtResult.innerHTML = result;
    };

    const submitButton = document.getElementById("btnFindLetter");
    submitButton.onclick = toggleCard;

})();