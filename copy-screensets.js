#!/usr/bin/env node
var optimist = require('optimist'),
  defaults = require('./inc/defaults.js');
  _ = require('underscore'),
  Gigya = require('gigya');

// Setup command-line arguments
var argv = optimist
  .demand(['fromApiKey', 'fromSecret', 'toApiKey', 'toSecret'])
  .describe('screenSetIDs', 'Comma separated list of the screen-sets to be copied')
  .default(defaults.copyDefaults)
  .argv;

// Initialize Gigya
var sourceGigya = new Gigya(argv.fromApiKey, argv.fromSecret, true),
    destinationGigya = new Gigya(argv.toApiKey, argv.toSecret, true);

sourceGigya.accounts.getScreenSets({
  screenSetIDs: argv.screenSetIDs
}, function(err, response) {
  if(err) {
    return console.error('Error on getScreenSets', err);
  }

  // Loop through returned screenSets and call setScreenSet for each
  console.log('Copying ' + _.size(response.screenSets) + ' screensets...');
  _.each(response.screenSets, function(screenset) {
    destinationGigya.accounts.setScreenSet({
      screenSetID: screenset.screenSetID,
      html: screenset.html,
      css: screenset.css
    }, function(err, response) {
      if(err) {
        return console.error('Error on setScreenSet', err);
      }

      console.log('Screenset copied: ', screenset.screenSetID);
    });
  });
});