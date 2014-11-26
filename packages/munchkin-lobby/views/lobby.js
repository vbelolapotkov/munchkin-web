Template.munchkinLobby.helpers({
    gamesOnServer: function() {
    return Game.getGamesOnServer();
    },
    playersCnt: function () {
        return Player.getCnt(this._id);
    }
});