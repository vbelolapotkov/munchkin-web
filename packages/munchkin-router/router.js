var requireLogin = function() {
    if (!Meteor.user()) {
        if (Meteor.loggingIn()) this.render(this.loadingTemplate);
        else this.render('munchkinAccessDenied');
    } else this.next();
};

var Routes = {};
Routes.lobby = {
    path: '/',
    waitOn: function() {
        Meteor.subscribe('allGames');
        Meteor.subscribe('allPlayers');
    }
};
Routes.gamePage = {
    path: '/game/:_id',
    waitOn: function() {
        Meteor.subscribe('gameId', this.params._id);
        Meteor.subscribe('playersForGame', this.params._id);
    },
    data: function() {
        if(!this.ready()) return;
        return {_id: this.params._id};
    },
    onBeforeAction: requireLogin
};
Router.configure({
    layoutTemplate: 'munchkinLayout',
    loadingTemplate: 'munchkinLoading',
});
Router.map(function() {
    this.route('munchkinLobby', Routes.lobby);
    this.route('munchkinGamePage', Routes.gamePage);
});
