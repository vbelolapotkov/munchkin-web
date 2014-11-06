Template.munchkinLobby.helpers({
    gamesOnServer: function() {
        return Game.Collections.Games.find();
    }
});