var express = require('express');
var app = express();
var connection = require('../connectMysql');
require('../sessionstore');
const SessionCheck = require('../serverjs/session');
var sessionCheck = new SessionCheck();
var bcrypt = require('bcrypt');
const sessionStore = require('../sessionstore');

// POST login authentication
app.post('/authpost', function (req, res) {
  var username = req.body.username;
  // Setting user input to variables
  var password = req.body.password;
  // Verifying both fields are filled
  var success = false;
  var validated = false;
  if (username && password) {
    // Make database query for checking login information
    connection.query('SELECT password, validated FROM accounts WHERE username = ?', [username], async function (error, results) {
      // user exists
      if (results.length > 0) {
        results[0].validated;
        var hash = results[0].password;
        var hashing = new Promise(function (resolve, reject) {
          bcrypt.compare(password, hash, function (err, res) {
            if (res) {
              console.log('Password correct!');
              success = true;
              resolve(success);
            } else {
              console.log('Incorrect password.');
              success = false;
              reject(success);
            }
          });
        });
        hashing
          .then(function (resolve) {
            console.log(resolve);
            sessionCheck.checkForSession(req.body.username, req.session.id);
            console.log(username);
            if (username == 'admin') {
              req.session.loggedin = true;
              req.session.username = username;
              console.log(req.session.username);
              res.redirect('/admin');
            } else {
              var validation = new Promise(function (resolve, reject) {
                connection.query('SELECT validated FROM accounts WHERE username = ? AND validated = 1', [username], function (error, results) {
                  if (results.length > 0) {
                    validated = true;
                    resolve(validated);
                  } else {
                    validated = false;
                    reject(validated);
                  }
                });
              });
              validation
                .then(function (resolve) {
                  req.session.loggedin = true;
                  req.session.username = username;
                  console.log(resolve);
                  console.log('Validated user.');
                  res.redirect('/app/' + req.session.username);
                })
                .catch(async function (reject) {
                  console.log(reject);
                  console.log('User not validated.');
                  res.redirect('/login');
                });
            }
          })
          .catch(function (reject) {
            console.log(reject);
            res.redirect('/login');
          });
        if (success) {
          // do success
        } else {
          // do fail
        }
      }
    });
  } else {
    // If both fields are not filled - Do this
    // Temporary incorrect input return
    res.send('Please enter Username and Password!');
    res.end();
  }
});

module.exports = app;
