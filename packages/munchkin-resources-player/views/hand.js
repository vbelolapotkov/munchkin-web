var currentPlayerId;
var subscriptions = {};
subscriptions.init = function(playerId) {
    listener.start();
    this.hand = Meteor.subscribe('playerHand', playerId);
};
var listener = {
    msg: null,
    computation: null,
    stop: function() {
        if (this.computation) this.computation.stop();
    },
    start: function() {
        this.stop();
        var self = this;
        var playerId = currentPlayerId;
        this.computation = Tracker.autorun(function() {
            listener.msg = Mediator.subscribe('hand');
            if (!self.msg) return;
            switch (self.msg.action) {
                case 'insert':
                    insertIntoHandHandler(playerId, self.msg.card);
                    break;
                case 'remove':
                    console.log('remove received');
                    removeFromHandHandler(playerId, self.msg.actor, self.msg.id, self.msg.coords);
                    break;
            }
            Mediator.reset('hand');
        });
    }
};
Template.playerHand.rendered = function() {
    if (!this.data) return;
    if (currentPlayerId === this.data._id) return;
    currentPlayerId = this.data._id;
    subscriptions.init(currentPlayerId);
};
Template.munchkinGamePage.destroyed = function() {};
Template.playerHand.helpers({
    cardInHand: function() {
        return Collections.Hand.find({
            playerId: this._id
        });
    }
});
Template.playerHand.events({
    'dragover #currentPlayerArea,#myHand': function(e) {
        e.preventDefault();
    },
    'drop #currentPlayerArea': function(e) {
        e.preventDefault();
        e.stopPropagation();
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
            insertIntoHandHandler(this._id, card);
        } else {
            //the card is known, move it to table
            var options;
            switch (fromElem.id) {
                case 'gameTable':
                    //card moved from table
                    //ask game package to remove the card from db
                    //and notify me to put it in hand
                    options = {
                        action: 'remove',
                        actor: 'hand',
                        id: cardElem.id
                    };
                    Mediator.publish('gameTable', options);
                    break;
                case 'drop':
                    //card moved from drop to hand
                    //ask game package to remove the card from db
                    //and notify me to put it in hand
                    options = {
                        action: 'remove',
                        actor: 'hand',
                        id: cardElem.id
                    };
                    Mediator.publish('drop', options);
                    break;
                case 'player':
                    //card played by current player
                    //ask player package to remove the card from db
                    //and notify me to put it on table
                    break;
                case 'items':
                    var cardDoc = Collections.Items.findOne({
                        playerId: currentPlayerId,
                        'card._id': cardElem.id
                    });
                    Collections.Items.remove(cardDoc._id, function(error) {
                        if (error) alert(error.reason);
                        else {
                            Collections.Hand.insert({
                                playerId: currentPlayerId,
                                card: cardDoc.card,
                            });
                        }
                    });
                    break;
            }
        }
    },
    'dragstart #myHand': function(e) {
        initDragStart(e, 'hand');
        return true;
    },
    'contextmenu #myHand > img': function(e) {
        e.preventDefault();
        var elem = e.target;
        if (elem && elem.src) Preview.viewCard(elem.src);
    }
});
var removeFromHandHandler = function(playerId, actor, id, coords) {
    var cardDoc = Collections.Hand.findOne({
        playerId: playerId,
        'card._id': id
    });
    if (!cardDoc) return;
    Collections.Hand.remove(cardDoc._id, function(error) {
        if (error) alert(error.reason);
        else Mediator.publish(actor, {
            action: 'insert',
            actor: 'hand',
            card: cardDoc.card,
            coords: coords
        });
    });
};
var insertIntoHandHandler = function(playerId, card) {
    var topCard = Collections.Hand.find({
        playerId: playerId,
    }, {
        sort: {
            'card.index': -1
        },
        limit: 1,
        reactive: false
    }).fetch();
    var topIndex = topCard[0] ? topCard[0].card.index : 0;
    card.index = topIndex + 1;
    Collections.Hand.insert({
        playerId: playerId,
        card: card
    }, function(error, result) {
        if (error) alert(error.reason);
    });
};
var initDragStart = function(e, from) {
    var draggedCard = getDraggedCard(e);
    var draggedFrom = {
        id: from
    };
    var data = {
        cardElem: draggedCard,
        fromElem: draggedFrom
    };
    e.dataTransfer = e.originalEvent.dataTransfer;
    e.dataTransfer.setData("text", JSON.stringify(data));
};
var getDraggedCard = function(e) {
    var card = {
        type: getType(e.target),
        id: e.target.id,
    };
    var targetCoords = getCoords(e.target);
    card.shiftX = e.originalEvent.pageX - targetCoords.left;
    card.shiftY = e.originalEvent.pageY - targetCoords.top;
    return card;
};
var getType = function(elem) {
    if (elem.classList.contains('door')) return 'door';
    if (elem.classList.contains('tres')) return 'tres';
    return;
};
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