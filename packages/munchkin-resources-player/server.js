if(Collections.Stats)Collections.Stats.remove({});
if(Collections.Hand)Collections.Hand.remove({});
if(Collections.Items)Collections.Items.remove({});

Meteor.publish('gameStats', function(gameId) {
    return Collections.Stats.find({
        gameId: gameId
    });
});

Meteor.publish('gameItems', function(gameId) {
    return Collections.Items.find({
        gameId: gameId
    });
});
Meteor.publish('playerHand', function(gameId, playerId) {
    var player = Player.getDataById(playerId);
    if (!player || player.gameId !== gameId || player.userId !== this.userId) return;
    return Collections.Hand.find({
        playerId: playerId
    });
});

Collections.Stats.allow({
    update: function (userId, doc, fields, modifier) {
        return true;
    },
    insert: function (userId, doc) {
        return true;
    }
});