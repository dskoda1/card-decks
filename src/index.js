'use strict';

module.exports = function () {
    let Card = require('./Card');
    let Deck = require('./Deck');
    return {
        Deck: Deck,
        Card: Card
    };
}();