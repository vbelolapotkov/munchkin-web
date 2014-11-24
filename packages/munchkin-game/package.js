Package.describe({
    summary: "munchkin game main package",
    version: "0.0.1",
    name: "vbelolapotkov:munchkin-game"
});

Package.onUse(function (api) {
    var both = ['client', 'server'];

    api.use('meteor-platform', both);
    api.use('vbelolapotkov:munchkin-game-player', both);

    api.addFiles('namespace.js', both);
    api.addFiles('views/game_page.css', 'client');
    api.addFiles('views/game_page.html', 'client');
    api.addFiles('views/game_page.js', 'client');
    api.addFiles('collections.js', both);
    api.addFiles('server.js', 'server');
    api.addFiles('methods.js', 'client');

    api.export('Game');
});