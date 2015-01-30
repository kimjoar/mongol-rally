module.exports = function(routes) {
    return parseRoute(routes[0]);
};

function parseRoute(route) {
    return route.legs.map(parseLeg)
}

function parseLeg(leg) {
    return {
        distance: leg.distance.value,
        duration: leg.duration.value,
        startName: leg.start_address,
        startLocation: latLon(leg.start_location),
        endName: leg.end_address,
        endLocation: latLon(leg.end_location),
        steps: leg.steps.map(parseStep)
    }
}

function parseStep(step) {
    return {
        startLocation: latLon(step.start_location),
        endLocation: latLon(step.end_location)
    }
}

function latLon(obj) {
    return {
        lat: obj.lat,
        lon: obj.lng
    }
}
