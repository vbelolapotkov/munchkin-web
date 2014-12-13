var Table = Collections.Table;
var Drop = Collections.Drop;
var Dice = Collections.Dice;

if(Table) Table.remove({});
if(Drop) Drop.remove({});
if(Dice) Dice.remove({});

Meteor.publish('gameTable', function (gameId) {
    return Table.find({gameId:gameId});
});

Meteor.publish('gameDrop', function (gameId) {
    return Drop.find({gameId:gameId});
});

Meteor.publish('gameDice', function (gameId) {
    return Dice.find({gameId: gameId});
});

Table.allow({
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

Drop.allow({
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

Dice.allow({
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