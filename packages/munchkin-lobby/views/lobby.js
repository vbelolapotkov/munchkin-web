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
        // var date = new Date(this.created);
        return formatDate(this.created);
    },
    isLocked: function () {
        return !Game.isLocked(this._id, Meteor.userId());
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

// var formatDate = function (date) {
//     return date.getDate()+'.' +date.getMonth()+'.'+date.getFullYear()+' '+date.getHours()+':'+date.getMinutes();
// };

var formatDate = function (time) {
    var date = new Date(time);
    var dd = date.getDate();
    if (dd<10) dd='0'+dd;
    var mm = date.getMonth();
    if(mm<10) mm='0'+mm;
    var hh = date.getHours();
    if(hh<10) hh='0'+hh;
    var min = date.getMinutes();
    if(min<10) min='0'+min;
    return dd +'.' + mm +' '+hh+':'+min;
};