Template.munchkinLobbyNewGame.events({
    'submit form': function (e) {
        e.preventDefault();
        console.log('add new game');
        var game = {
            name: $(e.target).find('[name=gameName]').val(),
        };

        // game._id = Game.Collections.Games.insert(game);
        if(!game.name) {
          alert("введите имя игры");
          return;
        }
        Game.createGame(game, function (error, id) {
            if(error) {
                return alert(error.reason);
            }
            Router.go('munchkinGamePage', {_id: id});
        });
    }
});