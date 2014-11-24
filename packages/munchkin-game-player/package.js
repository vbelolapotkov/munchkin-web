Package.describe({
    summary: "Munchkin player elements",
    version: "0.0.1",
    name: "vbelolapotkov:munchkin-game-player"
});

Package.onUse(function (api) {
    var both = ['client', 'server'];

    api.use('meteor-platform', both);

    api.addFiles('collections.js', both);
    api.addFiles('server.js', 'server');
    api.addFiles('views/items.html', 'client');
    api.addFiles('views/items.js', 'client');
    api.addFiles('views/hand.html', 'client');
    api.addFiles('views/stats.html', 'client');
    api.addFiles('views/stats.js', 'client');
    api.addFiles('views/player.css', 'client');

    api.export('Player');
});