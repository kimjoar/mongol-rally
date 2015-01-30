FROM ubuntu:latest

RUN apt-get update
RUN apt-get -y install nodejs-legacy npm

EXPOSE 8000

RUN npm install gulp -g
RUN npm install pm2 -g --unsafe-perm

ADD ./package.json /tmp/package.json
RUN cd /tmp && npm install
RUN mkdir -p /opt/app \
  && cp -a /tmp/node_modules /opt/app/

# Clean everything
RUN apt-get clean && \
  rm -rf /var/lib/apt/lists/* && \
  npm cache clear

WORKDIR /opt/app

ADD . /opt/app

RUN gulp

CMD ["node", "index.js"]

