var R = require('ramda');
var Promise = require('bluebird');

var parseRoutes = require('./parseRoutes');
var es = require('../es');

var name = R.compose(
    R.toLower,
    R.head,
    R.split(',')
);

var getId = R.compose(
    R.join('-'),
    R.map(name),
    R.props(['startName', 'endName'])
);

module.exports = {

    save: function(routes) {
        var legs = parseRoutes(routes);

        var saveReqs = legs.map(function(leg) {
            return es.index({
                index: 'route',
                type: 'legs',
                id: getId(leg),
                body: leg
            });
        });

        return Promise.all(saveReqs);
    }

};

