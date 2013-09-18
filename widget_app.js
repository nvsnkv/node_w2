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
var printFactory = require('./printer.js');

var client = redis.createClient(config.redis.port);
var listener = express();

listener.get('/w2/:city/:duration', function (req, res) {
    var options = new forecast.Options(req.params);

    const oneDay = 86400000;
    var fc = new forecast.CachedWeatherProvider(client, oneDay);
    fc.getCachedWeather(options.city, options.duration, function (data) {
        var printer = new printFactory.Printer();
        printer.printWeather(data.weather, function(output) {
            res.send(output);
        });
    });
});

listener.listen(config.server.port);