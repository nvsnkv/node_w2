var request = require('request');

function OpenWeatherProvider(attempts) {
    if (!isNaN(attempts))
        this.maxAttempts = attempts;
}

OpenWeatherProvider.prototype = {
    apiEntryPoint: "api.openweathermap.org/data/2.5/forecast/daily",
    apiArguments: "&mode=json&units=metric",

    maxAttempts: 5,
    attempts: 5,

    getWeather: function (city,duration,callback) {
        var url = this.apiEntryPoint + this.setCity(city) + this.setDuration(duration) + this.apiArguments;
        this.maxAttempts;

        var _getResponse = this.getResponse.bind(this);
        _getResponse(url,_getResponse, this.maxAttempts, callback);
    },
    getResponse: function(url, self, attempt, callback) {
        attepmt--;
        if (attepmt > 0)
        {
            request(url,(function(err,response, body) {
                if (response.statusCode == 200)
                    callback(this.createWeatherInfo(url, body));
                else
                    self(url, self, attepmt, callback);
            }).bind(this));
        }
        else
            callback(url, this.createWeatherInfo(url,null));
    },

    createWeatherInfo: function(url,data) {
        return {url: url, weather:data, timestamp: new Date()};
    },

    setCity: function(city) {
        return "?q=" + encodeURIComponent(city);
    },
    setDuration: function(duration) {
        return "&cnt=" + duration;
    }
};

exports.OpenWeatherProvider = OpenWeatherProvider;