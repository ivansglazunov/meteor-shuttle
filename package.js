Package.describe({
  name: 'ivansglazunov:shuttle',
  version: '0.1.1',
  summary: 'The shuttle leaves the atmosphere.',
  git: 'https://github.com/ivansglazunov/meteor-shuttle.git',
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.2.1');

  api.use('ecmascript');
  api.use('mongo');
  api.use('accounts-base');
  api.use('templating');
  
  api.use('brettle:accounts-deluxe@0.2.2');
  api.use('stevezhu:lodash@4.3.0');
  
  api.use('ivansglazunov:templater@0.0.0');
  api.use('ivansglazunov:history@0.0.2');
  api.use('ivansglazunov:shuttle-rights@0.0.6');
  api.use('ivansglazunov:shuttle-fetching@0.0.6');
  api.use('ivansglazunov:shuttle-posts@0.0.1');
  
  api.addFiles([
    'shuttle.js'
  ]);
  
  api.export('Shuttle');
});
