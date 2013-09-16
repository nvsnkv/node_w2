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

listener.get('/', function(req, res){ res.send("w2 host."); });

listener.listen(config.server.port);