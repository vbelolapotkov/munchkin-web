//publish 
publishGames();

function publishGames() {
    Meteor.publish('allGames', function() {
        return gamesCollection.find({});
    });
    Meteor.publish('gameId', function(gameId) {
        return gamesCollection.find(gameId);
    });
}
Meteor.methods({
    'addNewGame': function(gameArgs) {
        var user = Meteor.user();
        if (!user) throw new Meteor.Error(401, 'LogIn is required to create new game');
        var date = new Date();
        var game = _.extend(_.pick(gameArgs, 'name'), {
            ownerId: user._id,
            owner: user.username,
            created: date.getTime(),
            createdStr: date.toString()
        });
        var gameId = gamesCollection.insert(game);
        return gameId;
    },
    'endGame': function(gameId) {
        console.log('ending game: ' + gameId);
        var game = gamesCollection.findOne(gameId);
        if (!game || game.ownerId !== this.userId) throw new Meteor.Error(500, 'Cannot delete game, wrong user');
        //remove player resources
        Meteor.call('removePlayerResources', gameId, function(error, result) {
            if (error) throw error;
            console.log('playerResources removed');
        });
        Meteor.call('removeGameResources', gameId, function(error, result) {
            if (error) throw error;
            console.log('gameResources removed');
        });
        Meteor.call('removeDecks', gameId, function(error, result) {
            if (error) throw error;
            console.log('decks removed');
        });
        Meteor.call('removePlayers', gameId, function (error, result) {
            if (error) throw error;
            console.log('players removed');
        });
        gamesCollection.remove(gameId);
    }
});
