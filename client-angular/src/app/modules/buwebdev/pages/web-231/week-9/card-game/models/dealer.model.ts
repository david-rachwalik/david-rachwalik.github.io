import { Card } from './card.model';

export class Dealer {
  CARD_COUNT = 52;
  cards: Card[] = [];
  faces = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
  suits = ['Hearts', 'Diamonds', 'Clubs', 'Spades'];

  constructor() {
    // Populate default cards
    this.getDeckOfCards();
  }

  getDeckOfCards() {
    for (let count = 0; count < this.CARD_COUNT; count += 1) {
      // During each loop, create card with correct face & suit
      this.cards[count] = new Card(
        this.faces[count % 13],
        this.suits[Math.floor(count / 13)],
      );
    }
    // this._cards = [...this.cards]; // clone array of unshuffled cards
  }

  shuffle() {
    // console.log("--- start of card shuffle ---");
    for (
      let firstCardIndex = 0;
      firstCardIndex < this.CARD_COUNT;
      firstCardIndex += 1
    ) {
      const secondCardIndex = Math.floor(Math.random() * firstCardIndex);
      const tempCard = this.cards[firstCardIndex];
      // Reorder the cards array
      this.cards[firstCardIndex] = this.cards[secondCardIndex];
      this.cards[secondCardIndex] = tempCard;
    }
    // console.log("--- end of card shuffle ---");
  }
}
