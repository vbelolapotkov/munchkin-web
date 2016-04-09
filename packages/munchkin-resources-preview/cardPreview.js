Preview = {};
var srcFile = new ReactiveVar('/img/door.gif');
var isDrop = new ReactiveVar(false);
var drop;
var index = new ReactiveVar(null);
var max;
var tracker = {
    computation: null,
    stop: function () {
        if(this.computation) this.computation.stop();
        index.set(0);
    },
    start: function () {
        this.computation = Tracker.autorun(function () {
            var i = index.get();
            if (i === 0) $('#viewNext').prop('disabled',true);
            else $('#viewNext').prop('disabled', false);

            if (i === max) $('#viewPrev').prop('disabled',true);
            else $('#viewPrev').prop('disabled', false);
        });
    }
};

Template.cardPreview.helpers({
    cardFile: function() {
        return srcFile.get();
    },
    isViewDrop: function() {
        return isDrop.get();
    }
});
Template.cardPreview.events({
    'click #viewPrev': function() {
        var i = index.get()+1;
        srcFile.set(drop[i].card.file);
        index.set(i);
    },
    'click #viewNext': function() {
        var i = index.get()-1;
        srcFile.set(drop[i].card.file);
        index.set(i);
    },
    'click #moveToHand': function () {
        var i = index.get();
        var dropDoc = drop[i];
        var options = {
            action: 'remove',
            actor: 'hand',
            id: dropDoc.card._id
        };
        Mediator.publish('drop',options);
    }
});
Preview.viewCard = function(file) {
    srcFile.set(file);
    if (isDrop.get()) isDrop.set(false);
};
Preview.viewDrop = function(cursor) {
    tracker.stop();
    isDrop.set(true);
    drop = cursor.fetch();
    max = drop.length-1;
    srcFile.set(drop[0].card.file);
    tracker.start();
};