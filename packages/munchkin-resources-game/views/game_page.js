//not subscribed for collections yet
var currentGameId;
var subscriptions = {};
subscriptions.init = function(gameId) {
    tableListener.start();
    dropListener.start();
    this.table = Meteor.subscribe('gameTable', gameId);
    this.drop = Meteor.subscribe('gameDrop', gameId);
    this.deck = Meteor.subscribe('gameDecks', gameId);
    this.dice = Meteor.subscribe('gameDice', gameId);
};
var tableListener = {
    msg: null,
    computation: null,
    stop: function() {
        if (this.computation) this.computation.stop();
    },
    start: function() {
        this.stop();
        var self = this;
        var gameId = currentGameId;
        this.computation = Tracker.autorun(function() {
            tableListener.msg = Mediator.subscribe('gameTable');
            if (!self.msg) return;
            switch (self.msg.action) {
                case 'insert':
                    Collections.Table.insert({
                        gameId: gameId,
                        card: self.msg.card,
                        coords: self.msg.coords
                    });
                    break;
                case 'remove':
                    removeFromTableHandler(gameId, self.msg.actor, self.msg.id, self.msg.coords);
                    break;
            }
            Mediator.reset('gameTable');
        });
    }
};
var removeFromTableHandler = function(gameId, actor, id, coords) {
    var cardDoc = Collections.Table.findOne({
        gameId: gameId,
        'card._id': id
    });
    if (!cardDoc) return;
    Collections.Table.remove(cardDoc._id, function(error) {
        if (error) alert(error.reason);
        else Mediator.publish(actor, {
            action: 'insert',
            actor: 'gameTable',
            card: cardDoc.card,
            coords: coords
        });
    });
};
var dropListener = {
    msg: null,
    computation: null,
    stop: function() {
        if (this.computation) this.computation.stop();
    },
    start: function() {
        var self = this;
        var gameId = currentGameId;
        this.computation = Tracker.autorun(function() {
            dropListener.msg = Mediator.subscribe('drop');
            if (!self.msg) return;
            switch (self.msg.action) {
                case 'insert':
                    var card = self.msg.card;
                    insertIntoDropHandler(card);
                    break;
                case 'remove':
                    removeFromDropHandler(gameId, self.msg.actor, self.msg.id, self.msg.coords);
                    break;
            }
            Mediator.reset('drop');
        });
    }
};
var insertIntoDropHandler = function(card) {
    var topCard = Collections.Drop.find({
        gameId: card.gameId,
        'card.type': card.type
    }, {
        sort: {
            'card.index': -1
        },
        limit: 1,
        reactive: false
    }).fetch();
    var topIndex = topCard[0] ? topCard[0].card.index : 0;
    card.index = topIndex + 1;
    Collections.Drop.insert({
        gameId: card.gameId,
        card: card,
    });
};
var removeFromDropHandler = function(gameId, actor, id, coords) {
    var cardDoc = Collections.Drop.findOne({
        gameId: gameId,
        'card._id': id
    });
    if (!cardDoc) return;
    Collections.Drop.remove(cardDoc._id, function(error) {
        if (error) alert(error.reason);
        else Mediator.publish(actor, {
            action: 'insert',
            actor: 'drop',
            card: cardDoc.card,
            coords: coords
        });
    });
};
Template.munchkinGamePage.rendered = function() {
    if (!this.data) return;
    if (currentGameId === this.data._id) return;
    currentGameId = this.data._id;
    subscriptions.init(currentGameId);
};
Template.munchkinGamePage.destroyed = function() {
    console.log('destroying gamePage');
    tableListener.stop();
    dropListener.stop();
};
Template.munchkinGamePage.helpers({
    currentPlayer: function() {
        return Player.getData(this._id, Meteor.userId());
    },
    gameOwner: function() {
        var gameData = Game.getGameData(this._id);
        console.log(gameData);
        if (gameData) return gameData.owner;
        Router.go('/');
    },
    isOwner: function () {
        var gameData = Game.getGameData(this._id);
        return gameData && gameData.ownerId === Meteor.userId();
    },
    cardOnTable: function() {
        return Collections.Table.find({
            gameId: this._id
        });
    },
    cardInDropTres: function() {
        return Collections.Drop.find({
            gameId: this._id,
            'card.type': 'tres'
        }, {
            sort: {
                'card.index': -1
            },
            limit: 1
        });
    },
    cardInDropDoor: function() {
        return Collections.Drop.find({
            gameId: this._id,
            'card.type': 'door'
        }, {
            sort: {
                'card.index': -1
            },
            limit: 1
        });
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
    'drop #sideBarRight': function(e) {
        e.preventDefault();
        e.stopPropagation();
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
            var options;
            switch (fromElem.id) {
                case 'gameTable':
                    //card moved on table, update db
                    var cardId = Collections.Table.findOne({
                        gameId: this._id,
                        'card._id': cardElem.id
                    })._id;
                    Collections.Table.update(cardId, {
                        $set: {
                            // 'card.id': cardElem.id,
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
                case 'hand':
                    //card played by current player
                    //ask player package to remove the card from db
                    //and notify me to put it on table
                    options = {
                        action: 'remove',
                        actor: 'gameTable',
                        id: cardElem.id,
                        coords: {
                            top: top,
                            left: left
                        }
                    };
                    Mediator.publish('hand', options);
                    break;
                case 'items':
                    options = {
                        action: 'remove',
                        actor: 'gameTable',
                        id: cardElem.id,
                        coords: {
                            top: top,
                            left: left
                        }
                    };
                    Mediator.publish('items', options);
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
                        insertIntoDropHandler(cardDoc.card);
                    }
                });
                break;
            case 'hand':
                //card played by current player
                //ask player package to remove the card from db
                //and notify me to put it on table
                var options = {
                    action: 'remove',
                    actor: 'drop',
                    id: cardElem.id,
                };
                Mediator.publish('hand', options);
                break;
            case 'items':
                options = {
                    action: 'remove',
                    actor: 'drop',
                    id: cardElem.id,
                };
                Mediator.publish('items', options);
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
        e.preventDefault();
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
                    insertIntoDropHandler(cardDoc.card);
                }
            });
        });
    },
    'contextmenu #gameTable > img': function(e) {
        e.preventDefault();
        var elem = e.target;
        if (elem && elem.src) Preview.viewCard(elem.src);
    },
    'contextmenu #dropdoor > img,#droptres > img': function(e) {
        e.preventDefault();
        var elem = e.target;
        if (!elem || !elem.src) return;
        var dropType = getType(elem);
        var cursor = Collections.Drop.find({
            gameId: currentGameId,
            'card.type': dropType
        }, {
            sort: {
                'card.index': -1
            }
        });
        if(!cursor) return;
        Preview.viewDrop(cursor);
    },
    'click #rollDice': function() {
        var player = Player.getData(this._id, Meteor.userId());
        if (!player) return;
        Dice.roll(this._id, player.displayname);
    },
    'click #shuffleDoor': function() {
        Deck.shuffle(this._id, 'door');
    },
    'click #shuffleTres': function() {
        Deck.shuffle(this._id, 'tres');
    },
    'click #gameEnd': function () {
        if (!confirm('Завершить игру?')) return false;
        Meteor.call('endGame', this._id, function (error, result) {
            if(error) console.error(error.reason);
            Router.go('/');
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