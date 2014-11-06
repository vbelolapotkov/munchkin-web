var Routes = {};

Routes.lobby = {
    path: '/',
    waitOn: function () {
        Meteor.subscribe('allGames');
    }
};

Routes.gamePage = {
  path: '/game/:_id',
  waitOn: function () {
    Meteor.subscribe('gameId',this.params._id);
  },
  data: function () {
    return Game.Collections.Games.findOne(this.params._id);
  }
};

Router.configure({
    layoutTemplate: 'munchkinLayout',
    loadingTemplate: 'munchkinLoading',
});

Router.map(function () {
   this.route('munchkinLobby', Routes.lobby);
   this.route('munchkinGamePage', Routes.gamePage);
   // this.route('pageNotFound', {path: '/about'});
   // this.route('pageNotFound', {path: '/rules'});
   // this.route('pageNotFound', {path: '/howto'});
});

// Router.onBeforeAction('loading');




