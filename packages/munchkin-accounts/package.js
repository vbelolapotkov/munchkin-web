Package.describe({
    summary: "munchkin account management",
    version: "0.0.1",
    name: "vbelolapotkov:munchkin-accounts"
});

Package.onUse(function (api) {
    var both = ['client', 'server'];

    api.use('meteor-platform');
    api.use('accounts-ui');
    api.use('accounts-password');

    api.addFiles('buttons.html','client');
    api.addFiles('config.js','client');
});