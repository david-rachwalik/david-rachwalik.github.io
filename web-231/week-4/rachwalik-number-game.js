/*
============================================
; Title:  rachwalik-number-game.js
; Author: David Rachwalik
; Date:   2021/11/13
; Description: Exercise 4.2 for Bellevue University course WEB-231
;===========================================
*/

"use strict";
(function() {
    // Generate random number between 1 & 10
    const rnd = Math.floor((Math.random() * 10) + 1);
    console.log("rnd: " + rnd);

    function calcNumberGame() {
        let tempInput = document.getElementById("txtMyNumber");
        let myNumber = Number.parseFloat(tempInput.value);
        // console.log("myNumber: " + myNumber);

        let result = "";
        if (myNumber > rnd) {
            result = "The number is less than " + myNumber;
        } else if (myNumber < rnd) {
            result = "The number is greater than " + myNumber;
        } else {
            result = "Congratulations! You picked the correct number!";
        }
        // console.log("result: " + result);

        // Print result message to client display
        let txtResult = document.getElementById("txtResult");
        txtResult.innerHTML = result;
    };

    let submitButton = document.getElementById("id");
    submitButton.onclick = calcNumberGame;

})();