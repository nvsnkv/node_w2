var mu = require('mu2');

function Printer() {
}
Printer.prototype = {
    printError: function (error, cb) {
        this.print('./templates/error.html', error, cb);
    },

    printWeather: function(weather, cb) {
        this.print('./templates/widget_iframe.html',weather,cb);
    },

    print: function (template, view, cb) {
        var output = "";
        var stream = mu.compileAndRender(template, view);
        stream.on('data', function (data) {
            output += data.toString();
        });
        stream.on('end', function () {
            cb(output);
        });
    }
};

exports.Printer = Printer;