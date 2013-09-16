var argv = require('optimist')
    .usage('-port {application port}')
    .demand(['port'])
    .argv;

var config = {
    server: {
        port: argv.port
    }
};

var express = require('express');
var listener = express();

var controller = require('./w2_modules/controller.js');

listener.get('/w2/:city/:foresight', controller.getForecast);
listener.get('/', function(req, res){ res.send("w2 host."); });

listener.listen(config.server.port);