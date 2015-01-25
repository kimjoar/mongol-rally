var test = require('tape');
var parseSms = require('./parseSms');

test('parse simple key/value', function (t) {
    var sms = parseSms('text:kim');
    t.equal(sms.text, 'kim', 'simple key/value');

    var sms2 = parseSms('text : kim');
    t.equal(sms2.text, 'kim', 'trims key and value');

    var sms3 = parseSms('tEXt : kIm');
    t.equal(sms3.text, 'kIm', 'lowercase key, but not value');

    var sms4 = parseSms('text:kim,text2:test');
    t.equal(sms4.text, 'kim', 'simple key/value before comma');
    t.equal(sms4.text2, 'test', 'simple key/value after comma');

    var sms5 = parseSms('text:kim\ntext2:test');
    t.equal(sms5.text, 'kim', 'simple key/value before newline');
    t.equal(sms5.text2, 'test', 'simple key/value after newline');

    var sms6 = parseSms(',text:kim,\n,text2:test\n\n,,');
    t.equal(sms6.text, 'kim', 'crazy message first key/value');
    t.equal(sms6.text2, 'test', 'crazy message second key/value');

    var sms7 = parseSms('lat:59.9295400,lon:10.7602920');
    t.equal(sms7.lat, '59.9295400', 'lat');
    t.equal(sms7.lon, '10.7602920', 'lon');

    var sms8 = parseSms('latitude:59.9295400,longitude:10.7602920');
    t.equal(sms8.lat, '59.9295400', 'normalize latitude to lat');
    t.equal(sms8.lon, '10.7602920', 'normalize longitude to lon');

    var sms8 = parseSms('LatITUde:59.9295400,Long:10.7602920');
    t.equal(sms8.lat, '59.9295400', 'normalize lat/lon when case issues');
    t.equal(sms8.lon, '10.7602920', 'normalize long to lon');

    var sms9 = parseSms('lat:59°55′46″ N,lon:10°45′11″ E');
    t.equal(sms9.lat, '59.9294444444', 'extract dms north');
    t.equal(sms9.lon, '10.7530555556', 'extract dms east');

    t.end();
});

