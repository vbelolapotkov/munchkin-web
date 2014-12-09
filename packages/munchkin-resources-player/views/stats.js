var formatName = function(str, length) {
    if (str.length < length) return str;
    return str.slice(0, length - 1) + '...';
};
Template.playerStats.helpers({
    formatedName: function() {
        return formatName(this.displayname, 20);
    },
    stats: function() {
        return Collections.Stats.findOne({
            playerId: this._id
        });
    },
});
var currentPlayer = {};
var subscriptions = {};
subscriptions.init = function() {
    var statsSubscription = Meteor.subscribe('gameStats', currentPlayer.gameId);
    var handSubscription = Meteor.subscribe('playerHand', currentPlayer._id);
    Tracker.autorun(function(computation) {
        if (!statsSubscription.ready() || !handSubscription.ready()) return;
        var myStats = Collections.Stats.findOne({
            playerId: currentPlayer._id
        });
        if (!myStats) {
            Collections.Stats.insert({
                playerId: currentPlayer._id,
                gameId: currentPlayer.gameId,
                level: 1,
                power: 1,
                gender: 'M',
                cardsCnt: 0
            }, function(error, id) {
                if (error) console.error(error.reason);
                else cardCounter.start(currentPlayer._id, id);
            });
        } else cardCounter.start(currentPlayer._id, myStats._id);
        computation.stop();
    });
};
var cardCounter = {
    counter: null,
    stop: function() {
        if (this.couner) counter.stop();
    },
    start: function(playerId, statId) {
        var self = this;
        // self.stop();
        console.log('starting new counter for player: '+playerId);
        console.log('statid: '+statId);
        this.counter = Tracker.autorun(function() {
            var count = Collections.Hand.find({
                playerId: playerId
            }).count();
            Collections.Stats.update(statId, {
                $set: {
                    cardsCnt: count                }
            }, function(error) {
                if (error) console.error(error.reason);
            });
        });
    }
};
Template.currentPlayerStats.rendered = function() {
    if (!this.data) return;
    //if player changed update subscription
    if (currentPlayer._id === this.data._id) return;
    currentPlayer = this.data;
    subscriptions.init();
};
Template.currentPlayerStats.helpers({
    formatedName: function() {
        return formatName(this.displayname, 25);
    },
    stats: function() {
        return Collections.Stats.findOne({
            playerId: this._id
        });
    }
});
Template.currentPlayerStats.events({
    'click #setLevel': function() {
        var val = +prompt("Level");
        if (!val) return;
        if (val < 1) return;
        var col = Collections.Stats;
        var stat = col.findOne({
            playerId: this.playerId
        });
        if (!stat) return;
        col.update(stat._id, {
            $set: {
                level: val
            }
        }, function(error) {
            if (error) {
                throw new Meteor.Error(100, 'Error modifying player stats: setLevel');
            }
        });
    },
    'click #incLevel': function() {
        var col = Collections.Stats;
        var stat = col.findOne({
            playerId: this.playerId
        });
        if (!stat) return;
        col.update(stat._id, {
            $inc: {
                level: 1,
                power: 1
            }
        }, function(error) {
            if (error) {
                throw new Meteor.Error(101, 'Error modifying player stats: incLevel');
            }
        });
    },
    'click #decLevel': function() {
        var col = Collections.Stats;
        var stat = col.findOne({
            playerId: this.playerId
        });
        if (!stat || stat.level < 2) return;
        col.update(col.findOne({
            playerId: this.playerId
        })._id, {
            $inc: {
                level: -1,
                power: -1
            }
        }, function(error) {
            if (error) {
                throw new Meteor.Error(102, 'Error modifying player stats: decLevel');
            }
        });
    },
    'click #setPower': function() {
        var val = +prompt("Power");
        if (!val) return;
        if (val < 1) return;
        var col = Collections.Stats;
        var stat = col.findOne({
            playerId: this.playerId
        });
        if (!stat) return;
        col.update(stat._id, {
            $set: {
                power: val
            }
        }, function(error) {
            if (error) {
                throw new Meteor.Error(103, 'Error modifying player stats: setPower');
            }
        });
    },
    'click #incPower': function() {
        var col = Collections.Stats;
        var stat = col.findOne({
            playerId: this.playerId
        });
        if (!stat) return;
        col.update(stat._id, {
            $inc: {
                power: 1
            }
        }, function(error) {
            if (error) {
                throw new Meteor.Error(104, 'Error modifying player stats: incPower');
            }
        });
    },
    'click #decPower': function() {
        var col = Collections.Stats;
        var stat = col.findOne({
            playerId: this.playerId
        });
        if (!stat || stat.power < stat.level + 1) return;
        col.update(stat._id, {
            $inc: {
                power: -1
            }
        }, function(error) {
            if (error) {
                throw new Meteor.Error(105, 'Error modifying player stats: decPower');
            }
        });
    },
    'click #changeGender': function() {
        var col = Collections.Stats;
        var stat = col.findOne({
            playerId: this.playerId
        });
        if (!stat) return;
        var newGender = stat.gender === 'M' ? 'F' : 'M';
        col.update(stat._id, {
            $set: {
                gender: newGender
            }
        }, function(error) {
            if (error) {
                throw new Meteor.Error(106, 'Error modifying player stats: changeGender');
            }
        });
    }
});