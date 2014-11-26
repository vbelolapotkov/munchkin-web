//publish 
publishGames();

function publishGames() {
    Meteor.publish('allGames', function() {
        return gamesCollection.find({});
    });
    Meteor.publish('gameId', function (gameId) {
        return gamesCollection.find(gameId);
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
        var gameId = gamesCollection.insert(game);
        return gameId;
    }
});


if (gamesCollection) {
    gamesCollection.remove({});
}