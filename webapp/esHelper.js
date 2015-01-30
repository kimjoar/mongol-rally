var Promise = require('bluebird');

var es = require('./es');

module.exports.ping = function() {
    return new Promise(function(resolve, reject) {
        function ping() {
            es.ping({ requestTimeout: 1000 })
                .then(resolve)
                .catch(retry(ping, reject));
        }

        ping();
    });
}

function retry(fn, fail, options) {
    options = options || {};
    var retries = options.retries || 10;
    var retryInterval = options.interval || 1000;

    return function() {
        if (retries == 0) {
            fail();
        }

        setTimeout(function() {
            retries -= 1;
            fn();
        }, retryInterval);
    }
}

module.exports.waitForGreen = function() {
    return es.cluster.health({
        waitForStatus: "green"
    });
};

