var R = require('ramda');
var Promise = require('bluebird');
var removeDiacritics = require('diacritics').remove;

var parseRoutes = require('./parseRoutes');
var es = require('../es');

var normalize = R.compose(
    removeDiacritics,
    R.toLower,
    R.head,
    R.split(',')
);

var legId = R.compose(
    R.join('-'),
    R.map(normalize),
    R.props(['startName', 'endName'])
);

module.exports = {

    save: function(routes) {
        var legs = parseRoutes(routes);

        var saveReqs = legs.map(function(leg) {
            return es.index({
                index: 'route',
                type: 'legs',
                id: legId(leg),
                body: leg
            });
        });

        return Promise.all(saveReqs);
    },

    deleteAll: function() {
        return es.deleteByQuery({
            index: 'route',
            type: 'legs',
            body: {
                query: {
                    match_all: {}
                }
            }
        });
    },

    fetch: function() {
        return es.search({
            index: 'route',
            type: 'legs',
            body: {
                size: 100000
            }
        }).then(function(response) {
            return response.hits.hits.map(function(hit) {
                return hit._source;
            });
        });
    }

};

