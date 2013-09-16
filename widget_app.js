var argv = require('optimist')
    .usage('--port {application port}, --redis_port {db port}')
    .demand(['port', 'redis_port'])
    .argv;

var config = {
    server: {
        port: argv.port
    },
    redis: {
        port: argv.redis_port
    }
};

var redis = require('redis');
var express = require('express');
var listener = express();

var controllerLib = require('./w2_modules/controller.js');
var controller = new controllerLib.Controller(redis.createClient(config.redis.port));

listener.get('/w2/:city/:foresight', controller.getForecast);
listener.get('/', function(req, res){ res.send("w2 host."); });

listener.listen(config.server.port);