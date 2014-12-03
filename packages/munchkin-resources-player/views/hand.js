var msg;

Template.playerHand.rendered = function() {
    
};

Template.playerHand.helpers({
    msg: function () {
        var x = Mediator.subscribe('hand');
        if(x) return x[1];
    }
});

Template.playerHand.events({
    'dragover #currentPlayerArea': function (e) {
        e.preventDefault();
    },
    'drop #currentPlayerArea': function (e) {
        e.preventDefault();
        e.stopPropagation();
        console.log('Droped to hand');
    }
});