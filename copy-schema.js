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

sourceGigya.accounts.getSchema({
  filter: 'explicitOnly'
}, function(err, response) {
  if(err) {
    return console.error('Error on getSchema', err);
  }

  var schema = {
    profileSchema: response.profileSchema,
    dataSchema: response.dataSchema
  };
  destinationGigya.accounts.setSchema(schema, function(err, response) {
    if(err) {
      return console.error('Error on setSchema', err);
    }

    console.log('Schema copied', schema);
  });
});