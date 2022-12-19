# Project vCard Docker Webapp

## tl;dr

Have a .vcf file ready, `docker-compose up` and open Browser.

## Docker Build

Build the docker image with:

```bash
$ docker build -t uwegerdes/vcards .
```

## Run the Docker container standalone

Run the container with:

```bash
$ docker run -it --rm \
  -v $(pwd)/modules/vcards:/home/node/app/modules/vcards \
  -v $(pwd)/coverage:/home/node/app/coverage \
  -v $(pwd)/docs:/home/node/app/docs \
  -v $(pwd)/fixture:/home/node/app/fixture \
  -v $(pwd)/key:/home/node/app/key \
  -p 51080:8080 \
  -p 51443:8443 \
  -p 51081:8081 \
  -e 'LIVERELOAD_PORT=51081' \
  --name vcards \
  uwegerdes/vcards \
  bash
```
#### e2e-workflow

Start the docker-e2e-workflow test dockers in your project directory (in another terminal to separate the vcards and e2e-workflow test output):

```bash
$ docker-compose -f docker-compose-e2e-workflow.yaml up
```

#### compare-layouts

```bash
$ docker run -it \
	--name vcard-compare-layouts \
	--volume $(pwd)/tests/dev/compare-layouts:/home/node/app/config \
	uwegerdes/compare-layouts bash
```

#### responsive-check

Run a container from the image `uwegerdes/responsive-check` and connect to your environment (with the localhost ports of responsive-check on 5381, gulp livereload on 5382 and a running webserver docker container, the hostname `webserver` is used in test configs).

```bash
$ docker run -it \
	--name responsive-check \
	-v $(pwd)/../docker-responsive-check:/home/node/app \
	-v $(pwd)/modules:/home/node/app/config/modules \
	-p 5381:8080 \
	-p 5382:8081 \
	--network="$(docker inspect --format='{{.HostConfig.NetworkMode}}' vcards-dev)" \
	uwegerdes/responsive-check bash
```
