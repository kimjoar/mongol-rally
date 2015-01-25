var body = require('body/any');
var router = require('routes')();
var Twilio = require('twilio');

var messageService = require('./messages/messageService');

router.addRoute('/', function(req, res, params) {
    res.end('frontpage');
});

router.addRoute('/test/:name', function(req, res, params) {
    console.log('test', params);
    res.end();
});

router.addRoute('/sms', function(req, res, params) {
    body(req, res, function(err, body) {
        var resp = new Twilio.TwimlResponse();
        var respBody = resp.toString();

        res.writeHead(200, {
            'Content-Length': respBody.length,
            'Content-Type': 'application/xml'
        });

        messageService.save({
            id: body.MessageSid,
            from: body.From,
            body: body.Body
        });

        res.end(respBody);
    });
});

module.exports = router;

