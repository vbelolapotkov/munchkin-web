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