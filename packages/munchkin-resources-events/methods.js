GameEvents = {};

Events = new Mongo.Collection('gameEvents');

GameEvents.commonEvent = function (gameId, options) {
    // common Events
    var created = new Date().getTime();
    Events.insert({
        gameId: gameId,
        type: 'common',
        actor: options.actor,
        action: options.action,
        result: options.result,
        created: created
    });
};

GameEvents.cardEvent = function (gameId, options) {
    var created = new Date().getTime();
    Events.insert({
        gameId: gameId,
        type: 'card',
        actor: options.actor,
        action: options.action,
        cardName: options.cardName,
        from: options.from,
        to: options.to,
        created: created
    });
    
};
