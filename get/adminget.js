var express = require('express');
var app = express();
var connection = require('../connectMysql');
const adminQuery = require('../serverjs/queryvars');
const sessionStore = require('../sessionstore');
var error = {};
error.loggedIn;

app.get('/admin/getUsers', function (req, res) {
  if (req.session.username == 'admin') {
    console.log(adminQuery.getUsers);
    connection.query(adminQuery.getUsers, function (error, results) {
      console.log(results);
      return res.send(results);
    });
  } else {
    sessionStore.destroy(req.session.id);
    error.loggedIn = false;
    res.send(error);
  }
});
app.get('/admin/getUnverified', function (req, res) {
  if (req.session.username == 'admin') {
    connection.query(adminQuery.getUnverified, function (error, results) {
      console.log(results);
      return res.send(results);
    });
  } else {
    sessionStore.destroy(req.session.id);
    error.loggedIn = false;
    res.send(error);
  }
});

module.exports = app;
