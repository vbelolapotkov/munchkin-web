var msg;
var currentPlayerId = new ReactiveVar(null);
var subscriptions = {};
subscriptions.init = function(playerId) {
    this.hand = Meteor.subscribe('playerHand', playerId);
    var self = this;
    this.computation = Tracker.autorun(function() {
        console.log('waiting for currentPlayer hand');
        if (!self.hand.ready()) return;
        observers.start();
    });
};
Tracker.autorun(function() {
    if (!currentPlayerId.get()) return;
    var playerId = currentPlayerId.get();
    console.log('subscribing to player resources:' + playerId);
    subscriptions.init(playerId);
});
var observers = {};
observers.start = function() {
    var self = this;
    console.log('creating new hand observer');
    var playerId = currentPlayerId.get();
    var myHand = Collections.Hand.find({
        playerId: playerId
    });
    self.observeHand = myHand.observe({
        added: function(doc) {
            var elem = document.createElement('img');
            elem.id = doc.card._id;
            elem.className = doc.card.type;
            elem.src = doc.card.file;
            elem.setAttribute('draggable', 'true');
            var hand = document.getElementById('myHand');
            hand.appendChild(elem);
        },
        changed: function(newDoc, oldDoc) {
            // ...
        },
        removed: function(doc) {
            var elem = document.getElementById(doc.card._id);
            var hand = document.getElementById('myHand');
            hand.removeChild(elem);
        }
    });
};
observers.stop = function() {
    if (this.observeHand) this.observeHand.stop();
};
Template.playerHand.rendered = function() {
    console.log('player hand rendered');
    console.log(observers);
    if (!this.data) return;
    currentPlayerId.set(this.data._id);
};
Template.munchkinGamePage.destroyed = function() {
    observers.stop();
};
Template.playerHand.helpers({
    // isSubscribed: function () {
    //     var subscription = Meteor.subscribe('playerHand',this.gameId, this._id);
    //     return subscription.ready();
    // },
    msg: function() {
        var x = Mediator.subscribe('hand');
        if (x) return x[1];
    }
});
Template.playerHand.events({
    'dragover #currentPlayerArea': function(e) {
        e.preventDefault();
    },
    'drop #currentPlayerArea': function(e) {
        e.preventDefault();
        e.stopPropagation();
        console.log('Droped to hand');
        e.dataTransfer = e.originalEvent.dataTransfer;
        var data = JSON.parse(e.dataTransfer.getData("text"));
        var cardElem = data.cardElem;
        var fromElem = data.fromElem;
        var targetCoords = getCoords(e.currentTarget);
        var top = e.originalEvent.pageY - targetCoords.top - cardElem.shiftY;
        var left = e.originalEvent.pageX - targetCoords.left - cardElem.shiftX;
        var card = {};
        if (!cardElem.id) {
            //get new card from deck
            card = Deck.getCard(this.gameId, cardElem.type);
            if (!card) {
                alert('Error: cannot get card from deck: ' + cardElem.type);
                return;
            }
            Collections.Hand.insert({
                playerId: this._id,
                card: card,
                // coords: {
                //     top: top,
                //     left: left
                // }
            }, function(error, result) {
                if (error) alert(error.reason);
            });
        } else {
            //the card is known, move it to table
            switch (fromElem.id) {
                case 'gameTable':
                    //card moved from table
                    //ask game package to remove the card from db
                    //and notify me to put it in hand
                    break;
                case 'drop':
                    //card moved from drop to hand
                    //ask game package to remove the card from db
                    //and notify me to put it in hand
                    break;
                case 'player':
                    //card played by current player
                    //ask player package to remove the card from db
                    //and notify me to put it on table
                    break;
            }
        }
    }
});
var getCoords = function(elem) {
    var box = elem.getBoundingClientRect();
    var body = document.body;
    var docElem = document.documentElement;
    var scrollTop = window.pageYOffset || docElem.scrollTop || body.scrollTop;
    var scrollLeft = window.pageXOffset || docElem.scrollLeft || body.scrollLeft;
    var clientTop = docElem.clientTop || body.clientTop || 0;
    var clientLeft = docElem.clientLeft || body.clientLeft || 0;
    var top = box.top + scrollTop - clientTop;
    var left = box.left + scrollLeft - clientLeft;
    return {
        top: Math.round(top),
        left: Math.round(left)
    };
};