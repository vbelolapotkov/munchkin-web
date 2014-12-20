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
    var deckCol;
    if (deck === 'door') deckCol = Door;
    if (deck === 'tres') deckCol = Tres;
    var cursor = deckCol.find({gameId:gameId});
    var cnt = cursor.count();
    var shuffledIndex = _.shuffle(_.range(cnt));
    cursor.map(function (card, index) {
        deckCol.update(card._id, {$set: {index: shuffledIndex[index]}});
    }, shuffledIndex);
    
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

var shuffleArray = function (d) {
    for (var c = d.length - 1; c > 0; c--) {
        var b = Math.floor(Math.random() * (c + 1));
        var a = d[c];
        d[c] = d[b];
        d[b] = a;
    }
    return d;
};