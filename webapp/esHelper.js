var Promise = require('bluebird');

var es = require('./es');

module.exports.ping = function() {
    var retries = 10;
    var retryInterval = 1000;

    return new Promise(function(resolve, reject) {
        function ping() {
            es.ping({
                requestTimeout: 1000,
            }).then(resolve,
                function() {
                    if (retries == 0) {
                        reject();
                    }

                    setTimeout(function() {
                        retries -= 1;
                        ping();
                    }, retryInterval);
                }
            );
        }

        ping();
    });
}

module.exports.waitForGreen = function() {
    return es.cluster.health({
        waitForStatus: "green"
    });
};

