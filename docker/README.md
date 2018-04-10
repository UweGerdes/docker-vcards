# Project vCard Docker Webapp Docker

## tl;dr

Install Docker, build and run - open browser.

## Build baseimage and nodejs docker images

If you have proxy servers or other settings you might want to build the docker images with options.

See my projects [docker-baseimage](https://github.com/UweGerdes/docker-baseimage) and [docker-nodejs](https://github.com/UweGerdes/docker-nodejs).

## Start web app server

```bash
docker-compose up -d
```

Open [http://localhost:3146/](http://localhost:3146/).

## Start dev environment

```bash
docker build -t uwegerdes/vcard-gulp ./gulp/

docker run -it \
	-p 3148:80 \
	--name vcard-gulp \
	uwegerdes/vcard-gulp bash
```

Start `gulp` in the container.

Open [http://localhost:3148/](http://localhost:3148/).
