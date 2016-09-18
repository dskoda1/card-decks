'use strict';

let chai = require('chai');
let expect = chai.expect;
let _ = require('lodash');
//let assert = chai.assert;

let Card = require('../src').Card;

describe('Card', () => {
    describe('Card Constructor', () => {

        it('Should throw BAD_INIT if not passed an object with suit and rank properties', () => {
            // No object
            expect(() => new Card()).to.throw(Card.BAD_INIT);
            
            // Only suit
            let obj = {
                'suit': Card.SUITS.HEARTS
            };
            expect(() => new Card(obj)).to.throw(Card.BAD_INIT);
            
            // Only rank
            obj = {
                'rank': Card.RANKS.FIVE
            };
            expect(() => new Card(obj)).to.throw(Card.BAD_INIT);
        });
        
        it ('Should throw BAD_COMBO if object passed is invalid', () => {
            // Bad suit
            let obj = {
                'suit': 'asdfs',
                'rank': Card.RANKS.TWO
            };
            expect(() => new Card(obj)).to.throw(Card.BAD_COMBO);
            
            // Bad rank
            obj = {
                'suit': Card.SUITS.HEARTS,
                'rank': '34234'
            };
            expect(() => new Card(obj)).to.throw(Card.BAD_COMBO);
            
            // both bad
            obj = {
                'suit': 'hello',
                'rank': '34234'
            };
            expect(() => new Card(obj)).to.throw(Card.BAD_COMBO);
        });
        
        it ('Should validate and assign the suit and rank passed', () => {
            // Iterate over ranks
            _.forEach(Card.Combinations, (obj) => {
                let card = new Card(obj);
                    expect(card.suit).to.equal(obj.suit);
                    expect(card.rank).to.equal(obj.rank);
            });
        });
        
    });
});