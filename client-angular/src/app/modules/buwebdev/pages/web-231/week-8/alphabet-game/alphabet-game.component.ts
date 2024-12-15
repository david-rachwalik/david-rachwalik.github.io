import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatCard, MatCardContent, MatCardTitle } from '@angular/material/card';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-alphabet-game',
  templateUrl: './alphabet-game.component.html',
  styleUrls: ['./alphabet-game.component.css'],
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
export class AlphabetGameComponent implements OnInit {
  // -------- Define Variables --------
  alphabet = [
    'A',
    'B',
    'C',
    'D',
    'E',
    'F',
    'G',
    'H',
    'I',
    'J',
    'K',
    'L',
    'M',
    'N',
    'O',
    'P',
    'Q',
    'R',
    'S',
    'T',
    'U',
    'V',
    'W',
    'X',
    'Y',
    'Z',
  ];

  ngOnInit(): void {
    let alphabetOutput = '';
    // for (const key in alphabet) {
    //   alphabetOutput += `, ${alphabet[key]}`;
    // }
    // // Loops should be avoided in favor of array iterations
    // for (const value of alphabet) {
    //   alphabetOutput += `, ${value}`;
    // }
    this.alphabet.forEach((value) => {
      alphabetOutput += `, ${value}`;
    });
    alphabetOutput = alphabetOutput.slice(2);

    // Display the letters in alphabet
    const txtAlphabet = document.getElementById('txtAlphabet');
    if (txtAlphabet === null) {
      return;
    }
    txtAlphabet.innerHTML = alphabetOutput;
  }

  // On click action
  toggleCard() {
    const txtPosition = document.getElementById(
      'txtPosition',
    ) as HTMLInputElement;
    const pos = Number(txtPosition.value);
    console.log(`pos: ${pos}`);
    const letter = this.alphabet[pos - 1];
    console.log(`letter: ${letter}`);

    let result = '';
    if (letter === undefined) {
      result = `There are not ${pos} letters in the alphabet`;
    } else {
      result = `${letter} is at position ${pos} in the alphabet`;
    }
    // console.log("result: " + result);

    // Print result message to client display
    const txtResult = document.getElementById('txtResult');
    if (txtResult === null) {
      return;
    }
    txtResult.innerHTML = result;
  }

  // const submitButton = document.getElementById('btnFindLetter');
  // submitButton.onclick = toggleCard;
}
