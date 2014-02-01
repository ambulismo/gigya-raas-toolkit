#!/usr/bin/env node
var optimist = require('optimist'),
  request = require('request'),
  _ = require('underscore');

// Setup command-line arguments
var argv = optimist
  .demand(['fromApiKey', 'fromSecret', 'toApiKey', 'toSecret'])
  .describe('screenSetIDs', 'Comma separated list of the screen-sets to be copied')
  .argv;

// Fetch screenSets
var url = 'https://accounts.gigya.com/accounts.getScreenSets',
  params = {
    APIKey: argv.fromApiKey,
    secret: argv.fromSecret,
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
    return console.error('Error parsing getScreenSets response JSON:', body);
  }

  // Check for error code from Gigya
  if(json.errorCode !== 0) {
    return console.error('Gigya rejected getScreenSets request:', json.errorCode, json.errorDetails ? json.errorDetails : json.errorMessage);
  }

  // Loop through returned screenSets and call setScreenSet for each
  _.each(json.screenSets, function(screenset) {
    var url = 'https://accounts.gigya.com/accounts.setScreenSet',
      params = {
        APIKey: argv.toApiKey,
        secret: argv.toSecret,
        screenSetID: screenset.screenSetID,
        html: screenset.html,
        css: screenset.css,
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
        return console.error('Error parsing setScreenSet response JSON:', body);
      }

      // Check for error code from Gigya
      if(json.errorCode !== 0) {
        return console.error('Gigya rejected setScreenSets request:', json.errorCode, json.errorDetails ? json.errorDetails : json.errorMessage);
      }

      console.log('Screenset copied: ', screenset.screenSetID);
    });
  });
});