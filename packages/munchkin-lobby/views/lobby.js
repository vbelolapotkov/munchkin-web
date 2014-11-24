Template.munchkinLobby.helpers({
    gamesOnServer: function() {
    return Game.getGamesOnServer();
    },
    playersCnt: function () {
        return Game.getPlayersCnt(this._id);
    }
});