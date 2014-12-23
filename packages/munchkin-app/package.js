Package.describe({
    summary: "top-level package for web Munchkin",
    version: "0.0.1",
    name: "vbelolapotkov:munchkin-app"
});

Package.onUse(function (api) {
    var both = ['client', 'server'];

    api.use('meteor-platform', both);
    api.use('vbelolapotkov:munchkin-accounts');
    api.use('vbelolapotkov:munchkin-lobby');
    api.use('vbelolapotkov:munchkin-resources-game');
    api.use('vbelolapotkov:munchkin-resources-player');


    api.addFiles('namespace.js', both);
    api.addFiles('views/header.html','client');
    api.addFiles('views/footer.html','client');
    api.addFiles('views/layout.html','client');
    api.addFiles('views/index.html','client');
    api.addFiles('views/page_not_found.html', 'client');
    api.addFiles('views/styles.css','client');
    api.addFiles('views/loading.html','client');
    api.addFiles('views/access_denied.html', 'client');
    api.addFiles('static/about.html','client');
    api.addFiles('static/rules.html','client');
    api.addFiles('static/how_to_play.html','client');

    //EXPORT FOR TEST AND DEBUG ONLY
    // api.export('Munchkin', both);

});