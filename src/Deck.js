'use strict';

let _ = require('lodash');
let Card = require('./Card');



class Deck {
    // This class provides an interface for creating and accessing
    // playing cards in a deck. It can be used to simulate one to
    // n card decks and defaults to just a single if not told 
    // otherwise in the constructor.
    //////////////////////////////////////////////////////////////////////
    constructor(init) {
        if (init && init.numDecks) {
            this.numDecks = init.numDecks;
        }
        else {
            this.numDecks = 1;
        }
        
        // Create the deck now
        this.createDeck();
    }
    
    // Helper function for setting the cards in this deck
    createDeck() {
        this.activeCards = [];
        this.inactiveCards = [];
        _.forEach(Card.Combinations, (combo) => {
            for (let i = 0; i < this.numDecks; ++i) {
                this.activeCards.push(new Card(combo));
            }
        });
    }
    //////////////////////////////////////////////////////////////////////
    
    //////////////////////////////////////////////////////////////////////
    // Return the array of cards that are still active
    // PRIVATE??
    getRemaining() {
        return this.activeCards;
    }
    
    // Return the array of cards that have been pulled already
    // PRIVATE??
    getPulled() {
        return this.inactiveCards;
    }
    //////////////////////////////////////////////////////////////////////
    
    // SIZE METHODS //////////////////////////////////////////////////////
    // The total number of cards left in this deck
    totalSize() {
        return this.activeCards.length + this.inactiveCards.length;
    }
    
    // The number of remaining cards
    remainingSize() {
        return this.activeCards.length;
    }
    
    // The number of cards that have been pulled
    pulledSize() {
        return this.inactiveCards.length;
    }
    
    // The number of decks this deck is comprised of
    decks() {
        return this.numDecks;
    }
    //////////////////////////////////////////////////////////////////////
    
    //////////////////////////////////////////////////////////////////////
    // Return the number of occurences of this card in this deck
    has(combo) {
        // Will throw Card.badCombo if invalid combo
        Card.validateCombo(combo);
        
        // Return the number of occurences 
        return _.filter(this.activeCards, (card) => {
           return (card.suit == combo.suit && card.rank == combo.rank); 
        })
        .length;
    }
    // Return the top card without removing it.
    // Throws Deck.OUT_OF_CARDS if no more cards remain
    peekTop() {
        const remainingSize = this.remainingSize();
        if (remainingSize > 0) {
            return this.activeCards[remainingSize - 1];
        }
        else {
            throw Error(g_OUT_OF_CARDS);
        }
    }
    
    // Return the top n cards and remove them. Default to 1 card
    // if not passed anything.
    // Throws Deck.BAD_AMOUNT if specified 'n' is less than 1.
    // Throws Deck.OUT_OF_CARDS if specified 'n' more than remaining.
    pullTop(n) {
        if (n !== undefined && n !== 1) {
            // Make sure more than 0
            if (n < 1) {
                throw Error(g_BAD_AMOUNT);
            }
            // Make sure enough cards left
            else if (n > this.remainingSize()) {
                throw Error(g_OUT_OF_CARDS);
            }
            
            
            // Now get the cards
            let cards = [];
            for (let i = 0; i < n; ++i) {
                // Pop a card from active
                let card = this.activeCards.pop();
                // Push it on inactive
                this.inactiveCards.push(card);
                // Push it on ret
                cards.push(card);
            }
            return cards;
        }
        else {
            // Make sure at least one card left
            if (this.remainingSize() < 1) {
                throw Error(g_OUT_OF_CARDS);
            }
            // Get the card
            let card = this.activeCards.pop();
            this.inactiveCards.push(card);
            return card;
        }
    }
   
    // Shuffle all the active cards, deferring to lodash shuffle
    // https://lodash.com/docs/4.15.0#shuffle
    shuffle() {
        
    }
    
    // STATIC METHODS
    static get BAD_AMOUNT() {
        return g_BAD_AMOUNT;
    }
    
    static get OUT_OF_CARDS() {
        return g_OUT_OF_CARDS;
    }
    
    
}

module.exports = Deck;

let g_BAD_AMOUNT = {
    type: 'BAD_AMOUNT',
    error: 'Invalid amount of cards requested. Must be at least 1.'
};

let g_OUT_OF_CARDS = {
    type: 'OUT_OF_CARDS',
    error: 'No more cards are available to pull. Replace cards to continue.'
};

