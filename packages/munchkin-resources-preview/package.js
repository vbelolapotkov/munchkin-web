Package.describe({
    summary: "Card preview package",
    version: "0.0.1",
    name: "vbelolapotkov:munchkin-resources-preview"
});

Package.onUse(function (api) {
    var both = ['client', 'server'];

    api.use('meteor-platform',both);
    api.use('reactive-var','client');
    api.use('vbelolapotkov:munchkin-resources-mediator', 'client');

    api.addFiles('cardPreview.html','client');
    api.addFiles('cardPreview.css','client');
    api.addFiles('cardPreview.js','client');
    api.addFiles('methods.js','client');

    api.export('Preview');
});