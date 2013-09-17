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
var forecast = require('./forecast.js');

var client = redis.createClient(config.redis.port);
var listener = express();

listener.get('/w2/:city/:length', function(req, res){
    var fc = new forecast.OpenWeatherProvider();
    fc.getWeather("Moscow",1,function(data){ res.send(JSON.stringify(data)); });
});

listener.listen(config.server.port);