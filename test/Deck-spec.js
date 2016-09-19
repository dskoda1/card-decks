'use strict';

let chai = require('chai');
let expect = chai.expect;
let _ = require('lodash');
let assert = chai.assert;

let Deck = require('../src').Deck;
let Card = require('../src').Card;

describe('Deck', () => {
    
//////////////////////////////////////////////////////////////////////////
    describe('Deck Constructor', () => {
        it ('Can take a numDecks argument, or default to 1', () => {
            
            let oneDeck = new Deck();
            expect(oneDeck.totalSize()).to.equal(52);
            expect(oneDeck.decks()).to.equal(1);
            
            let fiveDecks = new Deck({
                'numDecks': 5
            });
            expect(fiveDecks.totalSize()).to.equal(52 * 5);
            expect(fiveDecks.decks()).to.equal(5);
        });
    
    });
    
//////////////////////////////////////////////////////////////////////////
    describe('Deck.has(combo)', () => {
       it ('Will throw Card.badCombo if argument is invalid', () => {
          let deck = new Deck();
          expect(() => deck.has({})).to.throw(Card.BAD_COMBO);
       });
       
       it ('Will have n of each card where n is numDecks', () => {
            let oneDeck = new Deck();
            _.forEach(Card.Combinations, (combo) => {
                expect(oneDeck.has(combo)).to.equal(1);
            });
            
            let fiveDeck = new Deck({
                'numDecks': 5
            });
            _.forEach(Card.Combinations, (combo) => {
                expect(fiveDeck.has(combo)).to.equal(5);
            });
        });
    });
    
//////////////////////////////////////////////////////////////////////////
    describe('Deck.peekTop()', () => {
        it('Will return the card at the top of the deck without removing it', () => {
            let deck = new Deck();
            let activeCards = deck.getRemaining();
            let topCard = activeCards[deck.remainingSize() - 1];
            expect(deck.peekTop()).to.equal(topCard);
        });
        it('Will throw Deck.OUT_OF_CARDS if no more cards', () => {
            let deck = new Deck();
            deck.pullTop(52);
            expect(() => deck.peekTop()).to.throw(Deck.OUT_OF_CARDS);
        });
    });
    
//////////////////////////////////////////////////////////////////////////
    describe('Deck.pullTop(n)', () => {
        describe('Validation of n', () => {
            it('Will throw Deck.BAD_AMOUNT if less than one is passed', () => {
                let deck = new Deck();
                expect(() => deck.pullTop(0)).to.throw(Deck.BAD_AMOUNT);
                expect(() => deck.pullTop(-1)).to.throw(Deck.BAD_AMOUNT);
            });
            it('Will throw Deck.OUT_OF_CARDS if more than remaining requested.', () => {
                let deck = new Deck();
                expect(() => deck.pullTop(53)).to.throw(Deck.OUT_OF_CARDS);
            });
    
            it('Will default to 1 if nothing is passed', () => {
                let deck = new Deck();
                let activeCards = deck.getRemaining();
                let topCard = activeCards[deck.remainingSize() - 1];
                expect(deck.pullTop()).to.equal(topCard);
                expect(deck.remainingSize()).to.equal(52 - 1);
                expect(deck.pulledSize()).to.equal(1);
            });
            
            it ('Will throw Deck.OUT_OF_CARDS when out of cards and defaulting to 1', () => {
                let deck = new Deck();
                deck.pullTop(52);
                expect(() => deck.pullTop()).to.throw(Deck.OUT_OF_CARDS);
            });
        });
        describe('Return value', () => {
            it ('Will return a Card type when 1 requested or defaulted', () => {
                let deck = new Deck();
                
                for (let i = 0; i < 52; ++i) {
                    let card = deck.pullTop();
                    assert.instanceOf(card, Card);
                }
                
            });
            it ('Will return an array of Card types when more than 1 requested ', () => {
                let deck = new Deck();
                let cards = deck.pullTop(5);
                assert.instanceOf(cards, Array);
                
                _.forEach(cards, (card) => {
                    assert.instanceOf(card, Card);
                });
            });
            
            it('Will return n cards from the top of the deck, and remove them', () => {
                let deck = new Deck();
                let cards = deck.pullTop(5);
                expect(cards.length).to.equal(5);
                expect(deck.remainingSize()).to.equal(52 - 5);
                expect(deck.pulledSize()).to.equal(5);
                assert(_.isEqual(cards, deck.getPulled()));
                
                for (let i = 0; i < 5; ++i) {
                    assert.instanceOf(cards[i], Card);
                }
            });
        });
    });
    
//////////////////////////////////////////////////////////////////////////
    describe('Deck.peekBottom()', () => {
        it('Will return the card at the top of the deck without removing it', () => {
            let deck = new Deck();
            let activeCards = deck.getRemaining();
            let bottomCard = activeCards[0];
            expect(deck.peekBottom()).to.equal(bottomCard);
        });
        it('Will throw Deck.OUT_OF_CARDS if no more cards', () => {
            let deck = new Deck();
            deck.pullBottom(52);
            expect(() => deck.peekBottom()).to.throw(Deck.OUT_OF_CARDS);
        });
    });
    
//////////////////////////////////////////////////////////////////////////
    describe('Deck.pullBottom(n)', () => {
        describe('Validation of n', () => {
            it('Will throw Deck.BAD_AMOUNT if less than one is passed', () => {
                let deck = new Deck();
                expect(() => deck.pullBottom(0)).to.throw(Deck.BAD_AMOUNT);
                expect(() => deck.pullBottom(-1)).to.throw(Deck.BAD_AMOUNT);
            });
            it('Will throw Deck.OUT_OF_CARDS if more than remaining requested.', () => {
                let deck = new Deck();
                expect(() => deck.pullBottom(53)).to.throw(Deck.OUT_OF_CARDS);
            });
    
            it('Will default to 1 if nothing is passed', () => {
                let deck = new Deck();
                let activeCards = deck.getRemaining();
                let bottomCard = activeCards[0];
                expect(deck.pullBottom()).to.equal(bottomCard);
                expect(deck.remainingSize()).to.equal(52 - 1);
                expect(deck.pulledSize()).to.equal(1);
            });
            
            it ('Will throw Deck.OUT_OF_CARDS when out of cards and defaulting to 1', () => {
                let deck = new Deck();
                deck.pullBottom(52);
                expect(() => deck.pullBottom()).to.throw(Deck.OUT_OF_CARDS);
            });
        });
        describe('Return value', () => {
            it ('Will return a Card type when 1 requested or defaulted', () => {
                let deck = new Deck();
                
                
                for (let i = 0; i < 52; ++i) {
                    let card = deck.pullBottom();
                    assert.instanceOf(card, Card);
                }
            });
            it ('Will return an array of Card types when more than 1 requested ', () => {
                let deck = new Deck();
                let cards = deck.pullBottom(5);
                assert.instanceOf(cards, Array);
                
                _.forEach(cards, (card) => {
                    assert.instanceOf(card, Card);
                });
            });
            
            it('Will return n cards from the bottom of the deck, and remove them', () => {
                let deck = new Deck();
                let cards = deck.pullBottom(5);
                expect(cards.length).to.equal(5);
                expect(deck.remainingSize()).to.equal(52 - 5);
                expect(deck.pulledSize()).to.equal(5);
                assert(_.isEqual(cards, deck.getPulled()));
                
                for (let i = 0; i < 5; ++i) {
                    assert.instanceOf(cards[i], Card);
                }
            });
        });
    });
    
//////////////////////////////////////////////////////////////////////////
    describe('Deck.shuffle()', () => {
        let original_shuffle;
        before(() => {
            // Cache the og shuffle
            original_shuffle = _.shuffle;
            // Set it to be reverse
            _.shuffle = (a) => _.reverse(a); 
            
        });
        
        after(() => {
            // Reset it
            _.shuffle = original_shuffle;
        });
        it('Will shuffle all the cards in the deck', () => {
            // We expect the cards to simply be reversed now
            let deck = new Deck();
            let cards = deck.getRemaining();
            cards = _.map(cards, (card) => {
                return new Card({
                    'suit': card.getSuit(),
                    'rank': card.getRank()
                });
            });
            
            deck.shuffle();
            // Now reverse the original cards
            cards = _.reverse(cards);
            // Will be the same
            assert(_.isEqual(cards, deck.getRemaining()));
            
        });
    });
    
//////////////////////////////////////////////////////////////////////////    
    describe('Deck.pullRandom()', () => {
        describe('Validation of n', () => {
            it('Will throw Deck.BAD_AMOUNT if less than one is passed', () => {
                let deck = new Deck();
                expect(() => deck.pullRandom(0)).to.throw(Deck.BAD_AMOUNT);
                expect(() => deck.pullRandom(-1)).to.throw(Deck.BAD_AMOUNT);
            });
            it('Will throw Deck.OUT_OF_CARDS if more than remaining requested.', () => {
                let deck = new Deck();
                expect(() => deck.pullRandom(53)).to.throw(Deck.OUT_OF_CARDS);
            });
    
            it('Will default to 1 if nothing is passed', () => {
                let deck = new Deck();

                // Can't do this check 
                let card = deck.pullRandom();
                assert.instanceOf(card, Card);

                for (let i = 0; i < 51; ++i) {
                    card = deck.pullRandom(1);
                    assert.instanceOf(card, Card);

                }
                expect(deck.remainingSize()).to.equal(0);
                expect(deck.pulledSize()).to.equal(52);
            });
            
            it ('Will throw Deck.OUT_OF_CARDS when out of cards and defaulting to 1', () => {
                let deck = new Deck();
                deck.pullRandom(52);
                expect(() => deck.pullRandom()).to.throw(Deck.OUT_OF_CARDS);
            });
        });
        describe('Return value', () => {
            it ('Will return a Card type when 1 requested or defaulted', () => {
                let deck = new Deck();
                
               
                for (let i = 0; i < 52; ++i) {
                    let card = deck.pullRandom();
                    assert.instanceOf(card, Card);
                }
                
            });
            it ('Will return an array of Card types when more than 1 requested ', () => {
                let deck = new Deck();
                
                
                
                let cards = deck.pullRandom(5);
                assert.instanceOf(cards, Array);
                
                _.forEach(cards, (card) => {
                    assert.instanceOf(card, Card);
                });
            });
            
            it('Will return n cards from the top of the deck, and remove them', () => {
                let deck = new Deck();
                let cards = deck.pullRandom(5);
                expect(cards.length).to.equal(5);
                expect(deck.remainingSize()).to.equal(52 - 5);
                expect(deck.pulledSize()).to.equal(5);
                assert(_.isEqual(cards, deck.getPulled()));
                
                for (let i = 0; i < 5; ++i) {
                    assert.instanceOf(cards[i], Card);
                }
            });
        });
    })
});

