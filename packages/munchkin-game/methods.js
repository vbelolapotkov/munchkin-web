Game.getGamesOnServer = function () {
    return gamesCollection.find({},{sort: {created: -1}});
};

Game.getGameData = function (id) {
    return gamesCollection.findOne(id);
};

Game.createGame = function (options, callback) {
    Meteor.call('addNewGame', options, function (error, result) {
        if(!error) {
            Deck.create(result, options.supplements);
            Player.add(result);
        }
        callback(error, result);
    });
};