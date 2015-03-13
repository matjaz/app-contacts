var gulp = require('gulp');
var browserSync = require('browser-sync');
var historyApiFallback = require('connect-history-api-fallback');
var contacts = require('../contacts');
var bodyParser = require('body-parser')

gulp.task('serve', ['build'], function(done) {
  browserSync({
    open: false,
    port: 9000,
    server: {
      baseDir: ['.'],
      middleware: [bodyParser.json(), serveContacts, historyApiFallback, serveCORS]
    }
  }, done);
});

function serveCORS(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  next();
}

function serveContacts(req, res, next) {
  if (req.url.indexOf('/api/contacts') === 0) {
    if (req.method === 'GET') {
      res.setHeader('content-type', 'application/json');
      if (req.url.length > 14) {
        var contact = getContact(req.url.slice(14));
        if (contact) {
          res.end(JSON.stringify(contact));
        } else {
          res.writeHead(404);
          res.end();
        }
      } else {
        res.end(JSON.stringify(contacts));
      }
      return;
    } else if (req.method === 'PUT') {
      var contact = getContact(req.body.id);
      if (contact) {
        for (var p in req.body) {
          contact[p] = req.body[p];
        }
      }
      res.setHeader('content-type', 'application/json');
      res.writeHead(204);
      res.end();
      return;
    }
  }
  next();
}

function getContact(id) {
  return contacts.filter(function(c) {
    return c.id === id;
  })[0];
}
