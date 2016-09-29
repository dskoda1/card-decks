'use strict';

let _ = require('lodash');
let Card = require('./Card');


Array.prototype.removeRandom = function() {
    // Pick random element
    let random = _.random(0, this.length - 1);
    // Splice returns array, only splicing 1 so return first and only ele
    return this.splice(random, 1)[0];
};

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
    // Return the number of occurences of this card left in the active pile
    has(combo) {
        // Will throw Card.badCombo if invalid combo
        Card.validateCombo(combo);
        
        // Return the number of occurences 
        return _.filter(this.activeCards, (card) => {
           return (card.suit == combo.suit && card.rank == combo.rank); 
        })
        .length;
    }
    
    hasBeenPulled(combo) {
        // Will throw Card.badCombo if invalid combo
        Card.validateCombo(combo);
        // Return the number of occurences 
        return _.filter(this.inactiveCards, (card) => {
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
    
    // Return the bottom card without removing it.
    // Throws Deck.OUT_OF_CARDS if no more cards remain
    peekBottom() {
        const remainingSize = this.remainingSize();
        if (remainingSize > 0) {
            return this.activeCards[0];
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
        return this._pull(Array.prototype.pop, n);
    }
    
    // Return the bottom n cards and remove them. Default to 1 card
    // if not passed anything.
    // Throws Deck.BAD_AMOUNT if specified 'n' is less than 1.
    // Throws Deck.OUT_OF_CARDS if specified 'n' more than remaining.
    pullBottom(n) {
        return this._pull(Array.prototype.shift, n);
    }
    
    // Return n random cards and remove them. Default to 1 card
    // if not passed anything.
    // Throws Deck.BAD_AMOUNT if specified 'n' is less than 1.
    // Throws Deck.OUT_OF_CARDS if specified 'n' more than remaining.
    pullRandom(n) {
        return this._pull(Array.prototype.removeRandom, n);
    }
    
    // Internal method: called with an Array.prototype method,
    // and a number of cards to remove.
    _pull(arrMethod, n) {
        if (n === undefined) {
            n = 1;
        }
        
        if (n < 1) {
            throw Error(g_BAD_AMOUNT);
        }
        if (n > this.remainingSize()) {
            throw Error(g_OUT_OF_CARDS);
        }
        
        if (typeof arrMethod !== 'function') {
            throw Error('Programmer error- only calling this method internally');
        }
            
        // Now get the cards
        let cards = [];
        for (let i = 0; i < n; ++i) {
            // retrieve a card from active
            let card = arrMethod.call(this.activeCards);
            // Push it on inactive
            this.inactiveCards.push(card);
            // Push it on ret
            cards.push(card);
        }
        if (cards.length === 1) {
            return cards[0];
        }
        else {
            return cards;
        }
    }
    
    
    // Shuffle all the active cards, deferring to lodash shuffle
    // https://lodash.com/docs/4.15.0#shuffle
    shuffle() {
        this.activeCards = _.shuffle(this.activeCards);
    }
    
    
    replaceTop(cards) {
        this._replace(Array.prototype.push, cards);
    }
    
    _replace(arrMethod, cards) {
        
        if (cards == undefined || cards == null) {
            // Make sure pulled + remaining == to 
            if (this.pulledSize() + this.remainingSize() != this.numDecks * Deck.CardsPerDeck) {
                throw Error(g_TAMPERED_WITH);
            }

            for (let i = 0; i < this.pulledSize(); ++i) {
                arrMethod.call(this.activeCards, this.inactiveCards[i]);
            }            
            this.inactiveCards = [];
        }
        
    }
    
    deal(args) {
        // Validate the args
        args = args || {};
        args.players = args.players || 4;
        args.cards = args.cards || (Deck.CardsPerDeck * this.numDecks / 4);
        
        // Initialize the return array
        let hands = [];
        for (let i = 0; i < args.players; ++i) {
            hands.push([]);
        }
        
        // Iterate over number of cards each player gets
        for (let i = 0; i < args.cards; ++i) {
            // Iterate over each player and give them a card
            for (let j = 0; j < args.players; ++j) {
                hands[j].push(this.pullTop());
            }
        }
        
        return hands;
    }   
    
    
    // STATIC METHODS
    static get BAD_AMOUNT() {
        return g_BAD_AMOUNT;
    }
    
    static get OUT_OF_CARDS() {
        return g_OUT_OF_CARDS;
    }
    
    static get TAMPERED_WITH() {
        return g_TAMPERED_WITH;
    }
    
    static get CardsPerDeck() {
        return g_CardsPerDeck;
    }
}

module.exports = Deck;

const g_BAD_AMOUNT = {
    type: 'BAD_AMOUNT',
    error: 'Invalid amount of cards requested. Must be at least 1.'
};

const g_OUT_OF_CARDS = {
    type: 'OUT_OF_CARDS',
    error: 'No more cards are available to pull. Replace cards to continue.'
};

const g_TAMPERED_WITH = {
    type: 'OUT_OF_CARDS',
    error: 'No more cards are available to pull. Replace cards to continue.'
};



const g_CardsPerDeck = 52;

