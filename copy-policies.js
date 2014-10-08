#!/usr/bin/env node
var optimist = require('optimist'),
  defaults = require('./inc/defaults.js');
  _ = require('underscore'),
  Gigya = require('gigya');

// Setup command-line arguments
var argv = optimist
  .demand(['fromApiKey', 'fromSecret', 'toApiKey', 'toSecret'])
  .default(defaults.copyDefaults)
  .argv;

// Initialize Gigya
var sourceGigya = new Gigya(argv.fromApiKey, argv.fromSecret, true),
    destinationGigya = new Gigya(argv.toApiKey, argv.toSecret, true);

sourceGigya.accounts.getPolicies({
}, function(err, response) {
  if(err) {
    return console.error('Error on getPolicies', err);
  }

  var policies = response;
  delete policies.callId;
  delete policies.errorCode;
  delete policies.statusCode;
  delete policies.statusReason;
  destinationGigya.accounts.setPolicies(policies, function(err, response) {
    if(err) {
      return console.error('Error on setPolicies', err);
    }

    console.log('Policies copied', policies);
  });
});