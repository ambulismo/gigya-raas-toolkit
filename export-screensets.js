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
  .describe('filename', 'Filename to save screensets to')
  .describe('screenSetIDs', 'Comma separated list of the screen-sets to be retrieved')
  .default(defaults.exportDefaults)
  .argv;

// Initialize Gigya
var gigya = new Gigya(argv.apiKey, argv.secret, true);

gigya.accounts.getScreenSets({
}, function(err, response) {
  if(err) {
    return console.error('Error on getScreenSets', err);
  }

  if(argv.filename === 'console') {
    // Print to console (deep inspect)
    console.log(util.inspect(response.screenSets, false, null));
  } else {
    // Save as JSON
    var filename = ('' + argv.filename).replace(/\$type/gi, 'screenSets');
    fs.writeFile(filename, JSON.stringify(response.screenSets, null, 4), function(error) {
      if(error) {
        return console.error('Error writing file:', error);
      }

      console.log('ScreenSets written to file:', filename);
    });
  }
});