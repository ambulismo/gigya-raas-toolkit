#!/usr/bin/env node
var optimist = require('optimist'),
    request = require('request'),
    util = require('util'),
    fs = require('fs');

// Setup command-line arguments
var argv = optimist
  .demand(['apiKey', 'secret'])
  .default('filter', 'full')
  .describe('filter', 'Specifies what parts of the schema to return')
  .default('filename', 'console')
  .describe('filename', 'Filename to save schema to')
  .argv;

// Fetch schema
var url = 'https://accounts.gigya.com/accounts.getSchema',
    params = {
      APIKey: argv.apiKey,
      secret: argv.secret,
      filter: argv.filter,
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
    return console.error('Gigya rejected request:', json.errorCode, json.errorMessage);
  }

  // Save to file or console output
  var schema = {
    profileSchema: json.profileSchema,
    dataSchema: json.dataSchema
  };

  if(argv.filename === 'console') {
    // Print to console (deep inspect)
    console.log(util.inspect(schema, false, null));
  } else {
    // Save as JSON
    fs.writeFile(argv.filename, JSON.stringify(schema, null, 4), function(error) {
      if(error) {
        return console.error('Error writing file:', error);
      }

      console.log('Schema written to file:', argv.filename);
    });
  }
});