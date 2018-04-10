# Project vCard Docker Webapp Docker

## tl;dr

Install Docker, build and run - open browser.

## Build baseimage and nodejs docker images

If you have proxy servers or other settings you might want to build the docker images with options.

See my projects [docker-baseimage](https://github.com/UweGerdes/docker-baseimage) and [docker-nodejs](https://github.com/UweGerdes/docker-nodejs).

## Start app server

```bash
docker-compose up -d
```

## Start dev environment

```bash
docker build -t uwegerdes/vcard-gulp ./gulp/

docker run -it \
	-p 8083:80 \
	--name vcard-gulp \
	uwegerdes/vcard-gulp bash
```

Start `gulp` in the container.
