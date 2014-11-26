Package.describe({
    summary: "Munchkin player resources",
    version: "0.0.1",
    name: "vbelolapotkov:munchkin-resources-player"
});

Package.onUse(function (api) {
    var both = ['client', 'server'];

    api.use('meteor-platform', both);
    api.use('vbelolapotkov:munchkin-game', both);
    api.use('vbelolapotkov:munchkin-player', both);
    api.use('vbelolapotkov:munchkin-resources-mediator','client');

    api.addFiles('collections.js', both);
    api.addFiles('server.js', 'server');
    api.addFiles('views/items.html', 'client');
    api.addFiles('views/items.js', 'client');
    api.addFiles('views/hand.html', 'client');
    api.addFiles('views/hand.js', 'client');
    api.addFiles('views/stats.html', 'client');
    api.addFiles('views/stats.js', 'client');
    api.addFiles('views/player.css', 'client');
});