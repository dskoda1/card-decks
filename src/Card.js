'use strict';

let _ = require('lodash');

class Card {
    // This class simulates a standard playing card.
    // It can be one of 4 suits and 1 of 13 ranks 
    // defined below the class definition. These values
    // are accessible as Card.SUITS and Card.RANKS
    
    // CONSTRUCTORS
    constructor(init) {
        if (Card.validateCombo(init)) {
            this.suit = init.suit;
            this.rank = init.rank;
        }
        else {
            throw Error(Card.BAD_INIT);
        }
    }
    
    // ACCESSORS
    getSuit () {
        return this.suit;
    }
    
    getRank () {
        return this.rank;
    }
    
    // STATIC CLASS MEMBERS
    static validateCombo(combo) {
        if (combo 
            && Card.validateSuit(combo.suit)
            && Card.validateRank(combo.rank)) {
            return true;
        }
        else {
            throw Error(g_BAD_COMBO);
        }
    }
    
    // This method validates the specified
    // 'suit' is one that Card uses.
    static validateSuit(suit) {
        return (_.indexOf(_.values(Card.SUITS), suit)
                    > -1);
    }

    // This method validates the specified
    // 'rank' is one that Card uses.    
    static validateRank(rank) {
        return (_.indexOf(_.values(Card.RANKS), rank) 
                    > -1);
    }
    
    static get RANKS () {
        return g_RANKS;
    }
    static get SUITS () {
        return g_SUITS;
    }
    static get BAD_INIt() {
        return g_BAD_INIT;
    }
    static get BAD_COMBO() {
        return g_BAD_COMBO;
    }
    static get Combinations() {
        let combos = [];
        _.forEach(_.values(Card.RANKS), (rank/*, i, ranks*/) => {
            // Iterate over suits
            _.forEach(_.values(Card.SUITS), (suit/*, j, suits*/) => {
                combos.push({
                    'rank': rank,
                    'suit': suit
                });
            });
        });
        return combos;
    }
    
}


module.exports = Card;

// Class variables for Card
const g_BAD_INIT = {
    type: 'BAD_INIT',
    error: 'Card requires an object with ' +
        'suit and rank properties during construction.'
};

const g_BAD_COMBO = {
    type: 'BAD_CARD_COMBO',
    error: 'This card combination does not exist.'
};


const g_SUITS = {
    HEARTS: 'Hearts',
    DIAMONDS: 'Diamonds',
    SPADES: 'Spades',
    CLUBS: 'Clubs'
};

const g_RANKS = {
    ACE: 'Ace',
    TWO: '2',
    THREE: '3',
    FOUR: '4',
    FIVE: '5',
    SIX: '6',
    SEVEN: '7',
    EIGHT: '8',
    NINE: '9',
    TEN: '10',
    JACK: 'Jack',
    QUEEN: 'Queen',
    KING: 'King'
};
