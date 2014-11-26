Template.munchkinGamePage.helpers({
    currentPlayer: function () {
        return Player.getData(this._id, Meteor.userId());
    }
});

Template.munchkinGamePage.events({
    'click #addPlayer': function (e) {
        e.stopPropagation();
        var options = {
            gameId: this._id,
            userId: Meteor.userId
        };
        Player.add(this._id);
    },
    'click #table': function () {
        Mediator.publish('hand', new Date().toString());
    }
});