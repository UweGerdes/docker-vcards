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

There are many warning from `npm install` - ignore them and wait a bit. Open the ip of the server in your browser.

Use CTRL-C to stop the container. Restart it with `docker-compose up`.

To remove the container use `docker-compose down`.

To rebuild the image you may now `docker rmi uwegerdes/vcard` and then `docker-compose up`.

## Development

In the directory `modules` you should create subdirectories for your modules.

Reuse parts of other modules or make modules out of often used parts.

Each module contains everything for itself - views (templates, styles, scripts, assets), server (controller, model), tests and other files.

Perhaps you might want to restart the development container if something goes really wrong. Mostly the parts will trigger the needed restart but there have been cases...

### Templates: HTML / EJS / [Pug](https://pugjs.org/)

You may combine different template languages.

### Less / CSS

The project provides global styles so you should only add styles to your module that are specific for your module.

### ES6 / JavaScript

Will be copied to `htdocs/js/[module]/`.

### Iconfont

### Graphviz

### More Docker

#### compare-layouts

```bash
$ docker run -it \
	--name vcard-compare-layouts \
	--volume $(pwd)/tests/dev/compare-layouts:/home/node/app/config \
	uwegerdes/compare-layouts bash
```
