var R = require('ramda');

var normalizations = {
    'latitude': 'lat',
    'longitude': 'lon',
    'long': 'lon'
};

var normalize = function(str) {
    return normalizations[str] || str;
};

var normalizeKey = R.compose(
    normalize,
    R.toLowerCase,
    R.head
);

var normalizeData = function(arr) {
    return R.prepend(
        normalizeKey(arr),
        R.tail(arr)
    );
};

var parseOne = R.compose(
    normalizeData,
    R.map(R.trim),
    R.split(':')
);

var parseAll = R.compose(
    R.fromPairs,
    R.map(parseOne),
    R.split(/,|\n/)
);

var isDms = R.compose(
    R.lt(-1),
    R.strIndexOf('°')
);

var dmsRegex = /^([+-]?)(\d{1,3})°?\s*(\d{1,2})′?\s*(\d{1,2})″?\s*([NSEØWV])$/

function dmsToLatLon(str) {
    var res = str.match(dmsRegex);

    var d = res[2];
    var m = res[3];
    var s = res[4];
    var sign = res[5];
    var degrees = Math.round(d) + m / 60 + s / 3600;

    return degrees * multiplier(sign);
}

function multiplier(s) {
    if (s == null || s === 'N' || s === 'E' || s === 'Ø') {
        return +1;
    }

    return -1;
}

function normalizeLatLon(str) {
    if (isDms(str)) {
        return dmsToLatLon(str).toFixed(10).toString();
    } else {
        return str;
    }
}

module.exports = function(text) {
    var obj = parseAll(text);

    if (obj.lat) {
        obj.lat = normalizeLatLon(obj.lat);
    }
    if (obj.lon) {
        obj.lon = normalizeLatLon(obj.lon);
    }

    return obj;
};

