var games = Game.Collections.Games;
//publish collections
publishCollections();

function publishCollections() {
    publishGames();
}

function publishGames() {
    Meteor.publish('allGames', function() {
        return Game.Collections.Games.find({},{fields: {name: 1}});
    });
    Meteor.publish('gameId', function (gameId) {
        return Game.Collections.Games.find(gameId);
    });
}
if (games) {
    games.remove({});
        games.insert({
            name: 'game 1',
            description: 'descr 1'
        });
        games.insert({
            name: 'game 2',
            description: 'descr 2',
        });
        games.insert({
            name: 'game 3',
            description: 'descr 3'
        });
}