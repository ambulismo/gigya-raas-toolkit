#!/usr/bin/env node
var optimist = require('optimist'),
  defaults = require('./inc/defaults.js');
  _ = require('underscore'),
  Gigya = require('gigya'),
  util = require('util'),
  fs = require('fs');

// Setup command-line arguments
var argv = optimist
  .demand(['apiKey', 'secret'])
  .default('filename', 'console')
  .describe('filename', 'Filename to load schema from')
  .default(defaults.importDefaults)
  .argv;

// Initialize Gigya
var gigya = new Gigya(argv.apiKey, argv.secret, true);

// Read policies from file
try {
  var filename = ('' + argv.filename).replace(/\$type/gi, 'schema'),
      schema = JSON.parse(fs.readFileSync(filename));
} catch(e) {
  return console.log('Could not parse schema file JSON', filename);
}

// Set policies
gigya.accounts.setSchema(schema, function(err, response) {
  if(err) {
    return console.error('Error on setSchema', err);
  }

  console.log('Schema imported from file: ', filename);
});