'use strict';

var fs = require('fs');
var path = require('path');

var loadFile = function(name, done) {
  console.log('[INFO] Loading file ', name);
  var data;
  try {
    data = JSON.parse(fs.readFileSync(name));
  } catch(err) {
    if (done) {
      return done(err);
    }
  }
  var item = name.slice(name.lastIndexOf('/') + 1, name.lastIndexOf('.'));
  try {
    var e = require('../../backend/core/esn-config')(item);
    e.store(data, function(err) {
      if (done) {
        return done(err);
      }
    });
  } catch(err) {
    return done(err);
  }
};

var loadDirectory = function(name, done) {
  fs.readdirSync(name).forEach(function (filename) {
    var f = name + '/' + filename;
    var stat = fs.statSync(f);
    if (stat.isFile()) {
      loadFile(f, function(err) {
        if (err) {
          console.log('[ERROR] ' + f + ' has not been loaded (' + err.message + ')');
        } else {
          console.log('[INFO] ' + f + ' has been loaded');
        }
      });
    }
  });
  if (done) {
    done();
  }
};

module.exports = function(done) {
  console.log('[INFO] ESN Configuration');
  loadDirectory(__dirname + '/data', function(err) {
    done(err);
  });
};


