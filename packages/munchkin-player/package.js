Package.describe({
    summary: "Munchkin player elements",
    version: "0.0.1",
    name: "vbelolapotkov:munchkin-player"
});

Package.onUse(function (api) {
    var both = ['client', 'server'];

    api.use('meteor-platform', both);

    api.addFiles('collections.js', both);
    api.addFiles('server.js', 'server');
    api.addFiles('methods.js', both);

    api.export('Player');
});