# Node.js webserver

Run a simple Node.js webserver with Express.JS and Gulp.

## Run gulp docker image

Build and run a container from the image `uwegerdes/webserver-nodejs` and connect to your environment.

```bash
$ docker build -t uwegerdes/webserver-nodejs .
$ docker run -it \
	--name webserver-nodejs-dev \
	-v $(pwd):/home/node/app \
	uwegerdes/webserver-nodejs bash
$ docker start -ai webserver-nodejs-dev
$ docker run -it --rm \
	--name webserver-nodejs \
	-v $(pwd)/htdocs:/home/node/app/htdocs \
	--network="$(docker inspect --format='{{.HostConfig.NetworkMode}}' mongo)" \
	--add-host db:$(docker inspect --format='{{range .NetworkSettings.Networks}}{{.IPAddress}} {{end}}' mongo) \
	uwegerdes/webserver-nodejs
```

Open the webserver ip in your favourite browser.

Stop the container with CTRL-C and exit the container with CTRL-D.

## Changelog

0.0.1 first version Dockerfile, gulpfile.js, server.js, htdocs and others

