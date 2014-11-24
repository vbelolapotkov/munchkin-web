Game.getGamesOnServer = function () {
    return Collections.Games.find({},{sort: {created: -1}});
};

Game.getGameData = function (id) {
    return Collections.Games.findOne(id);
};

Game.getPlayersCnt = function (id) {
    return Player.Collections.Players.find({gameId:id}).count();
};

Game.createGame = function (options, callback) {
    Meteor.call('addNewGame', options, callback);
};