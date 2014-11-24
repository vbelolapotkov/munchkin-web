var formatName = function (str, length) {
    if(str.length < length) return str;
    return str.slice(0, length-1) + '...';
};

Template.playerStats.helpers({
    formatedName: function () {
        return formatName(this.displayname,25);
    },
    stats: function () {
        return Player.Collections.Stats.findOne({playerId:this._id});
    }
});

Template.currentPlayerStats.helpers({
    formatedName: function () {
        return formatName(this.displayname,25);
    },
    stats: function () {
        return Player.Collections.Stats.findOne({playerId:this._id});
    }
});

Template.currentPlayerStats.events({
    'click #setLevel': function () {
        var val = +prompt("Level");
        if (!val) return;
        if (val<1) return;
        var col = Player.Collections.Stats;
        var stat = col.findOne({playerId:this.playerId});
        if(!stat) return;
        col.update(stat._id,{$set: {level: val}}, function (error) {
            if (error) {
                throw new Meteor.Error(100, 'Error modifying player stats: setLevel');
            }
        });
    },
    'click #incLevel': function () {
        var col = Player.Collections.Stats;
        var stat = col.findOne({playerId:this.playerId});
        if(!stat) return;
        col.update(stat._id, {$inc: {level: 1, power: 1}}, function (error) {
            if (error) {
                throw new Meteor.Error(101, 'Error modifying player stats: incLevel');
            }
        });
    },
    'click #decLevel': function () {
        var col = Player.Collections.Stats;
        var stat = col.findOne({playerId:this.playerId});
        if(!stat || stat.level<2) return;
        col.update(col.findOne({playerId:this.playerId})._id, {$inc: {level: -1, power: -1}}, function (error) {
            if (error) {
                throw new Meteor.Error(102, 'Error modifying player stats: decLevel');
            }
        });
    },
    'click #setPower': function () {
        var val = +prompt("Power");
        if (!val) return;
        if (val<1) return;
        var col = Player.Collections.Stats;
        var stat = col.findOne({playerId:this.playerId});
        if(!stat) return;
        col.update(stat._id,{$set: {power: val}}, function (error) {
            if (error) {
                throw new Meteor.Error(103, 'Error modifying player stats: setPower');
            }
        });
    },
    'click #incPower': function () {
        var col = Player.Collections.Stats;
        var stat = col.findOne({playerId:this.playerId});
        if(!stat) return;
        col.update(stat._id, {$inc: {power: 1}}, function (error) {
            if (error) {
                throw new Meteor.Error(104, 'Error modifying player stats: incPower');
            }
        });
    },
    'click #decPower': function () {
        var col = Player.Collections.Stats;
        var stat = col.findOne({playerId:this.playerId});
        if(!stat || stat.power<2) return;
        col.update(stat._id, {$inc: {power: -1}}, function (error) {
            if (error) {
                throw new Meteor.Error(105, 'Error modifying player stats: decPower');
            }
        });
    },
    'click #changeGender': function () {
        var col = Player.Collections.Stats;
        var stat = col.findOne({playerId:this.playerId});
        if(!stat) return;
        var newGender = stat.gender === 'M' ? 'F' : 'M';
        col.update(stat._id,{$set: {gender: newGender}}, function (error) {
            if (error) {
                throw new Meteor.Error(106, 'Error modifying player stats: changeGender');
            }
        });
    }
});