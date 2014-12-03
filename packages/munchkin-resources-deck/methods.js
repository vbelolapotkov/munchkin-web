Deck.create = function (gameId, supplements) {
    //supplements contain numbers of additional decks to add
    if(!gameId || !supplements) return;
    _.each(supplements, function(sup, index, list) {
        Meteor.call('addCards',gameId, sup, function (error, result) {
            if(error) alert(error.reason);
        });
    });
};

Deck.shuffle = function (gameId, deck) {
    
};

Deck.getCard = function (gameId, type) {
    var card;
    var deck;
    if (type === 'door') deck = Door;
    if (type === 'tres') deck = Tres;
    if(!deck) return;
    card = deck.findOne({gameId: gameId},{sort: {index: -1}});
    card.type = type;
    if(card._id) deck.remove(card._id);
    return card;
};