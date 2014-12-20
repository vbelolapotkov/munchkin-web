Template.gameEvents.helpers({
    gameEventMsg: function () {
        return Events.find({gameId: this._id},{sort: {created: -1}});
    },
    formattedTime: function () {
        return formatDate(this.created);
    },
    localizedAction: function () {
        return  actionDict[this.action];
    },
    localizedFrom: function () {
        if(this.action!=='give') return fromDict[this.from];
    },
    localizedTo: function () {
        if(this.action!=='give') return toDict[this.to];
        return toDict.player+this.to;
    },
    cardDescription: function () {
        if (this.cardName !== 'door' && this.cardName !== 'tres') return this.cardName;
        return cardDict[this.cardName];
    },
    localizedResult: function () {
        if(this.action ==='dice') return this.result;
        return resultDict[this.result];
    },
    cardEvent: function () {
        return this.type === 'card';
    }
});

Template.gameEvents.events({
});

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

var actionDict = {
    'move': "переместил",
    'give': "передал",
    'dice': "бросил кубик. D =",
    'shuffle': "перемешал",
    'enter': "присоединился к игре",
    'leave': "покинул игру"
};

var cardDict = {
    'door': "карту дверей",
    'tres': "карту сокровищ"
};

var fromDict = {
    "hand"    : "из руки",
    "items"   : "из шмоток",
    "gameTable" : "со стола",
    "deck" : "из колоды",
    "drop" : "из сброса",
};

var toDict = {
    "hand"    : "в руку",
    "items"   : "в шмотки",
    "gameTable" : "на стол",
    "deck" : "в колоду",
    "drop" : "в сброс",
    "player"    : "игроку "
};

var resultDict = {
    'deckdoor': "колоду дверей",
    'decktres': "колоду сокровищ"
}