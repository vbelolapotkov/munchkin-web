Template.munchkinGamePage.helpers({
    currentPlayer: function() {
        return Player.getData(this._id, Meteor.userId());
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
        var dropTo = {};
        var targetCoords = getCoords(e.currentTarget);
        dropTo.elem = e.currentTarget;
        dropTo.downX = e.originalEvent.pageX - targetCoords.left;
        dropTo.downY = e.originalEvent.pageY - targetCoords.top;
        var top = dropTo.downY - cardElem.shiftY;
        var left = dropTo.downX - cardElem.shiftX;
        var card = {};
        if (!cardElem.id) {
            //get new card from deck
            card = Deck.getCard(this._id, cardElem.type);
            if (!card) {
                alert('Error: cannot get card from deck: ' + cardElem.type);
                return;
            }
            var elem = createCard(card);
            elem.style.top = top + 'px';
            elem.style.left = left + 'px';
            Collections.Table.insert({
                gameId: this._id,
                card: card,
                coords: {
                    top: top,
                    left: left
                }
            }, function(error, result) {
                if (error) alert(error.reason);
                else dropTo.elem.appendChild(elem);
            });
        } else {
            //the card is known, move it to table
            cardElem.elem = document.getElementById(cardElem.id);
            
            switch (fromElem.id) {
                case 'gameTable':
                    //card moved on table, update db
                    Collections.Table.update(Collections.Table.findOne({
                        gameId: this._id,
                        'card._id': cardElem.id
                    })._id, {
                        $set: {
                            'coords.top': top,
                            'coords.left': left
                        }
                    }, function(error, result) {
                        if (error) alert(error.reason);
                        else {
                            cardElem.elem.style.top = top + 'px';
                            cardElem.elem.style.left = left + 'px';
                            dropTo.elem.appendChild(cardElem.elem);
                        }
                    });
                    break;
                case 'drop':
                    //card moved from drop to table
                    //make db corrections and move the card
                    card = Collections.Drop.findOne({
                        gameId: this._id,
                        'card._id':cardElem.id
                    });
                    Collections.Drop.remove(card._id, function (error, result) {
                        if (error) alert(error.reason);
                        else {
                            cardElem.elem.style.top = top + 'px';
                            cardElem.elem.style.left = left + 'px';
                            dropTo.elem.appendChild(cardElem.elem);
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
                        cardElem.elem.removeAttribute('style');
                        dropTo.elem.appendChild(cardElem.elem);
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
    'dblclick #gameTable': function (e) {
        e.stopPropagation();
        if(e.target.id !=='gameTable') return false;
        var gameId = this._id;
        $('#gameTable > img').each(function () {
            var img = this;
            var dropTo = document.getElementById('drop'+getType(img));
            var cardDoc = Collections.Table.findOne({
                    gameId: gameId,
                    'card._id': img.id
                });
                Collections.Table.remove(cardDoc._id, function(error, result) {
                    if (error) alert(error.reason);
                    else {
                        img.removeAttribute('style');
                        dropTo.appendChild(img);
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