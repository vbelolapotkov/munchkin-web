Package.describe({
    summary: "Munchkin game common resources",
    version: "0.0.1",
    name: "vbelolapotkov:munchkin-resources-game"
});

Package.onUse(function (api) {
    var both = ['client', 'server'];

    api.use('meteor-platform', both);
    api.use('reactive-var', both);
    api.use('vbelolapotkov:munchkin-game', both);
    api.use('vbelolapotkov:munchkin-resources-deck','client');
    api.use('vbelolapotkov:munchkin-player', both);
    api.use('vbelolapotkov:munchkin-resources-mediator','client');

    api.addFiles('collections.js', both);
    api.addFiles('server.js', 'server');
    api.addFiles('views/game_page.css', 'client');
    api.addFiles('views/game_page.html', 'client');
    api.addFiles('views/game_page.js', 'client');
});