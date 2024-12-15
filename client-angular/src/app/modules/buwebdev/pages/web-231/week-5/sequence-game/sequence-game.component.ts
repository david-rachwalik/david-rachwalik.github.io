import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatCard, MatCardContent, MatCardTitle } from '@angular/material/card';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-sequence-game',
  templateUrl: './sequence-game.component.html',
  styleUrls: ['./sequence-game.component.css'],
  standalone: true,
  imports: [
    MatCard,
    MatCardTitle,
    MatCardContent,
    FormsModule,
    MatButton,
    RouterLink,
  ],
})
export class SequenceGameComponent {
  calcNumberGame(): void {
    const tempInput = document.getElementById('sequence') as HTMLInputElement;
    const choice = tempInput.value;
    // console.log("choice: " + choice);

    let result = '-';
    if (choice === 'fibonacci') {
      let fibonacciSequenceText = '';
      let num1 = 0;
      let num2 = 1;
      let next = 2;
      while (num1 < 40) {
        fibonacciSequenceText = `${fibonacciSequenceText + num1.toString()}, `;
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
        evenSequenceText = `${evenSequenceText + num1.toString()}, `;
        // console.log("evenSequenceText: " + evenSequenceText);
        num1 += 2;
      }
      result = evenSequenceText.slice(0, -2);
      // console.log("result: " + result);
    } else if (choice === 'odd') {
      let oddSequenceText = '';
      let num1 = 1;
      while (num1 < 20) {
        oddSequenceText = `${oddSequenceText + num1.toString()}, `;
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
    if (txtResult === null) {
      return;
    }
    txtResult.innerHTML = result;
  }

  // const submitButton = document.getElementById('btnDisplaySequence');
  // submitButton.onclick = calcNumberGame;
}
