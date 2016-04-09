Meteor.publish('gameEvents', function (gameId) {
    return Events.find({gameId:gameId});
});

Events.allow({
    insert: function (userId, doc) {
        return true;
    },
    update: function (userId, doc, fields, modifier) {
        return false;
    },
    remove: function (userId, doc) {
        return false;
    }
});

Meteor.methods({
    removeEvents: function (gameId) {
        if(!this.userId) return;
        Events.remove({gameId: gameId});
    }
});