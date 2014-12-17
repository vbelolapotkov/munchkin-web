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
    },
    timeStr: function () {
        var date = new Date(this.created);
        return formatDate(date);
    }
});

Template.munchkinLobby.events({
    'click .enterGameBtn': function (e) {
        e.stopPropagation();
        if(!Player.isInGame(this._id))
            Player.add(this._id);
        Router.go('munchkinGamePage',this);
    }
});

var formatDate = function (date) {
    return date.getDate()+'.' +date.getMonth()+'.'+date.getFullYear()+' '+date.getHours()+':'+date.getMinutes();
};