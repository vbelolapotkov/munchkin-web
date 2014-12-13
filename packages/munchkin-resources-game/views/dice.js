Dice = {};

Dice.roll = function (gameId, playerName) {
    var result = Math.floor((Math.random() * 6) + 1);

    Collections.Dice.insert({
        gameId: gameId,
        playerName: playerName,
        dice: result
    });
};

Dice.remove = function (id) {
    Collections.Dice.remove(id, function (error) {
        if(error) console.error('Cannot remove dice: '+ error.reason);
    });
};

Template.gameDice.helpers({
    diceRoll: function () {
        return Collections.Dice.find({gameId: this._id});
    }
});

Template.gameDice.events({
    'click .diceCloseBtn': function (e) {
        e.preventDefault();
        e.stopPropagation();
        var msgId = e.target.id;
        Dice.remove(msgId);
    }
});

