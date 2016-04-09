Template.munchkinLobbyNewGame.events({
    'submit form': function (e) {
        e.preventDefault();
        var game = {
            name: $(e.target).find('[name=gameName]').val(),
            supplements: []
        };

        $(e.target).find('[name=supplement]').each(function () {
            if(!this.checked) return;
            game.supplements.push(+this.value);
        });

        if(!game.name) {
          alert("введите имя игры");
          return;
        }
        if(game.supplements.length<1) {
            alert("выберите хотя бы одно дополнение");
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