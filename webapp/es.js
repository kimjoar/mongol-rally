var elasticsearch = require('elasticsearch');

var addr = process.env.ELASTICSEARCH_PORT_9200_TCP_ADDR;
var port = process.env.ELASTICSEARCH_PORT_9200_TCP_PORT;

var host = addr + ':' + port;

console.log('Elasticsearch: Connecting to ', host);

var client = new elasticsearch.Client({
  host: host,
  log: 'trace',
  apiVersion: '1.4'
});

module.exports = client;

