Package.describe({
    summary: "Munchkin game deck",
    version: "0.0.1",
    name: "vbelolapotkov:munchkin-resources-deck"
});

Package.onUse(function (api) {
    var both = ['client', 'server'];

    api.use('meteor-platform', both);

    

    var cards = ['supplements/cards1.json',
                 'supplements/cards2.json',
                 'supplements/cards3.json',
                 'supplements/cards4.json',
                 'supplements/cards5.json',
                 'supplements/cards7.json',
                 'supplements/cards8.json'];

    api.addFiles(cards, 'server');
    api.addFiles('collections.js',both);
    api.addFiles('methods.js', 'client');
    api.addFiles('server.js', 'server');

    api.export('Deck');
});