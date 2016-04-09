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
            Player.add(result,true);
        }
        callback(error, result);
    });
};

Game.lock = function (gameId, state) {
    var game = gamesCollection.findOne(gameId);
    if(!game) return;
    gamesCollection.update(game._id, {$set: {locked:state}});
};

Game.isLocked = function (gameId, userId) {
    var game = gamesCollection.findOne(gameId);
    var player = Player.getData(gameId, userId);
    return game.locked && !player;
};