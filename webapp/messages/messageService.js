var R = require('ramda');

var parseSms = require('./parseSms');
var es = require('../es');

var hasLat = R.has('lat');
var hasLon = R.has('lon');
var latLon = R.pick(['lat', 'lon']);

module.exports = {

    // message: id, from, body
    save: function(message) {
        var obj = parseSms(message.body);

        var toSave = {
            sentBy: message.from,
            raw: message.body,
            message: obj.text,
            createdAt: Date.now()
        };

        if (hasLat(obj) && hasLon(obj)) {
            toSave.location = latLon(obj);
        }

        return es.index({
            index: 'messages',
            type: 'messages',
            id: message.id,
            body: toSave
        });
    }

};

