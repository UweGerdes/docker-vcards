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

## Start dev environment

```bash
$ docker build -t uwegerdes/vcard .

$ docker run -it \
	--name vcard-dev \
	--volume $(pwd):/home/node/app \
	uwegerdes/vcard bash
```

### Ignition sequence

Use docker-compose or have a running mongo docker and build/run with the following command:

Start `gulp` in the container.

Open [http://localhost:5381/](http://localhost:5381/).

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

#### Testing environment

Start testing environment from another terminal

```bash
docker-compose up -d
```

#### compare-layouts

```bash
$ docker run -it \
	--name vcard-compare-layouts \
	--volume $(pwd)/tests/dev/compare-layouts:/home/node/app/config \
	uwegerdes/compare-layouts bash
```

#### responsive-check

```bash
$ docker run -it \
	--name responsive-check-vcard \
	---volume $(pwd)/tests/dev/responsive-check:/home/node/app/config \
	--network="$(docker inspect --format='{{.HostConfig.NetworkMode}}' vcard-webserver)" \
	--add-host webserver:$(docker inspect --format='{{range .NetworkSettings.Networks}}{{.IPAddress}} {{end}}' vcard-webserver) \
	uwegerdes/responsive-check
```


