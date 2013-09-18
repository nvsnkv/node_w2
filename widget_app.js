var argv = require('optimist')
    .usage('--port {application port}, --redis_port {db port} --cache_ttl {milliseconds}')
    .demand(['port', 'redis_port', 'cache_ttl'])
    .argv;

var config = {
    server: {
        port: argv.port
    },
    redis: {
        port: argv.redis_port
    },

    cache: {
        ttl: argv.cache_ttl
    }
};

var fs = require('fs');
var redis = require('redis');
var express = require('express');
var forecast = require('./forecast.js');
var printFactory = require('./printer.js');

var client = redis.createClient(config.redis.port);
var listener = express();

listener.get('/w2/:city/:duration', function (req, res) {
    var options = new forecast.Options(req.params);

    var fc = new forecast.CachedWeatherProvider(client, config.cache.ttl);
    fc.getCachedWeather(options.city, options.duration, function (data) {
        var printer = new printFactory.Printer();
        printer.printWeather(data.weather, function(output) {
            res.send(output);
        });
    });
});

listener.get('/w2/:city/:duration/vertical', function (req, res) {
    var options = new forecast.Options(req.params);

    var fc = new forecast.CachedWeatherProvider(client, config.cache.ttl);
    fc.getCachedWeather(options.city, options.duration, function (data) {
        var printer = new printFactory.Printer();
        printer.printWeatherVertical(data.weather, function(output) {
            res.send(output);
        });
    });
});

listener.get("/w2/style.css", function(req, res){
    res.send(fs.readFileSync('./css/style.css'));
})

listener.listen(config.server.port);