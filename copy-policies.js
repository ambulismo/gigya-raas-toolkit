#!/usr/bin/env node
var optimist = require('optimist'),
  request = require('request'),
  _ = require('underscore');

// Setup command-line arguments
var argv = optimist
  .demand(['fromApiKey', 'fromSecret', 'toApiKey', 'toSecret'])
  .argv;

// Fetch screenSets
var url = 'https://accounts.gigya.com/accounts.getPolicies',
  params = {
    APIKey: argv.fromApiKey,
    secret: argv.fromSecret,
    filter: 'explicitOnly', // Copy only policies that have been explicitly set
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
    return console.error('Error parsing getPolicies response JSON:', body);
  }

  // Check for error code from Gigya
  if(json.errorCode !== 0) {
    return console.error('Gigya rejected getPolicies request:', json.errorCode, json.errorDetails ? json.errorDetails : json.errorMessage);
  }

  // Get known policies from response and format them to pass to Gigya
  // Sub-objects need to be passed as JSON string
  var policies = {
    registration: JSON.stringify(json.registration),
    gigyaPlugins: JSON.stringify(json.gigyaPlugins),
    accountOptions: JSON.stringify(json.accountOptions),
    passwordComplexity: JSON.stringify(json.passwordComplexity),
    emailVerification: JSON.stringify(json.emailVerification),
    passwordReset: JSON.stringify(json.passwordReset),
    profilePhoto: JSON.stringify(json.profilePhoto),
    security: JSON.stringify(json.security),
    twoFactorAuth: JSON.stringify(json.twoFactorAuth)
  };

  // Set policies on destination API key
  var url = 'https://accounts.gigya.com/accounts.setPolicies',
    params = _.extend({
      APIKey: argv.toApiKey,
      secret: argv.toSecret,
      format: 'json'
    }, policies); // Add policies to request

  request({ url: url, form: params, method: 'POST' }, function(error, response, body) {
    // If request returned an error, it was because it couldn't get a response from Gigya
    if(error) {
      return console.error('Error reaching Gigya:', error);
    }

    // Attempt to parse JSON
    try {
      var json = JSON.parse(body);
    } catch(exception) {
      return console.error('Error parsing setPolicies response JSON:', body);
    }

    // Check for error code from Gigya
    if(json.errorCode !== 0) {
      return console.error('Gigya rejected setPolicies request:', json.errorCode, json.errorDetails ? json.errorDetails : json.errorMessage);
    }

    console.log('Policies copied: ', policies);
  });
});