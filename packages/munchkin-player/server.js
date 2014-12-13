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
    }
});

if(playersCollection) playersCollection.remove({});
