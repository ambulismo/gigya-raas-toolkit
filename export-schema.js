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
  .describe('filename', 'Filename to save schema to')
  .default(defaults.exportDefaults)
  .argv;

// Initialize Gigya
var gigya = new Gigya(argv.apiKey, argv.secret, true);

gigya.accounts.getSchema({
}, function(err, response) {
  if(err) {
    return console.error('Error on getSchema', err);
  }

  var schema = {
    profileSchema: response.profileSchema,
    dataSchema: response.dataSchema
  };

  // Profile schema has a bunch of things that are read-only
  // We don't save these to the file because they never change
  delete schema.profileSchema.unique;
  delete schema.profileSchema.dynamicSchema;
  _.each(schema.profileSchema.fields, function(field, key) {
    delete field.arrayOp;
    delete field.allowNull;
    delete field.type;
    delete field.encrypt;
    delete field.format;
  });

  if(schema.dataSchema.unique && _.isArray(schema.dataSchema.unique) && schema.dataSchema.unique.length === 0) {
    delete schema.dataSchema.unique;
  }

  if(argv.filename === 'console') {
    // Print to console (deep inspect)
    console.log(util.inspect(schema, false, null));
  } else {
    // Save as JSON
    var filename = ('' + argv.filename).replace(/\$type/gi, 'schema');
    fs.writeFile(filename, JSON.stringify(schema, null, 4), function(error) {
      if(error) {
        return console.error('Error writing file:', error);
      }

      console.log('Schema written to file:', filename);
    });
  }
});