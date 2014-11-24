Package.describe({
    summary: "munchkin lobby top level",
    version: "0.0.1",
    name: "vbelolapotkov:munchkin-lobby"
});

Package.onUse(function (api) {
    var both = ['client', 'server'];

    api.use('meteor-platform');
    api.use('vbelolapotkov:munchkin-game', both);

    api.addFiles('namespace.js', both);
    api.addFiles('views/lobby.html','client');
    api.addFiles('views/lobby.css', 'client');
    api.addFiles('views/lobby.js', 'client');
    api.addFiles('views/lobby_newgame.html', 'client');
    api.addFiles('views/lobby_newgame.css', 'client');
    api.addFiles('views/lobby_newgame.js', 'client');
});