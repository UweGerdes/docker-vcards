# Project vCard Docker Webapp

## tl;dr

Have a .vcf file ready, build Dockerfile, run it and open Browser.

## Installation

### Clone the Git repository

## tl;dr

Install Docker, build and run - open browser.

## Build baseimage and nodejs docker images

If you have proxy servers or other settings you might want to build the docker images with options.

See my projects [docker-baseimage](https://github.com/UweGerdes/docker-baseimage) and [docker-nodejs](https://github.com/UweGerdes/docker-nodejs).

```bash
$ docker build -t uwegerdes/baseimage \
	--build-arg APT_PROXY="http://$(hostname -i):3142" \
	--build-arg TZ="Europe/Berlin" \
	--build-arg TERM="${TERM}" \
	https://github.com/UweGerdes/docker-baseimage.git
$ docker build -t uwegerdes/nodejs \
	 -t uwegerdes/nodejs:8.x \
	--build-arg NODE_VERSION="8.x" \
	--build-arg NPM_PROXY="http://$(hostname -i):3143" \
	--build-arg NPM_LOGLEVEL="warn" \
	https://github.com/UweGerdes/docker-nodejs.git
```

## Start web app server

```bash
docker-compose up -d
```

Open [http://localhost:3146/](http://localhost:3146/).

## Start dev environment

```bash
$ docker build -t uwegerdes/vcard-gulp .

$ docker run -it \
	-p 3148:5381 \
	-v $(pwd):/home/node/app \
	--name vcard-gulp \
	uwegerdes/vcard-gulp bash

$ docker run -it \
	-p 3148:5381 \
	-v $(pwd):/home/node/app \
	--network="$(docker inspect --format='{{.HostConfig.NetworkMode}}' vcardserver)" \
	--add-host apphost:$(docker inspect --format='{{range .NetworkSettings.Networks}}{{.IPAddress}} {{end}}' vcardserver) \
	--name vcard-gulp \
	uwegerdes/vcard-gulp bash
```

### Ignition sequence

Start `gulp` in the container.

Open [http://localhost:3148/](http://localhost:3148/).

Stop gulp with CTRL-C. Stop the container with CTRL-D.

## Development

Restart the vcard-gulp container with:

```bash
$ docker start -ai vcard-gulp
```

### HTML / [Pug](https://pugjs.org/)

### Less / CSS

### ES6 / JavaScript

### Iconfont

### Graphviz

### Docker

