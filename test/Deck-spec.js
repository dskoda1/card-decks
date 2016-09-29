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
            expect(oneDeck.totalSize()).to.equal(Deck.CardsPerDeck);
            expect(oneDeck.decks()).to.equal(1);
            
            let fiveDecks = new Deck({
                'numDecks': 5
            });
            expect(fiveDecks.totalSize()).to.equal(Deck.CardsPerDeck * 5);
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
    
    describe('Deck.hasBeenPulled(combo)', () => {
       it ('Will throw Card.badCombo if argument is invalid', () => {
          let deck = new Deck();
          expect(() => deck.hasBeenPulled({})).to.throw(Card.BAD_COMBO);
       });
       
       it ('Will have n of each card where n is numDecks, after pulling all cards', () => {
            let oneDeck = new Deck();
            oneDeck.pullTop(Deck.CardsPerDeck);
            _.forEach(Card.Combinations, (combo) => {
                expect(oneDeck.hasBeenPulled(combo)).to.equal(1);
            });
            
            let fiveDeck = new Deck({
                'numDecks': 5
            });
            fiveDeck.pullTop(Deck.CardsPerDeck * 5);
            _.forEach(Card.Combinations, (combo) => {
                expect(fiveDeck.hasBeenPulled(combo)).to.equal(5);
            });
        });
    });
    
//////////////////////////////////////////////////////////////////////////
    describe('Deck.peekTop(n)', () => {
        it('Will return the top n cards of the deck without removing it', () => {
            let deck = new Deck();
            let activeCards = deck.getRemaining();
            let topCard = activeCards[deck.remainingSize() - 1];
            expect(deck.peekTop()).to.equal(topCard);
        });
        it('Will throw Deck.OUT_OF_CARDS if no more cards', () => {
            let deck = new Deck();
            deck.pullTop(Deck.CardsPerDeck);
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
                expect(deck.remainingSize()).to.equal(Deck.CardsPerDeck - 1);
                expect(deck.pulledSize()).to.equal(1);
            });
            
            it ('Will throw Deck.OUT_OF_CARDS when out of cards and defaulting to 1', () => {
                let deck = new Deck();
                deck.pullTop(Deck.CardsPerDeck);
                expect(() => deck.pullTop()).to.throw(Deck.OUT_OF_CARDS);
            });
        });
        describe('Return value', () => {
            it('Will return n cards from the top of the deck, and remove them', () => {
                let deck = new Deck();
                const numCards = 5;
                let topCards = [];
                for (let i = 1; i <= numCards; ++i) {
                    topCards.push(deck.getRemaining()[deck.remainingSize() - i]);
                }
                
                // Pull the bottom 5 now
                let cards = deck.pullTop(numCards);
                
                // Check lengths are accurate
                expect(cards.length).to.equal(numCards);
                expect(deck.remainingSize()).to.equal(Deck.CardsPerDeck - numCards);
                expect(deck.pulledSize()).to.equal(numCards);
                
                // Check equality now
                assert(_.isEqual(topCards, cards));
                assert(_.isEqual(topCards, deck.getPulled()));
                assert(_.isEqual(cards, deck.getPulled()));
                
            });
            it ('Will return a single Card type when defaulting or 1 requested', () => {
                let deck = new Deck();
                const halfDeck = deck.remainingSize() / 2;
                for (let i = 0; i < halfDeck; ++i) {
                    let card = deck.pullBottom();
                    assert.instanceOf(card, Card);
                }
                for (let i = 0; i < halfDeck; ++i) {
                    let card = deck.pullBottom(1);
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
            deck.pullBottom(Deck.CardsPerDeck);
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
                let bottomCard = deck.getRemaining()[0];
                expect(deck.pullBottom()).to.equal(bottomCard);
                expect(deck.remainingSize()).to.equal(Deck.CardsPerDeck - 1);
                expect(deck.pulledSize()).to.equal(1);
            });
            
            it ('Will throw Deck.OUT_OF_CARDS when out of cards and defaulting to 1', () => {
                let deck = new Deck();
                deck.pullBottom(Deck.CardsPerDeck);
                expect(() => deck.pullBottom()).to.throw(Deck.OUT_OF_CARDS);
            });
        });
        describe('Return value', () => {
            it('Will return n cards from the bottom of the deck, and remove them', () => {
                let deck = new Deck();
                const numCards = 5;
                let bottomCards = [];
                for (let i = 0; i < numCards; ++i) {
                    bottomCards.push(deck.getRemaining()[i]);
                }
                
                // Pull the bottom 5 now
                let cards = deck.pullBottom(numCards);
                
                // Check lengths are accurate
                expect(cards.length).to.equal(numCards);
                expect(deck.remainingSize()).to.equal(Deck.CardsPerDeck - numCards);
                expect(deck.pulledSize()).to.equal(numCards);
                
                // Check equality now
                assert(_.isEqual(bottomCards, cards));
                assert(_.isEqual(bottomCards, deck.getPulled()));
                assert(_.isEqual(cards, deck.getPulled()));
                
            });
            it ('Will return an array of Card types when more than 1 requested ', () => {
                let deck = new Deck();
                let cards = deck.pullBottom(5);
                assert.instanceOf(cards, Array);
                
                _.forEach(cards, (card) => {
                    assert.instanceOf(card, Card);
                });
            });
            it ('Will return a single Card type when defaulting or 1 requested', () => {
                let deck = new Deck();
                const halfDeck = deck.remainingSize() / 2;
                for (let i = 0; i < halfDeck; ++i) {
                    let card = deck.pullTop();
                    assert.instanceOf(card, Card);
                }
                for (let i = 0; i < halfDeck; ++i) {
                    let card = deck.pullTop(1);
                    assert.instanceOf(card, Card);
                }
            });
            
        });
    });
    
