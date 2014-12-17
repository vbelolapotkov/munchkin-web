//****Publish Collections
playersCollection.allow({
    insert: function (userId, doc) {
        return doc.userId === userId;
    },
    update: function (userId, doc, fields, modifier) {
        return false;
    },
    remove: function (userId, doc) {
        return false;
    }
});


Meteor.publish('allPlayers', function() {
    return playersCollection.find({});
});

Meteor.publish('playersForGame', function(gameId) {
    return playersCollection.find({
        gameId: gameId
    });
});

Meteor.methods({
    'removePlayers': function (gameId) {
        playersCollection.remove({gameId: gameId});
    },
    'playerExit': function (gameId, userId) {
        if(this.userId!==userId) return;
        var player = playersCollection.findOne({gameId: gameId, userId: userId});
        if(!player) throw new Meteor.Error(504, 'Player not found');
        Meteor.call('dropResources', player._id, function (error, result) {
            if(error) throw error;
            playersCollection.remove(player._id);
        });
    },
    'kickPlayer': function (playerId) {
        var player = playersCollection.findOne(playerId);
        if(!player) return;
        var actor = playersCollection.findOne({gameId: player.gameId, userId: this.userId});
        if (!actor || !actor.isOwner) return;
        Meteor.call('dropResources', player._id, function (error, result) {
            if(error) throw error;
            playersCollection.remove(player._id);
        });
    }
});
