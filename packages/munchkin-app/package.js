Package.describe({
    summary: "top-level package for web Munchkin",
    version: "0.0.1",
    name: "vbelolapotkov:munchkin-app"
});

Package.onUse(function (api) {
    var both = ['client', 'server'];

    api.use('meteor-platform', both);
    
    api.addFiles('./views/index.html','client');
    api.addFiles('./views/styles.css','client');
    api.addFiles('namespace.js', both);
});