//////////////////////////////////////////////////////////////////////////    
    describe('Deck.pullRandom()', () => {
        //let original_random;
        before(() => {
            // Cache the og shuffle
            //original_random = _.random;
            // Set it to be reverse
            // TODO:
            // Fix the ranodm behavior, this is locking
            // up in the while loop
            //_.random = (low, high) => 0; 
            
        });
        
        after(() => {
            // Reset it
            //_.shuffle = original_random();
        });
        
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
                for (let i = 0; i < Deck.CardsPerDeck; ++i) {
                    let card = deck.pullRandom(1);
                    assert.instanceOf(card, Card);

                }
                expect(deck.remainingSize()).to.equal(0);
                expect(deck.pulledSize()).to.equal(Deck.CardsPerDeck);
            });
            it ('Will throw Deck.OUT_OF_CARDS when out of cards and defaulting to 1', () => {
                let deck = new Deck();
                deck.pullRandom(Deck.CardsPerDeck);
                expect(() => deck.pullRandom()).to.throw(Deck.OUT_OF_CARDS);
            });
        });
        describe('Return value', () => {
            it('Will return n cards from the randomly in the deck, and remove them', () => {
                let deck = new Deck();
                let cards = deck.pullRandom(5);
                expect(cards.length).to.equal(5);
                expect(deck.remainingSize()).to.equal(Deck.CardsPerDeck - 5);
                expect(deck.pulledSize()).to.equal(5);
                assert(_.isEqual(cards, deck.getPulled()));
                
                _.forEach(cards, (card) => {
                    assert.instanceOf(card, Card);
                });
            });
            it ('Will return a single Card type when defaulting or 1 requested', () => {
                let deck = new Deck();
                const halfDeck = deck.remainingSize() / 2;
                for (let i = 0; i < halfDeck; ++i) {
                    let card = deck.pullRandom();
                    assert.instanceOf(card, Card);
                }
                for (let i = 0; i < halfDeck; ++i) {
                    let card = deck.pullRandom(1);
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
        });
    });
    describe('Deck._pull()', () => {
        it('Will fail if called without a function for the first argument', () => {
            let deck = new Deck();
            expect(() => deck._pull() ).to.throw();
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
    describe('Deck.replaceTop(n)', () => {
        describe('Not passed any cards, default to replacing with pulled pile', () => {
            it('Will throw Deck.TAMPERED_WITH if one of the piles was tampered with and size is not what it should', () => {
                let oneDeck = new Deck();
                oneDeck.shuffle();
                oneDeck.pullBottom(26);
                // Doesn't matter what we pushed, just to show tampering with
                oneDeck.activeCards.push(3);
                expect(() => oneDeck.replaceTop()).to.throw(Deck.TAMPERED_WITH);
                
                let fiveDeck = new Deck({'numDecks': 5});
                fiveDeck.shuffle();
                fiveDeck.pullTop(140);
                fiveDeck.inactiveCards.pop();
                expect(() => fiveDeck.replaceTop()).to.throw(Deck.TAMPERED_WITH);
            });

            it('Will put all cards in the pulled pile back on top in the order they were pulled', () => {
                let deck = new Deck();
                deck.shuffle();
                const pullAmount = 10;
                let cards = deck.pullTop(pullAmount);
                let pulledCards = _.map(cards, (card) => {
                    return new Card({
                        'suit': card.getSuit(),
                        'rank': card.getRank()
                    });
                }); 
                
                // Verify sizes
                expect(deck.pulledSize()).to.equal(pullAmount);
                expect(deck.remainingSize()).to.equal(Deck.CardsPerDeck - pullAmount);
                
                // Do the operation now
                deck.replaceTop();
                
                // Verify sizes
                expect(deck.pulledSize()).to.equal(0);
                expect(deck.remainingSize()).to.equal(Deck.CardsPerDeck);
                
                assert(_.isEqual(deck.getPulled(), []));

                // Verify cards placed correctly
                const allCards = deck.getRemaining();
                assert(_.isEqual(_.takeRight(allCards, pullAmount), pulledCards));
                _.forEach(allCards, (card) => {
                    assert.instanceOf(card, Card);
                });
            });

            it('Will not push any undefineds onto the active cards', () => {
                let deck = new Deck();
                deck.shuffle();
                const pullAmount = 10;
                deck.pullTop(pullAmount);
                // Do the operation now
                deck.replaceTop();
                const allCards = deck.getRemaining();
                _.forEach(allCards, (card) => {
                    assert.instanceOf(card, Card);
                });
            });
            
        });
    });   
//////////////////////////////////////////////////////////////////////////
    describe('Deck.deal(players, cards)', () => {
        it('Will default to 4 players, size/4 cards', () => {
            let deck = new Deck();
            let hands = deck.deal();
            
            expect(hands.length).to.equal(4);
            _.forEach(hands, (hand) => {
                expect(hand.length).to.equal(Deck.CardsPerDeck / 4);
            });
            
            let fiveDeck = new Deck({
                'numDecks': 5
            });
            hands = fiveDeck.deal();
            
            expect(hands.length).to.equal(4);
            _.forEach(hands, (hand) => {
                expect(hand.length).to.equal(Deck.CardsPerDeck * 5 / 4);
            });
        });
        
        it('Will accept an object with players, cards properties or default to 4, size/4', () => {
            let deck = new Deck();
            let args = {
                players: 2,
                cards: 8
            };
            let hands = deck.deal(args);
            
            expect(hands.length).to.equal(args.players);
            _.forEach(hands, (hand) => {
                expect(hand.length).to.equal(args.cards);
            });
            
        });
        
        
        it ('Will deal the top card to each player, number of cards times');
        
    });    
});





