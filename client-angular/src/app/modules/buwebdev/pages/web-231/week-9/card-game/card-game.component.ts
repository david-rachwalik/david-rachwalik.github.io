import { Component, OnInit } from '@angular/core';

import { Card } from './models/card.model';
import { Dealer } from './models/dealer.model';

@Component({
  selector: 'app-card-game',
  templateUrl: './card-game.component.html',
  styleUrls: ['./card-game.component.css'],
})
export class CardGameComponent implements OnInit {
  ngOnInit(): void {
    // Client downloads the icons without them being including in this app's styles
    const mdiCssUrl =
      'https://cdn.jsdelivr.net/npm/@mdi/font@latest/css/materialdesignicons.min.css';

    const link = document.createElement('link');
    link.href = mdiCssUrl;
    link.rel = 'stylesheet';
    link.type = 'text/css';

    document.head.appendChild(link);
  }

  buildPlayingCard(
    card: Card,
    suitIcon: string,
    faceColor: string,
    suitColor: string,
  ): string {
    // Use backticks to return correctly formatted html
    const iconHtml = `<span class="${suitIcon}" style="color: ${suitColor}"></span>`;
    const cardHtml = `<div class="card player-card">
            <div class="card-title" style="color: ${faceColor}">${card.face}</div>
            <div class="card-content">${iconHtml}</div></div>`;
    return cardHtml;
  }

  // On click action
  shuffleAndDealCards(): void {
    const dealer = new Dealer();
    // console.log("dealer: " + JSON.stringify(dealer));
    // console.log("dealer.faces: " + dealer.faces);
    // console.log("dealer.suits: " + dealer.suits);

    // console.log("dealer.cards[0]: " + dealer.cards[0].face + " of " + dealer.cards[0].suit);
    // console.log("dealer.cards[1]: " + dealer.cards[1].face + " of " + dealer.cards[1].suit);
    // console.log("dealer.cards[2]: " + dealer.cards[2].face + " of " + dealer.cards[2].suit);
    // console.log(`dealer.cards: ${JSON.stringify(dealer.cards)}`);
    dealer.shuffle();
    // console.log(`dealer.cards: ${JSON.stringify(dealer.cards)}`);

    let cardOutputWithIcon = '';
    dealer.cards.forEach((card) => {
      switch (card.suit) {
        case 'Hearts':
          cardOutputWithIcon += this.buildPlayingCard(
            card,
            'mdi mdi-cards-heart',
            'red',
            'red',
          );
          break;
        case 'Diamonds':
          cardOutputWithIcon += this.buildPlayingCard(
            card,
            'mdi mdi-cards-diamond',
            'red',
            'red',
          );
          break;
        case 'Clubs':
          cardOutputWithIcon += this.buildPlayingCard(
            card,
            'mdi mdi-cards-club',
            'black',
            'black',
          );
          break;
        case 'Spades':
          cardOutputWithIcon += this.buildPlayingCard(
            card,
            'mdi mdi-cards-spade',
            'black',
            'black',
          );
          break;
        default:
          console.log(`${card.suit} was not an expected value.`);
      }
    });
    // console.log("cardOutputWithIcon: " + cardOutputWithIcon);

    // Print result message to client display
    const playerCardContainer = document.getElementById(
      'player-card-container',
    );
    if (playerCardContainer === null) {
      return;
    }
    playerCardContainer.innerHTML = cardOutputWithIcon;
  }

  // const submitButton = document.getElementById('btnDealCards');
  // submitButton.onclick = shuffleAndDealCards;
}
