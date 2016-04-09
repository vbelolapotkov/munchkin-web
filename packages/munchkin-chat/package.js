Package.describe({
  name: 'vbelolapotkov:munchkin-chat',
  summary: ' chatting package ',
  version: '1.0.0'
});

Package.onUse(function(api) {
  api.versionsFrom('1.0.1');
  api.addFiles('munchkin-chat.js');
});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use('vbelolapotkov:munchkin-chat');
  api.addFiles('vbelolapotkov:munchkin-chat-tests.js');
});
