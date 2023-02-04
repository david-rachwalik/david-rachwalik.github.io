/*
============================================
; Title:  temp-conversion.js
; Author: David Rachwalik
; Date:   2021/11/06
; Description: Exercise 3.2 for Bellevue University course WEB-231
;===========================================
*/

(function () {
  function calcTemp() {
    const tempInput = document.getElementById('txtFahrenheit');
    // console.log("tempInput: " + tempInput);
    const fahrenheit = Number.parseFloat(tempInput.value);
    console.log(`fahrenheit: ${fahrenheit}`);
    let result = 0;
    if (fahrenheit > 0) {
      result = Number.parseFloat((fahrenheit - 32) / 1.8);
      console.log(`result: ${result}`);
    }
    const txtResult = document.getElementById('txtResult');
    // console.log("txtResult: " + txtResult);
    txtResult.innerHTML = result.toFixed(2);
  }

  const tempButton = document.getElementById('id');
  // console.log(tempButton);
  tempButton.onclick = calcTemp;
})();
