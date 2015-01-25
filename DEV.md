Docker
======

Bygg imagene lokalt:

```
docker build -t mongo_web:latest webapp
docker build -t mongo_elasticsearch:latest elasticsearch
```

Kopier images over til DigitalOcean:

```
docker save mongo_web:latest | gzip --best > mongo_web.tar.gz
docker save mongo_elasticsearch:latest | gzip --best > mongo_elasticsearch.tar.gz

scp mongo_web.tar.gz mongo_elasticsearch.tar.gz USER@...

ssh USER@...

gunzip mongo_elasticsearch.tar.gz mongo_web.tar.gz

docker load < mongo_elasticsearch.tar
docker load < mongo_web.tar

rm mongo_elasticsearch.tar mongo_web.tar
```

Start Elasticsearch-container:

```
docker run -d -p 9200:9200 -p 9300:9300 --name mongo_elasticsearch_1 mongo_elasticsearch:latest
```

Start app-container:

```
docker run -d -p 8000:8000 --name mongo_web_1 --link mongo_elasticsearch_1:elasticsearch mongo_web:latest
```

Stop containere:

```
docker stop mongo_elasticsearch_1 mongo_web_1
```

Dersom oppgradering, fjern containere:

```
docker rm mongo_elasticsearch_1 mongo_web_1
```

