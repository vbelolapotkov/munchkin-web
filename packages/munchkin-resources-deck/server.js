Meteor.publish('gameDecks', function (gameId) {
    return [Door.find({gameId:gameId}), Tres.find({gameId:gameId})
    ];
});

Door.allow({
    insert: function (userId, doc) {
        return true;
    },
    update: function (userId, doc, fields, modifier) {
        return true;
    },
    remove: function (userId, doc) {
        return true;
    }
});

Tres.allow({
    insert: function (userId, doc) {
        return true;
    },
    update: function (userId, doc, fields, modifier) {
        return true;
    },
    remove: function (userId, doc) {
        return true;
    }
});

if(Door) Door.remove({});
if(Tres) Tres.remove({});

Meteor.methods({
    'addCards': function (gameId, sup) {
        //read files for selected
        var fname = 'supplements/cards'+sup+'.json';
        var str = Assets.getText(fname);
        if (str) {
            var cards = JSON.parse(str);
            if (cards) {
                var doors = cards.doors;
                var tres = cards.treasures;
                var i = 0;
                var doorCnt = Door.find({gameId:gameId}).count();
                while (doors[i]) {
                    Door.insert({
                        gameId: gameId,
                        name: doors[i].name,
                        file: cards.imgPath + doors[i].path + doors[i].file,
                        supplement: sup,
                        index: doorCnt+i
                    });
                    i++;
                }
                var tresCnt = Tres.find({gameId:gameId}).count();
                i = 0;
                while (tres[i]) {
                    Tres.insert({
                        gameId: gameId,
                        name: tres[i].name,
                        file: cards.imgPath + tres[i].path + tres[i].file,
                        supplement: sup,
                        index: tresCnt+i
                    });
                    i++;
                }
            } else throw new Meteor.Error("failed","failed to parse: "+fname);
        } else throw new Meteor.Error("failed", "Failed to read cards description file: "+fname);
    },
    'removeDecks': function (gameId) {
        Door.remove({gameId:gameId});
        Tres.remove({gameId:gameId});
    }
});