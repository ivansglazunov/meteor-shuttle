Package.describe({
  name: 'ivansglazunov:shuttle',
  version: '0.0.1',
  summary: 'Theory of trees in an atmosphere',
  git: 'https://github.com/ivansglazunov/meteor-shuttle.git',
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.2.1');

  api.use('ecmascript');
  api.use('mongo');
  api.use('accounts-base');

  api.use('templating');
  api.use('meteorhacks:ssr@2.2.0');

  api.use('matb33:collection-hooks@0.8.1');
  api.use('lai:collection-extensions@0.2.1');
  api.use('aldeed:collection2@2.8.0');
  api.use('brettle:accounts-deluxe@0.2.2');
  api.use('easy:search@2.0.8');
  
  api.use('ivansglazunov:refs@0.0.1');
  api.use('ivansglazunov:trees@1.1.3');
  
  api.addFiles([
    'shuttle.js',
    'inserted.js',
    'subjects.js',
    'joining.js',
    'rights.js',
    'unused.js',
    'owning.js',
    'fetching.js'
  ]);

  api.export('Shuttle');
});
