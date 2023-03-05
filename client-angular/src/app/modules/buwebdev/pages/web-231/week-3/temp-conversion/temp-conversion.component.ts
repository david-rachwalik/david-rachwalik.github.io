import { Component } from '@angular/core';

@Component({
  selector: 'app-temp-conversion',
  templateUrl: './temp-conversion.component.html',
  styleUrls: ['./temp-conversion.component.css'],
})
export class TempConversionComponent {
  calcTemp(): void {
    const tempInput = document.getElementById(
      'txtFahrenheit',
    ) as HTMLInputElement;
    // console.log("tempInput: " + tempInput);
    if (tempInput === null) {
      return;
    }

    const fahrenheit = Number.parseFloat(tempInput.value);
    console.log(`fahrenheit: ${fahrenheit}`);
    let result = 0;
    if (fahrenheit > 0) {
      result = (fahrenheit - 32) / 1.8;
      console.log(`result: ${result}`);
    }

    const txtResult = document.getElementById('txtResult');
    // console.log("txtResult: " + txtResult);
    if (txtResult === null) {
      return;
    }
    txtResult.innerHTML = result.toFixed(2);
  }

  // ngOnInit() {
  //   const tempButton = document.getElementById('id');
  //   // console.log(tempButton);
  //   tempButton.onclick = calcTemp;
  // }
}
