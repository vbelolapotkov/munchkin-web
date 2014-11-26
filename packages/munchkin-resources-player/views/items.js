Template.munchkinPlayerItems.rendered = function () {
    if (!Session.get('selectedPlayer')) Session.set('selectedPlayer', Meteor.userId());
};
Template.munchkinPlayerItems.helpers({
    playerInGame: function () {
        return Player.getGamePlayers(this._id);
    },
    currentPlayer: function () {
        return Player.getData(this._id, Meteor.userId());
    },
    isCurrentPlayer: function () {
        return this.userId === Meteor.userId();
    },
    selected: function () {
        if (Session.equals('selectedPlayer', this.userId)) return "selected";
    }
});
Template.munchkinPlayerItems.events({
    'click ul.itemsTabs > li': function (e) {
        e.preventDefault();
        Session.set('selectedPlayer', this.userId);
    }
});