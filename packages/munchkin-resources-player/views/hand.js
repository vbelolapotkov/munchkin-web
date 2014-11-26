var msg;

Template.playerHand.rendered = function() {
    
};

Template.playerHand.helpers({
    msg: function () {
        var x = Mediator.subscribe('hand');
        if(x) return x[1];
    }
});
