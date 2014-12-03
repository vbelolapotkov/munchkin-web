var Table = Collections.Table;
var Drop = Collections.Drop;

if(Table) Table.remove({});
if(Drop) Drop.remove({});

Meteor.publish('gameTable', function (gameId) {
    return Table.find({gameId:gameId});
});

Meteor.publish('gameDrop', function (gameId) {
    return Drop.find({gameId:gameId});
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