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
  .describe('filename', 'Filename to save policies to')
  .default(defaults.importDefaults)
  .argv;

// Initialize Gigya
var gigya = new Gigya(argv.apiKey, argv.secret, true);

// Read screenSets from file
try {
  var filename = ('' + argv.filename).replace(/\$type/gi, 'screenSets'),
      screenSets = JSON.parse(fs.readFileSync(filename));
} catch(e) {
  return console.log('Could not parse screenSets file JSON', filename);
}

// Loop through returned screenSets and call setScreenSet for each
console.log('Importing ' + _.size(screenSets) + ' screensets...');
_.each(screenSets, function(screenset) {
  gigya.accounts.setScreenSet({
    screenSetID: screenset.screenSetID,
    html: screenset.html,
    css: screenset.css
  }, function(err, response) {
    if(err) {
      return console.error('Error on setScreenSet', err);
    }

    console.log('Screenset imported: ', screenset.screenSetID);
  });
});