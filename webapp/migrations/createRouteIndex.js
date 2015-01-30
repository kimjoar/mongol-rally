var Promise = require('bluebird');

var es = require('../es');

var mapping = {
    "mappings" : {
        "legs": {
            "properties": {
                "distance": { "type": "long" },
                "duration": { "type": "long" },
                "startName": { "type": "string" },
                "startLocation": { "type": "geo_point" },
                "endName": { "type": "string" },
                "endLocation": { "type": "geo_point" },
                "steps": {
                    "properties": {
                        "startLocation": { "type": "geo_point" },
                        "endLocation": { "type": "geo_point" }
                    }
                }
            }
        }
    }
};

module.exports = function() {
    return es.indices.exists({
        index: 'route'
    }).then(function(exists) {
        if (!exists) {
            return es.indices.create({
                index: 'route',
                body: mapping
            });
        }
    });
};

