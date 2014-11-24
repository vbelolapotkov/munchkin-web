Package.describe({
    summary: "munchkin router",
    version: "1.0.0",
    name: "vbelolapotkov:munchkin-router"
});

Package.onUse(function (api) {
    var both = ['client', 'server'];

    api.use('iron:router',both);
    api.use('vbelolapotkov:munchkin-game', both);
    

    api.addFiles('router.js',both);

    api.export('Router');
});