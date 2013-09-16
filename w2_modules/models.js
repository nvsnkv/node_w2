const supportedCities = "nnov,msk,spb";

exports.Context = function (params) {
    this.request = {
        city: params.city,
        foresight: params.foresight
    };

    this.redis = {
        client: null
    };

    if (!this.isValid())
        throw new Error("Invalid weather request!");
};

exports.Context.prototype = {
    isValid: function() {
        return (supportedCities.indexOf(this.request.city) >= 0)
                && (this.request.foresight > 0)
                && (this.request.foresight < 8);
    },

    setClient: function(client) {
        this.redis.client = client;
    }
};