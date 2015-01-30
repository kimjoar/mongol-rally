var apiKey = process.env.GOOGLE_API_KEY;

var R = require('ramda');
var Promise = require('bluebird');
var request = Promise.promisify(require('request'));

var routeService = require('../route/routeService');

var apiUrl = "https://maps.googleapis.com/maps/api/directions/json";

var locations = [
    "Oslo, Norway",
    "Copenhagen, Denmark",
    "London, UK",
    "Transfăgărășan, Romania",
    "Istanbul, Turkey",
    "Tabriz, Iran",
    "Tehran, Iran",
    "Ashgabat, Turkmenistan",
    "Samarkand, Uzbekistan",
    "Dushanbe, Tajikistan",
    "Khorog, Tajikistan",
    "Osh, Kyrgyzstan",
    "Bishkek, Kyrgyzstan",
    "Almaty, Kazakhstan",
    "Barnaul, Russia",
    "Kosh-Agach, Russia",
    "Ulaanbaatar, Mongolia",
    "Ulan-Ude, Russia"
];

var legs = R.zip(
    R.range(0, locations.length - 1),
    R.range(1, locations.length)
);

module.exports = function() {
    return deleteRoutes().then(fetchAndSaveRoutes);
};

function fetchAndSaveRoutes() {
    var requests = legs.map(function(leg) {
        var start = leg[0];
        var end = leg[1];

        return {
            url: apiUrl,
            json: true,
            qs: {
                origin: locations[start],
                destination: locations[end],
                units: "metric",
                key: apiKey
            }
        };
    });

    return waterfall(requests, function(req) {
        return function() {
            return request(req).then(save);
        }
    })
}

function waterfall(tasks, cb) {
    return tasks.reduce(function(prevTask, task) {
        return prevTask.then(cb(task)).delay(1000);
    }, Promise.resolve());
}

function deleteRoutes() {
    return routeService.deleteAll();
}

function save(result) {
    var body = result[1];
    return routeService.save(body.routes);
}

