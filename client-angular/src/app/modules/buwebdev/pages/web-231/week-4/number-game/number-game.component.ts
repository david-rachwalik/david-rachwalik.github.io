import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatCard, MatCardContent, MatCardTitle } from '@angular/material/card';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-number-game',
  templateUrl: './number-game.component.html',
  styleUrls: ['./number-game.component.css'],
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
export class NumberGameComponent {
  // Generate random number between 1 & 10
  rnd = Math.floor(Math.random() * 10 + 1);

  calcNumberGame(): void {
    // console.log(`rnd: ${this.rnd}`);
    const tempInput = document.getElementById(
      'txtMyNumber',
    ) as HTMLInputElement;
    if (tempInput === null) {
      return;
    }
    const myNumber = Number.parseFloat(tempInput.value);
    // console.log("myNumber: " + myNumber);

    let result = '';
    if (myNumber > this.rnd) {
      result = `The number is less than ${myNumber}`;
    } else if (myNumber < this.rnd) {
      result = `The number is greater than ${myNumber}`;
    } else {
      result = 'Congratulations! You picked the correct number!';
    }
    // console.log("result: " + result);

    // Print result message to client display
    const txtResult = document.getElementById('txtResult');
    if (txtResult === null) {
      return;
    }
    txtResult.innerHTML = result;
  }

  // const submitButton = document.getElementById('id');
  // submitButton.onclick = calcNumberGame;
}
