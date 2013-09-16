exports.Controller = function(client) {
    this.setup(client);
};
exports.Controller.prototype = {
    getForecast: function(request,response) {
        with(require('./models.js')) {
            var printer = require('./printer.js');
            try{
                var context = new Context(request.params);
            }
            catch(error)
            {
                printer.printError(error, function(data){response.send(data);});
            }
        }
    },

    setup: function(client) {
        this.client = client;
    }

};
