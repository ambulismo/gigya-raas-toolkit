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
  .default(defaults.exportDefaults)
  .argv;

// Initialize Gigya
var gigya = new Gigya(argv.apiKey, argv.secret, true);

gigya.accounts.getPolicies({
}, function(err, response) {
  if(err) {
    return console.error('Error on getPolicies', err);
  }

  var policies = response;
  delete policies.callId;
  delete policies.errorCode;
  delete policies.statusCode;
  delete policies.statusReason;

  if(argv.filename === 'console') {
    // Print to console (deep inspect)
    console.log(util.inspect(policies, false, null));
  } else {
    // Save as JSON
    var filename = ('' + argv.filename).replace(/\$type/gi, 'policies');
    fs.writeFile(filename, JSON.stringify(policies, null, 4), function(error) {
      if(error) {
        return console.error('Error writing file:', error);
      }

      console.log('Policies written to file:', filename);
    });
  }
});