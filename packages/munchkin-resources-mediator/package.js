Package.describe({
    summary: "cards movement mediator",
    version: "0.0.1",
    name: "vbelolapotkov:munchkin-resources-mediator"
});

Package.onUse(function (api) {
    var both = ['client', 'server'];

    api.use('reactive-var', 'client');

    api.addFiles('mediator.js','client');

    api.export('Mediator');
});