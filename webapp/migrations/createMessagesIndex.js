var Promise = require('bluebird');

var es = require('../es');

var mapping = {
    "mappings" : {
        "messages": {
            "properties": {
                "location": {
                    "type": "geo_point"
                },
                "message": {
                    "type": "string"
                },
                "raw": {
                    "type": "string"
                },
                "sentBy": {
                    "type": "string"
                },
                "createdAt": {
                    "type": "date",
                    "format": "date_time"
                }
            }
        }
    }
};

module.exports = function() {
    return es.indices.exists({
        index: 'messages'
    }).then(function(exists) {
        if (!exists) {
            return es.indices.create({
                index: 'messages',
                body: mapping
            });
        }
    });
};

