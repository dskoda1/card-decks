'use strict';

let _ = require('lodash');


class Card {
    
    constructor(init) {
        this.BAD_INIT = g_BAD_INIT;
        this.SUITS = g_SUITS;
        this.RANKS = g_RANKS;
        if (init
            && this.validateSuit(init.suit)
            && this.validateRank(init.rank)) {
            this.suit = init.suit;
            this.rank = init.rank;
        }
        else {
            throw Error(this.BAD_INIT);
        }
    }
    
    validateSuit(suit) {
        return (_.indexOf(_.values(this.SUITS), suit)
                    > -1);
    }
    
    validateRank(rank) {
        return (_.indexOf(_.values(this.RANKS), rank) 
                    > -1);
    }
    
    getSuit () {
        return this.suit;
    }
    
    getRank () {
        return this.rank;
    }
    
}

module.exports = Card;

// Class variables for Card
const g_BAD_INIT = 'Card requires an object with ' +
        'suit and rank properties during construction.';

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
