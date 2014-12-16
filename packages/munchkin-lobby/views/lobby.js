Template.munchkinLobby.helpers({
    gamesOnServer: function() {
    return Game.getGamesOnServer();
    },
    playersCnt: function () {
        return Player.getCnt(this._id);
    },
    isGamesOnServer: function () {
        var games = Game.getGamesOnServer();
        if(games) return games.count() > 0;
        return false;
    }
});