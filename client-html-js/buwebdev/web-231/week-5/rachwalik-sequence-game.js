/*
============================================
; Title:  rachwalik-sequence-game.js
; Author: David Rachwalik
; Date:   2021/11/20
; Description: Exercise 5.2 for Bellevue University course WEB-231
;===========================================
*/

(function () {
  function calcNumberGame() {
    const tempInput = document.getElementById('sequence');
    const choice = tempInput.value;
    // console.log("choice: " + choice);

    let result = '';
    if (choice === 'fibonacci') {
      let fibonacciSequenceText = '';
      let num1 = 0;
      let num2 = 1;
      let next = 2;
      while (num1 < 40) {
        fibonacciSequenceText = `${fibonacciSequenceText + num1}, `;
        // console.log("fibonacciSequenceText: " + fibonacciSequenceText);
        next = num1 + num2;
        num1 = num2;
        num2 = next;
      }
      result = fibonacciSequenceText.slice(0, -2);
      // console.log("result: " + result);
    } else if (choice === 'even') {
      let evenSequenceText = '';
      let num1 = 2;
      while (num1 < 20) {
        evenSequenceText = `${evenSequenceText + num1}, `;
        // console.log("evenSequenceText: " + evenSequenceText);
        num1 += 2;
      }
      result = evenSequenceText.slice(0, -2);
      // console.log("result: " + result);
    } else if (choice === 'odd') {
      let oddSequenceText = '';
      let num1 = 1;
      while (num1 < 20) {
        oddSequenceText = `${oddSequenceText + num1}, `;
        // console.log("oddSequenceText: " + oddSequenceText);
        num1 += 2;
      }
      result = oddSequenceText.slice(0, -2);
      // console.log("result: " + result);
    } else {
      alert('Invalid selection, please try again!');
    }
    // console.log("result: " + result);

    // Print result message to client display
    const txtResult = document.getElementById('txtResult');
    txtResult.innerHTML = result;
  }

  const submitButton = document.getElementById('btnDisplaySequence');
  submitButton.onclick = calcNumberGame;
})();
