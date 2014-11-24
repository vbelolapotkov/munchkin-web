Template.munchkinGamePage.helpers({
    isPlayer: function () {
        return Game.Collections.Players.find({gameId:this._id, userId: Meteor.userId()}).count()>0;
    },
    currentPlayer: function () {
        return Player.Collections.Players.findOne({gameId:this._id, userId: Meteor.userId()});
    }
});

Template.munchkinGamePage.events({
    'click #addPlayer': function () {
        var options = {
            gameId: this._id,
            userId: Meteor.userId
        };
        Meteor.call('addPlayer', options, function (error, result) {
            if(error) alert(error.reason);
        });
    }
});