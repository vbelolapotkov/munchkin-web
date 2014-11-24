var col = Player.Collections;
//****Publish Collections
Meteor.publish('allPlayers', function() {
    return col.Players.find({});
});
Meteor.publish('playersForGame', function(gameId) {
    return col.Players.find({
        gameId: gameId
    });
});
Meteor.publish('gameStats', function(gameId) {
    return col.Stats.find({
        gameId: gameId
    });
});



Meteor.publish('gameItems', function(gameId) {
    return col.Items.find({
        gameId: gameId
    });
});
Meteor.publish('playerHand', function(gameId, playerId) {
    var player = col.Playes.findOne(playerId);
    if (!player || player.gameId !== gameId || player.userId !== this.userId) return;
    return col.Hand.find({
        playerId: playerId
    });
});

col.Stats.allow({
    update: function (userId, doc, fields, modifier) {
        return true;
    }
});