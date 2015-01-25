var Promise = require("bluebird");

var createMessagesIndex = require('./migrations/createMessagesIndex');

module.exports = function() {
    console.log('Running migrations');
    return Promise.all([
        createMessagesIndex()
    ]);
};

