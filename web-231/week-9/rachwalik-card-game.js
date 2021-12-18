/*
============================================
; Title:  rachwalik-card-game.js
; Author: David Rachwalik
; Date:   2021/12/17
; Description: Exercise 9.2 for Bellevue University course WEB-231
;===========================================
*/

"use strict";
(function() {
    // -------- Define Classes --------
    class Card {
        constructor(face, suit) {
            this.face = face;
            this.suit = suit;
        };
    };
    
    class Dealer {
        constructor() {
            this.CARD_COUNT = 52;
            this.cards = [];
            this.faces = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
            this.suits = ["Hearts", "Diamonds", "Clubs", "Spades"];
            // Populate default cards
            this.getDeckOfCards();
        };
        
        getDeckOfCards() {
            for (let count = 0; count < this.CARD_COUNT; count++) {
                // During each loop, create card with correct face & suit
                this.cards[count] = new Card(this.faces[count % 13], this.suits[Math.floor(count / 13)]);
            }
            this._cards = [...this.cards]; // clone array of unshuffled cards
        };
        
        shuffle() {
            // console.log("--- start of card shuffle ---");
            for (let firstCard = 0; firstCard < this.CARD_COUNT; firstCard++) {
                let secondCard = Math.floor(Math.random() * firstCard);
                let tempCard = this.cards[firstCard];
                // Reorder the cards array
                this.cards[firstCard] = this.cards[secondCard];
                this.cards[secondCard] = tempCard;
            }
            // console.log("--- end of card shuffle ---");
        };
    };
    
    // -------- Define Methods --------
    function buildPlayingCard(card, suitIcon, faceColor, suitColor) {
        // Use backticks to return correctly formatted html
        let iconHtml = `<span class="${suitIcon}" style="color: ${suitColor}"></span>`;
        let cardHtml = `<div class="card player-card">
            <div class="card-title" style="color: ${faceColor}">${card.face}</div>
            <div class="card-content">${iconHtml}</div></div>`;
        return cardHtml;
    };

    // On click action
    function shuffleAndDealCards() {
        let dealer = new Dealer();
        // console.log("dealer: " + JSON.stringify(dealer));
        // console.log("dealer.faces: " + dealer.faces);
        // console.log("dealer.suits: " + dealer.suits);

        // console.log("dealer.cards[0]: " + dealer.cards[0].face + " of " + dealer.cards[0].suit);
        // console.log("dealer.cards[1]: " + dealer.cards[1].face + " of " + dealer.cards[1].suit);
        // console.log("dealer.cards[2]: " + dealer.cards[2].face + " of " + dealer.cards[2].suit);
        // console.log("dealer.cards: " + JSON.stringify(dealer.cards));
        dealer.shuffle();
        // console.log("dealer.cards: " + JSON.stringify(dealer.cards));

        let cardOutputWithIcon = "";
        for (const card of dealer.cards) {
            // console.log("card: " + JSON.stringify(card));
            switch (card.suit) {
                case 'Hearts':
                    cardOutputWithIcon += buildPlayingCard(card, "mdi mdi-cards-heart", "red", "red");
                    break;
                case 'Diamonds':
                    cardOutputWithIcon += buildPlayingCard(card, "mdi mdi-cards-diamond", "red", "red");
                    break;
                case 'Clubs':
                    cardOutputWithIcon += buildPlayingCard(card, "mdi mdi-cards-club", "black", "black");
                    break;
                case 'Spades':
                    cardOutputWithIcon += buildPlayingCard(card, "mdi mdi-cards-spade", "black", "black");
                    break;
                default:
                    console.log(`${card.suit} was not an expected value.`);
            }
        }
        // console.log("cardOutputWithIcon: " + cardOutputWithIcon);

        // Print result message to client display
        let playerCardContainer = document.getElementById("player-card-container");
        playerCardContainer.innerHTML = cardOutputWithIcon;
    };

    const submitButton = document.getElementById("btnDealCards");
    submitButton.onclick = shuffleAndDealCards;

})();