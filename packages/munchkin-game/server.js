var games = Collections.Games;
//publish collections
publishCollections();

function publishCollections() {
    publishGames();
}

function publishGames() {
    Meteor.publish('allGames', function() {
        return Collections.Games.find({});
    });
    Meteor.publish('gameId', function (gameId) {
        return Collections.Games.find(gameId);
    });
   
}
if (games) {
    games.remove({});
        var date = new Date();
        var time = date.getTime();
        var timeStr = date.toString();
        games.insert({
            name: 'game 1',
            owner: 'auto',
            created: time,
            createdStr: timeStr
        });
        games.insert({
            name: 'game 2',
            owner: 'auto',
            created: time,
            createdStr: timeStr
        });
        games.insert({
            name: 'game 3',
            owner: 'auto',
            created: time,
            createdStr: timeStr
        });
}

Meteor.methods({
    'addNewGame': function  (gameArgs) {
        var user = Meteor.user();
        if(!user) throw new Meteor.Error(401, 'LogIn is required to create new game');
        var date = new Date();
        var game = _.extend(_.pick(gameArgs,'name'), {
            ownerId: user._id,
            owner: user.username,
            created: date.getTime(),
            createdStr: date.toString()
        });
        var gameId = Collections.Games.insert(game);
        var newPlayer = {
            userId:user._id,
            gameId:gameId,
            displayname: user.username,
            position: 1
        };
        insertPlayer(newPlayer);
        return gameId;
    },
    'addPlayer': function (opts) {
        var user = Meteor.user();
        if(!user || user.userId!==opts.userId) throw new Meteor.Error(402, 'Cannot add player to the game');
        if(!opts.gameId)
            throw new Meteor.Error(403, 'Cannot find the game on server');
        var pos = Player.Collections.Players.find({gameId: opts.gameId}).count() + 1;
        var newPlayer = {
            userId:user._id,
            gameId:opts.gameId,
            displayname: user.username,
            position: pos
        };
        insertPlayer(newPlayer);
    }
});

var insertPlayer = function (player) {
    var id = Player.Collections.Players.insert(player);
    var newStats = {
        gameId: player.gameId,
        playerId: id,
        level: 1,
        power: 1,
        gender: 'M',
        cardsCnt: 0
    };
    Player.Collections.Stats.insert(newStats);
};