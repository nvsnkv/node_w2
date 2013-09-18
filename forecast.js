var request = require('request');

function createWeatherInfo(url, data) {
    return {url: url, weather: data, timestamp: new Date()};
}

String.prototype.hashCode = function(){
    if (this._hashCode === undefined) {
        var hash = 0;
        if (this.length == 0) return hash;
        for (i = 0; i < this.length; i++) {
            var char = this.charCodeAt(i);
            hash = ((hash<<5)-hash)+char;
            hash = hash & hash; // Convert to 32bit integer
        }
        this._hashCode = hash;
    }
    return this._hashCode;
};


function Options(params) {
    const cities = {
        "nnov": "Nizhni Novgorod",
        "msk": "Moscow",
        "spb": "St. Petersburg"
    };

    this.city = cities[params.city];
    this.duration = params.duration;
}


function OpenWeatherProvider(attempts) {
    if (!isNaN(attempts))
        this.maxAttempts = attempts;
}

OpenWeatherProvider.prototype = {
    apiEntryPoint: "http://api.openweathermap.org/data/2.5/forecast/daily",
    apiArguments: "&mode=json&units=metric",

    maxAttempts: 5,
    attempts: 5,

    getWeather: function (city, duration, callback) {
        var url = this.getUrl(city, duration);

        var _getResponse = this.getResponse;
        _getResponse(url, _getResponse, this.maxAttempts, callback);
    },
    getResponse: function (url, self, attempt, callback) {
        attempt--;

        if (attempt > 0) {
            request.get(url, null, function (err, response, body) {
                if (response.statusCode == 200)
                    callback(createWeatherInfo(url, body));
                else
                    self(url, self, attempt, callback);
            });
        }
        else
            callback(url, this.createWeatherInfo(url, null));
    },

    getUrl: function (city, duration) {
        return this.apiEntryPoint + this.setCity(city) + this.setDuration(duration) + this.apiArguments;
    },
    setCity: function (city) {
        return "?q=" + encodeURIComponent(city);
    },
    setDuration: function (duration) {
        return "&cnt=" + duration;
    }
};

function CachedWeatherProvider(client, cachingTime) {
    this.client = client;
    this.cachingTime = cachingTime;
}

CachedWeatherProvider.prototype = OpenWeatherProvider.prototype;
CachedWeatherProvider.prototype.getCachedWeather = function (city, duration, callback) {
    var self = this;

    var url = self.getUrl(city, duration);
    var cachingTime = self.cachingTime;

    function updateValue(callback) {
        self.getWeather(city, duration, function(weather){
            var result = weather;
            self.client.set(url.hashCode(), JSON.stringify(result), function (err, reply) {
                callback(result);
            })
        });
    }

    function checkFreshness(data, callback) {
        var result = JSON.parse(data);
        var date = new Date();

        if ((date - Date.parse(result.timestamp)) < cachingTime)
            callback(result);
        else
            updateValue(callback);

    }

    self.client.exists(url.hashCode(), function (err, reply) {
        if (reply)
            self.client.get(url.hashCode(), function(err, data){
                checkFreshness(data, callback);
            });
        else
            updateValue(callback);

    });
};

exports.OpenWeatherProvider = OpenWeatherProvider;
exports.CachedWeatherProvider = CachedWeatherProvider;
exports.Options = Options;