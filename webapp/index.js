var http = require('http');
var ecstatic = require('ecstatic')(__dirname + '/static');

var esHelper = require('./esHelper');
var routes = require('./routes');
var runMigrations = require('./migrations');

var port = process.env.PORT || 8000;

var server = http.createServer(function (req, res) {
    var m = routes.match(req.url);
    if (m) m.fn(req, res, m.params);
    else ecstatic(req, res)
});

esHelper.ping()
    .then(esHelper.waitForGreen)
    .then(runMigrations)
    .then(function() {
        server.listen(port, function() {
            console.log('Server listening at port ' + port);
        });
    })
    .catch(function() {
        console.log('ERROR', arguments);
    });

