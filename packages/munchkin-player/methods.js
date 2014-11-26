Player.getCnt = function (gameId) {
    return playersCollection.find({gameId:gameId}).count();
};

Player.add = function (gameId) {
    if(!gameId) return;
    var pos = playersCollection.find({gameId: gameId}).count() + 1;
    var user = Meteor.user();
    var newPlayer = {
        userId:user._id,
        gameId:gameId,
        displayname: user.username,
        position: pos
    };
    var id = playersCollection.insert(newPlayer);
    return id;
};

Player.isInGame = function (gameId) {
    return false || playersCollection.find({gameId:gameId, userId: Meteor.userId()});
};

Player.getData = function (gameId, userId) {
    return playersCollection.findOne({gameId: gameId, userId: userId});
};

Player.getDataById = function (playerId) {
    return playersCollection.findOne(playerId);
};

Player.getGamePlayers = function (gameId) {
    return playersCollection.find({gameId:gameId});
};




