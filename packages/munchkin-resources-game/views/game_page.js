//not subscribed for collections yet
var currentGameId = new ReactiveVar(null);
var subscriptions = {};
subscriptions.init = function(gameId) {
    this.table = Meteor.subscribe('gameTable', gameId);
    this.drop = Meteor.subscribe('gameDrop', gameId);
    this.deck = Meteor.subscribe('gameDecks', gameId);
    var self = this;
    this.computation = Tracker.autorun(function() {
        if (!self.deck.ready() || !self.table.ready() || !self.drop.ready()) return;
        observers.start();
    });
};
Tracker.autorun(function() {
    if (!currentGameId.get()) return;
    var gameId = currentGameId.get();
    console.log('subscribing to game resources:' + gameId);
    subscriptions.init(gameId);
});
var observers = {};
observers.start = function() {
    var self = this;
    console.log('observers recomputed');
    var gameId = currentGameId.get();
    var gameTable = Collections.Table.find({
        gameId: gameId
    });
    var gameDrop = Collections.Drop.find({
        gameId: gameId
    });
    self.observeTable = gameTable.observe({
        added: function(doc) {
            var dropTo = document.getElementById('gameTable');
            var elem = document.createElement('img');
            elem.id = doc.card._id;
            elem.className = doc.card.type;
            elem.src = doc.card.file;
            elem.style.top = doc.coords.top + 'px';
            elem.style.left = doc.coords.left + 'px';
            elem.setAttribute('draggable', 'true');
            dropTo.appendChild(elem);
        }, // Use either added() OR(!) addedBefore()
        changed: function(newDoc, oldDoc) {
            var elem = document.getElementById(newDoc.card._id);
            elem.style.top = newDoc.coords.top + 'px';
            elem.style.left = newDoc.coords.left + 'px';
        },
        removed: function(oldDoc) {
            var elem = document.getElementById(oldDoc.card._id);
            var gameTable = document.getElementById('gameTable');
            gameTable.removeChild(elem);
        }
    });
    self.observeDrop = gameDrop.observe({
        added: function(doc) {
            var dropTo = document.getElementById('drop' + doc.card.type);
            var elem = document.createElement('img');
            elem.id = doc.card._id;
            elem.className = doc.card.type;
            elem.src = doc.card.file;
            elem.setAttribute('draggable', 'true');
            dropTo.appendChild(elem);
        },
        changed: function(newDoc, oldDoc) {
            // ...
        },
        removed: function(doc) {
            var elem = document.getElementById(doc.card._id);
            var drop = document.getElementById('drop' + doc.card.type);
            drop.removeChild(elem);
        }
    });
};
observers.stop = function() {
    if (this.observeDrop) this.observeDrop.stop();
    if (this.observeTable) this.observerTable.stop();
};
Template.munchkinGamePage.rendered = function() {
    console.log('game page rendered');
    console.log(subscriptions);
    if (!this.data) return;
    currentGameId.set(this.data._id);
};
Template.munchkinGamePage.destroyed = function() {
    console.log('destroying gamePage');
    observers.stop();
};
Template.munchkinGamePage.helpers({
    currentPlayer: function() {
        return Player.getData(this._id, Meteor.userId());
    },
    gameOwner: function() {
        var gameData = Game.getGameData(this._id);
        if (gameData) return gameData.owner;
    }
});
Template.munchkinGamePage.events({
    'click #addPlayer': function(e) {
        e.stopPropagation();
        var options = {
            gameId: this._id,
            userId: Meteor.userId
        };
        Player.add(this._id);
    },
    'dragover #gameTable,#dropdoor,#droptres': function(e) {
        e.preventDefault();
    },
    'drop #gameTable': function(e) {
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
            card = Deck.getCard(this._id, cardElem.type);
            if (!card) {
                alert('Error: cannot get card from deck: ' + cardElem.type);
                return;
            }
            Collections.Table.insert({
                gameId: this._id,
                card: card,
                coords: {
                    top: top,
                    left: left
                }
            }, function(error, result) {
                if (error) alert(error.reason);
            });
        } else {
            //the card is known, move it to table
            switch (fromElem.id) {
                case 'gameTable':
                    //card moved on table, update db
                    var cardId = Collections.Table.findOne({
                        gameId: this._id,
                        'card._id': cardElem.id
                    })._id;
                    Collections.Table.update(cardId, {
                        $set: {
                            'card.id': cardElem.id,
                            'coords.top': top,
                            'coords.left': left
                        }
                    }, function(error, result) {
                        if (error) alert(error.reason);
                    });
                    break;
                case 'drop':
                    //card moved from drop to table
                    //make db corrections and move the card
                    card = Collections.Drop.findOne({
                        gameId: this._id,
                        'card._id': cardElem.id
                    });
                    Collections.Drop.remove(card._id, function(error, result) {
                        if (error) alert(error.reason);
                        else {
                            Collections.Table.insert({
                                gameId: card.gameId,
                                card: card.card,
                                coords: {
                                    top: top,
                                    left: left
                                }
                            });
                        }
                    });
                    break;
                case 'player':
                    //card played by current player
                    //ask player package to remove the card from db
                    //and notify me to put it on table
                    break;
            }
        }
    },
    'drop #dropdoor,#droptres': function(e) {
        e.preventDefault();
        e.stopPropagation();
        e.dataTransfer = e.originalEvent.dataTransfer;
        var data = JSON.parse(e.dataTransfer.getData("text"));
        var cardElem = data.cardElem;
        var fromElem = data.fromElem;
        var dropTo = {};
        dropTo.elem = e.currentTarget;
        //do not drop unknown card
        if (!cardElem.id) return;
        cardElem.elem = document.getElementById(cardElem.id);
        //checking if the drop is correct
        if (('drop' + cardElem.type) !== dropTo.elem.id) return;
        switch (fromElem.id) {
            case 'gameTable':
                var cardDoc = Collections.Table.findOne({
                    gameId: this._id,
                    'card._id': cardElem.id
                });
                Collections.Table.remove(cardDoc._id, function(error, result) {
                    if (error) alert(error.reason);
                    else {
                        Collections.Drop.insert({
                            gameId: cardDoc.gameId,
                            card: cardDoc.card,
                        });
                    }
                });
                break;
            case 'player':
                //card played by current player
                //ask player package to remove the card from db
                //and notify me to put it on table
                break;
        }
    },
    'dragstart #gameTable > .door,#gameTable > .tres': function(e) {
        initDragStart(e, 'gameTable');
    },
    'dragstart #deckdoor .door': function(e) {
        initDragStart(e, 'deckdoor');
    },
    'dragstart #decktres .tres': function(e) {
        initDragStart(e, 'decktres');
    },
    'dragstart #dropdoor .door,#droptres .tres': function(e) {
        initDragStart(e, 'drop');
    },
    'dblclick #gameTable': function(e) {
        e.stopPropagation();
        if (e.target.id !== 'gameTable') return false;
        var gameId = this._id;
        $('#gameTable > img').each(function() {
            var img = this;
            var cardDoc = Collections.Table.findOne({
                gameId: gameId,
                'card._id': img.id
            });
            Collections.Table.remove(cardDoc._id, function(error, result) {
                if (error) alert(error.reason);
                else {
                    Collections.Drop.insert({
                        gameId: cardDoc.gameId,
                        card: cardDoc.card,
                    });
                }
            });
        });
    }
});
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
var createCard = function(card) {
    var elem = document.createElement('img');
    elem.id = card._id;
    elem.className = card.type;
    elem.src = card.file;
    elem.setAttribute('draggable', 'true');
    elem.style.position = 'absolute';
    return elem;
};