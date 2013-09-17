var request = require('request');

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

    getWeather: function (city,duration,callback) {
        var url = this.apiEntryPoint + this.setCity(city) + this.setDuration(duration) + this.apiArguments;

        var _getResponse = this.getResponse.bind(this);
        _getResponse(url,_getResponse, this.maxAttempts, callback);
    },
    getResponse: function(url, self, attempt, callback) {
        attempt--;

        function createWeatherInfo(url,data) {
            return {url: url, weather:data, timestamp: new Date()};
        }
        if (attempt > 0)
        {
            request.get(url, null, function(err,response, body) {
                if (response.statusCode == 200)
                    callback(createWeatherInfo(url, body));
                else
                    self(url, self, attempt, callback);
            });
        }
        else
            callback(url, this.createWeatherInfo(url,null));
    },

    setCity: function(city) {
        return "?q=" + encodeURIComponent(city);
    },
    setDuration: function(duration) {
        return "&cnt=" + duration;
    }
};

exports.OpenWeatherProvider = OpenWeatherProvider;
exports.Options = Options;