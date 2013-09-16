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
        var url = apiEntryPoint + setCity(city) + setDuration(duration) + apiArguments;
        attempts = maxAttempts;

        var _getResponse = getResponse.bind(this);
        _getResponse(url,_getResponse,callback);
    },
    getResponse: function(url, self, callback) {
        attepmts--;
        if (attepmts > 0)
        {
            request(url,function(err,response, body) {
                if (response.statusCode == 200)
                    callback(createWeatherInfo(url,body));
                else
                    self(url,self,callback);
            });
        }
        else
            callback(url,createWeatherInfo(url,null));
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


module.exports = function() {
    return new OpenWeatherProvider();
};