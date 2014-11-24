var requireLogin = function() {
    if (!Meteor.user()) {
        if (Meteor.loggingIn()) this.render(this.loadingTemplate);
        else this.render('munchkinAccessDenied');
        // this.next();
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
        Meteor.subscribe('gameStats',this.params._id);
    },
    data: function() {
        return Game.getGameData(this.params._id);
    },
    onBeforeAction: requireLogin
};
// Routes.lobbyNewGame = {
//     path: '/newgame',
//     onBeforeAction: requireLogin
// };
Router.configure({
    layoutTemplate: 'munchkinLayout',
    loadingTemplate: 'munchkinLoading',
});
// Router.onBeforeAction(requireLogin, {
//     only: ['munchkinGamePage', 'munchkinLobbyNewGame']
// });
Router.map(function() {
    this.route('munchkinLobby', Routes.lobby);
    this.route('munchkinGamePage', Routes.gamePage);
    // this.route('munchkinLobbyNewGame', Routes.lobbyNewGame);
});
