Package.describe({
    summary: "game events package",
    version: "1.0.0",
    name: "vbelolapotkov:munchkin-resources-events"
});

Package.onUse(function (api) {
    var both = ['client', 'server'];

    api.use('meteor-platform',both);

    api.addFiles('methods.js', both);
    api.addFiles('server.js', 'server');
    api.addFiles('views/gameEvents.html', 'client');
    api.addFiles('views/gameEvents.css', 'client');
    api.addFiles('views/gameEvents.js', 'client');

    api.export('GameEvents');
});