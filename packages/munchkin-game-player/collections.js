Player = {};
Player.Collections = {
    Players: new Mongo.Collection('players'),
    Stats: new Mongo.Collection('playerStats'),
    Hand: new Mongo.Collection('hand'),
    Items: new Mongo.Collection('items'),
};

