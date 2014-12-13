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
Meteor.publish('playerHand', function(playerId) {
    var player = Player.getDataById(playerId);
    if (!player || player.userId !== this.userId) return;
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

Collections.Hand.allow({
    insert: function (userId, doc) {
        return true;
    },
    update: function (userId, doc, fields, modifier) {
        return true;
    },
    remove: function (userId, doc) {
        return true;
    }
});

Collections.Items.allow({
    insert: function (userId, doc) {
        return true;
    },
    update: function (userId, doc, fields, modifier) {
        return true;
    },
    remove: function (userId, doc) {
        return true;
    }
});

Meteor.methods({
    'removePlayerResources': function (gameId) {
        console.log('removing player resources, actor: '+this.userId);
        Collections.Items.remove({gameId: gameId});
        Collections.Hand.remove({'card.gameId': gameId});
        Collections.Stats.remove({gameId: gameId});
    }
});