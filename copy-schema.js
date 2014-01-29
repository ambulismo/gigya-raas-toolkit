#!/usr/bin/env node
var optimist = require('optimist'),
  request = require('request'),
  _ = require('underscore');

// Setup command-line arguments
var argv = optimist
  .demand(['fromApiKey', 'fromSecret', 'toApiKey', 'toSecret'])
  .argv;

// Fetch screenSets
var url = 'https://accounts.gigya.com/accounts.getSchema',
  params = {
    APIKey: argv.fromApiKey,
    secret: argv.fromSecret,
    filter: 'explicitOnly', // Copy only schema fields that have been explicitly set
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
    return console.error('Error parsing getSchema response JSON:', body);
  }

  // Check for error code from Gigya
  if(json.errorCode !== 0) {
    return console.error('Gigya rejected getSchema request:', json.errorCode, json.errorMessage);
  }

  // Get schema from response and format them to pass to Gigya
  // Sub-objects need to be passed as JSON string
  var schema = {
    profileSchema: JSON.stringify(json.profileSchema),
    dataSchema: JSON.stringify(json.dataSchema)
  };

  // Set policies on destination API key
  var url = 'https://accounts.gigya.com/accounts.setSchema',
    params = _.extend({
      APIKey: argv.toApiKey,
      secret: argv.toSecret,
      format: 'json'
    }, schema); // Add schema to request

  request({ url: url, form: params, method: 'POST' }, function(error, response, body) {
    // If request returned an error, it was because it couldn't get a response from Gigya
    if(error) {
      return console.error('Error reaching Gigya:', error);
    }

    // Attempt to parse JSON
    try {
      var json = JSON.parse(body);
    } catch(exception) {
      return console.error('Error parsing setSchema response JSON:', body);
    }

    // Check for error code from Gigya
    console.log(json);
    if(json.errorCode !== 0) {
      return console.error('Gigya rejected setSchema request:', json.errorCode, json.errorMessage);
    }

    console.log(json);
    console.log('Schema copied: ', schema);
  });
});