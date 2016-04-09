var Table = Collections.Table;
var Drop = Collections.Drop;
var Dice = Collections.Dice;
Meteor.publish('gameTable', function(gameId) {
    return Table.find({
        gameId: gameId
    });
});
Meteor.publish('gameDrop', function(gameId) {
    return Drop.find({
        gameId: gameId
    });
});
Meteor.publish('gameDice', function(gameId) {
    return Dice.find({
        gameId: gameId
    });
});
Table.allow({
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
Drop.allow({
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
Dice.allow({
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
    'removeGameResources': function(gameId) {
        Collections.Dice.remove({
            gameId: gameId
        });
        Collections.Drop.remove({
            gameId: gameId
        });
        Collections.Table.remove({
            gameId: gameId
        });
    },
    'dropAll': function(cards) {
        if (!cards || cards.length < 1) return;
        var gameId = cards[0].card.gameId;
        var topDoor = Collections.Drop.find({
            gameId: gameId,
            'card.type': 'door'
        }, {
            sort: {
                'card.index': -1
            },
            limit: 1,
            reactive: false
        }).fetch();
        var topDoorIndex = topDoor[0] ? topDoor[0].card.index : 0;
        var topTres = Collections.Drop.find({
            gameId: gameId,
            'card.type': 'tres'
        }, {
            sort: {
                'card.index': -1
            },
            limit: 1,
            reactive: false
        }).fetch();
        var topTresIndex = topTres[0] ? topTres[0].card.index : 0;
        _.each(cards, function(doc) {
            if (doc.card.type === 'door') {
                topDoorIndex++;
                doc.card.index = topDoorIndex;
            } else {
                topTresIndex++;
                doc.card.index = topTresIndex;
            }
            Collections.Drop.insert({
                gameId: gameId,
                card: doc.card,
            });
        });
    }
});