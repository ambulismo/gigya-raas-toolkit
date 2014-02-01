#!/usr/bin/env node
var optimist = require('optimist'),
  request = require('request'),
  util = require('util'),
  fs = require('fs');

// Setup command-line arguments
var argv = optimist
  .demand(['apiKey', 'secret'])
  .describe('screenSetIDs', 'Comma separated list of the screen-sets to be retrieved')
  .default('filename', 'console')
  .describe('filename', 'Filename to save screensets to')
  .argv;

// Fetch schema
var url = 'https://accounts.gigya.com/accounts.getScreenSets',
  params = {
    APIKey: argv.apiKey,
    secret: argv.secret,
    screenSetIDs: argv.screenSetIDs,
    format: 'json'
  };
request({ url: url, form: params, method: 'POST' }, function(error, response, body) {
  // If request returned an error, it was because it couldn't get a response from Gigya
  if(error) {
    return console.error('Error reaching Gigya:', error);
  }

  // Attempt to parse JSON
  try {
    var json = JSON.parse(body);
  } catch(exception) {
    return console.error('Error parsing response JSON:', body);
  }

  // Check for error code from Gigya
  if(json.errorCode !== 0) {
    return console.error('Gigya rejected request:', json.errorCode, json.errorDetails ? json.errorDetails : json.errorMessage);
  }

  // Save to file or console output
  var screenSets = json.screenSets;

  if(argv.filename === 'console') {
    // Print to console (deep inspect)
    console.log(util.inspect(screenSets, false, null));
  } else {
    // Save as JSON
    fs.writeFile(argv.filename, JSON.stringify(screenSets, null, 4), function(error) {
      if(error) {
        return console.error('Error writing file:', error);
      }

      console.log('Screensets written to file:', argv.filename);
    });
  }
});