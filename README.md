# Project vCard Docker Webapp

## tl;dr

Have a .vcf file ready, `docker-compose up` and open Browser.

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
$ docker-compose up
```

## Development

In the directory `modules` you should create subdirectories for your modules.

Reuse parts of other modules or make modules from often used parts.

Each module contains everything for itself - views (templates, styles, scripts, assets), controller, model and tests

At the moment you must include some paths in configuration.yaml to activate gulp watch and other tasks for your module

If you add files to your module please restart the development container - otherwise gulp will not watch your file.

### Templates: HTML / EJS / [Pug](https://pugjs.org/)

You may combine different template languages.

### Less / CSS

The project provides global styles so you should only add styles to your module that are specific for your module.

### ES6 / JavaScript

### Iconfont

### Graphviz

### Docker

Start environment:

```bash
docker-compose up
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


