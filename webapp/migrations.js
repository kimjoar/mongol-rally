var Promise = require("bluebird");

var createMessagesIndex = require('./migrations/createMessagesIndex');
var createRouteIndex = require('./migrations/createRouteIndex');
var fetchRoute = require('./migrations/fetchRoute');

var migrations = [
    createMessagesIndex,
    createRouteIndex,
    fetchRoute
];

module.exports = function() {
    console.log('Running migrations');
    return waterfall(migrations);
};

function waterfall(tasks) {
    return tasks.reduce(function(prevTask, task) {
        return prevTask.then(task);
    }, Promise.resolve());
}

