var express = require('express');
var bla = require('./service.js');
const unirest = require('unirest'); //get
var https = require("http"); //post carpo
var logger = require("./logger");

var app = express();

app.get('/', function (req, res) {
  res.send(bla.foo());
});

app.set('port', process.env.PORT || 3000);

app.listen(app.get('port'), function () {
  console.log('Example app listening on port ' + app.get('port'));
});

