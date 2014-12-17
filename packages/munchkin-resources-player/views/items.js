var currentGameId;
var currentPlayerId;
var selectedPlayer = new ReactiveVar(null);
var subscriptions = {};
subscriptions.init = function() {
    itemsListener.start();
    var itemsSubscription = Meteor.subscribe('gameItems', currentGameId);
    Tracker.autorun(function(computation) {
        if (!itemsSubscription.ready()) return;
        computation.stop();
    });
};
var itemsListener = {
    msg: null,
    computation: null,
    stop: function() {
        if (this.computation) this.computation.stop();
    },
    start: function() {
        this.stop();
        var self = this;
        var gameId = currentGameId;
        var playerId = currentPlayerId;
        this.computation = Tracker.autorun(function() {
            itemsListener.msg = Mediator.subscribe('items');
            if (!self.msg) return;
            switch (self.msg.action) {
                case 'insert':
                    Collections.Items.insert({
                        playerId: playerId,
                        gameId: gameId,
                        card: self.msg.card,
                        coords: self.msg.coords
                    });
                    break;
                case 'remove':
                    removeFromItemsHandler(playerId, self.msg.actor, self.msg.id, self.msg.coords);
                    break;
            }
            Mediator.reset('items');
        });
    }
};
var removeFromItemsHandler = function(playerId, actor, id, coords) {
    var cardDoc = Collections.Items.findOne({
        playerId: playerId,
        'card._id': id
    });
    if (!cardDoc) return;
    Collections.Items.remove(cardDoc._id, function(error) {
        if (error) alert(error.reason);
        else Mediator.publish(actor, {
            action: 'insert',
            actor: 'items',
            card: cardDoc.card,
            coords: coords
        });
    });
};

Template.munchkinPlayerItems.rendered = function() {
    if (!this.data) return;
    if (currentGameId === this.data._id) return;
    currentGameId = this.data._id;
    selectCurrentPlayer();
    subscriptions.init();
};
var selectCurrentPlayer = function() {
    var player = Player.getData(currentGameId, Meteor.userId());
    if (!player) return;
    currentPlayerId = player._id;
    selectedPlayer.set(player._id);
};
Template.munchkinPlayerItems.helpers({
    playerInGame: function() {
        return Player.getGamePlayers(this._id);
    },
    currentPlayer: function() {
        return Player.getData(this._id, Meteor.userId());
    },
    isCurrentPlayer: function() {
        return this.userId === Meteor.userId();
    },
    selected: function() {
        if (selectedPlayer.get() === this._id) return "selected";
    },
    selectedPlayerItems: function() {
        return Collections.Items.find({
            playerId: selectedPlayer.get()
        });
    },
    isDraggable: function () {
        return checkPlayer().toString();
    },
    inBag: function () {
        return this.isInBag ? 'inBag' : '';
    },
    isGameOwner: function () {
        var game = Game.getGameData(this.gameId);
        return game && game.ownerId === Meteor.userId();
    }
});
Template.munchkinPlayerItems.events({
    'click ul.itemsTabs > li': function(e) {
        e.preventDefault();
        selectedPlayer.set(this._id);
    },
    'dragover #playerItemsArea': function(e) {
        e.preventDefault();
    },
    'dragstart #playerItemsArea': function(e) {
        initDragStart(e, 'items');
    },
    'drop #playerItemsArea': function(e) {
        e.preventDefault();
        e.stopPropagation();
        e.dataTransfer = e.originalEvent.dataTransfer;
        var data = JSON.parse(e.dataTransfer.getData("text"));
        var cardElem = data.cardElem;
        var fromElem = data.fromElem;
        var targetCoords = getCoords(e.currentTarget);
        var top = e.originalEvent.pageY - targetCoords.top - cardElem.shiftY;
        var left = e.originalEvent.pageX - targetCoords.left - cardElem.shiftX;
        if (!cardElem.id) return false;
        var options;
        var cardDoc;
        switch (fromElem.id) {
            case 'gameTable':
                if (!checkPlayer()) return false;
                //card moved from table
                //ask table to remove card
                //and notify me when card removed
                options = {
                    action: 'remove',
                    actor: 'items',
                    id: cardElem.id,
                    coords: {
                        top: top,
                        left: left
                    }
                };
                Mediator.publish('gameTable', options);
                break;
            case 'drop':
                if (!checkPlayer()) return false;
                //card moved from drop
                //ask drop to remove card
                //and notify me when card removed
                options = {
                    action: 'remove',
                    actor: 'items',
                    id: cardElem.id,
                    coords: {
                        top: top,
                        left: left
                    }
                };
                Mediator.publish('drop', options);
                break;
            case 'hand':
                //move card from hand to items
                if (checkPlayer()) {
                    cardDoc = Collections.Hand.findOne({
                        playerId: currentPlayerId,
                        'card._id': cardElem.id
                    });
                    Collections.Hand.remove(cardDoc._id, function (error) {
                        if(error) alert (error.reason);
                        else {
                            Collections.Items.insert(
                            {
                                playerId: currentPlayerId,
                                gameId: cardDoc.card.gameId,
                                card: cardDoc.card,
                                coords: {
                                    top: top,
                                    left: left
                                }
                            });
                        }
                    });
                } else {
                    cardDoc = Collections.Hand.findOne({
                        playerId: currentPlayerId,
                        'card._id': cardElem.id
                    });
                    var newPlayerId = selectedPlayer.get();
                    Collections.Hand.remove(cardDoc._id, function (error) {
                        if(error) alert (error.reason);
                        else {
                            Collections.Hand.insert(
                            {
                                playerId: newPlayerId,
                                card: cardDoc.card,
                            });
                        }
                    });
                }
                break;
            case 'items':
                //card moved it items
                //update coords
                cardDoc = Collections.Items.findOne({
                        gameId: currentGameId,
                        'card._id': cardElem.id
                    });
                    Collections.Items.remove(cardDoc._id, function(error) {
                        if (error) alert(error.reason);
                        else Collections.Items.insert({
                            playerId: cardDoc.playerId,
                            gameId: cardDoc.gameId,
                            card: cardDoc.card,
                            coords: {
                                top: top,
                                left: left
                            },
                            isInBag: cardDoc.isInBag
                        });
                    });
                break;
        }
    },
    'dblclick #playerItemsArea > img': function (e) {
        e.preventDefault();
        e.stopPropagation();
        if(!checkPlayer())return;
        toggleItem(e.target.id);
    },
    'contextmenu #playerItemsArea > img': function (e) {
         e.preventDefault();
         var elem = e.target;
         if(elem && elem.src)
            Preview.viewCard(elem.src);
    },
    'click .kickPlayerBtn': function (e) {
        e.stopPropagation();
        if (!confirm('Вы хотите удалить игрока?')) return false;
        Meteor.call('kickPlayer',e.target.id);
    }
});
var checkPlayer = function() {
    return selectedPlayer.get() === currentPlayerId;
};

var toggleItem = function (id) {
    var cardDoc = Collections.Items.findOne({
        playerId: currentPlayerId,
        'card._id': id
    });
    if(!cardDoc) return;
    var val = cardDoc.isInBag ? false : true;
    Collections.Items.update(cardDoc._id, {$set: {isInBag: val}}, function (error) {
        if(error) console.error(error.reason);
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