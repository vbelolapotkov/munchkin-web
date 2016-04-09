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
    update: function(userId, doc, fields, modifier) {
        return true;
    },
    insert: function(userId, doc) {
        return true;
    }
});
Collections.Hand.allow({
    insert: function(userId, doc) {
        return true;
    },
    update: function(userId, doc, fields, modifier) {
        return true;
    },
    remove: function(userId, doc) {
        return true;
    }
});
Collections.Items.allow({
    insert: function(userId, doc) {
        return true;
    },
    update: function(userId, doc, fields, modifier) {
        return true;
    },
    remove: function(userId, doc) {
        return true;
    }
});
Meteor.methods({
    'removePlayerResources': function(gameId) {
        console.log('removing player resources, actor: ' + this.userId);
        Collections.Items.remove({
            gameId: gameId
        });
        Collections.Hand.remove({
            'card.gameId': gameId
        });
        Collections.Stats.remove({
            gameId: gameId
        });
    },
    'dropResources': function(playerId) {
        var player = Player.getDataById(playerId);
        if(!player) throw new Meteor.Error(504, 'Player not found');
        var actor = Player.getData(player.gameId, this.userId);
        if (!actor) return;
        if (player.userId !== this.userId && !actor.isOwner) throw new Meteor.Error(510, 'Unauthorized action. Drop resources.');
        var myHand = Collections.Hand.find({
            playerId: playerId
        }, {
            fields: {
                card: 1
            }
        }).fetch();
        var myItems = Collections.Items.find({
            playerId: playerId
        }, {
            fields: {
                card: 1
            }
        }).fetch();
        if (myHand) Collections.Hand.remove({
            playerId: playerId
        });
        if (myItems) Collections.Items.remove({
            playerId: playerId
        });
        Collections.Stats.remove({playerId: playerId});
        var resources = myHand.concat(myItems);
        Meteor.call('dropAll', resources);
    }
});