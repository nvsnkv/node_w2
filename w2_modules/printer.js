var mu = require('mu2');
function render(template, view, cb) {
    var output = "";
    var stream = mu.compileAndRender(template,view);
    stream.on('data', function(data) {output += data.toString(); });
    stream.on('end', function() {cb(output)});
}

module.exports = {
    printError: function(error, cb) {
        render('./templates/error.html', error, cb);
    }
};