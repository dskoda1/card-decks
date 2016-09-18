'use strict';

let chai = require('chai');
let expect = chai.expect;
let _ = require('lodash');
//let assert = chai.assert;

let Card = require('../src').Card;

describe('Card', () => {
    describe('Card Constructor', () => {
        let CARD_BAD_INIT = Card.BAD_INIT;

        it('Should throw if not passed an object with suit and rank properties', () => {
            // No object
            expect(() => new Card()).to.throw(CARD_BAD_INIT);
            
            // Only suit
            let obj = {
                'suit': 'Hearts'
            };
            expect(() => new Card(obj)).to.throw(CARD_BAD_INIT);
            
            // Only rank
            obj = {
                'rank': 'Jack'
            };
            expect(() => new Card(obj)).to.throw(CARD_BAD_INIT);
        });
        
        it ('Should validate and assign the suit and rank passed', () => {
            let RANKS = Card.RANKS;
            let SUITS = Card.SUITS;
            // Iterate over ranks
            _.forEach(_.values(RANKS, (rank/*, i, ranks*/) => {
                // Iterate over suits
                _.forEach(_.values(SUITS, (suit/*, j, suits*/) => {
                    // Do this to try ever combination
                    let obj = {
                        'rank': rank,
                        'suit': suit
                    };
                    let card = new Card(obj);
                    expect(card.getSuit()).to.equal(suit);
                    expect(card.getRank()).to.equal(rank);
                    
                }));
            }));
        });
        
    });
});