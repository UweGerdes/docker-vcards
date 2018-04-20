#
# Dockerfile for webserver
#

FROM uwegerdes/nodejs:8.x

MAINTAINER Uwe Gerdes <entwicklung@uwegerdes.de>

ARG SERVER_HTTP='8080'
ARG LIVERELOAD_PORT='8081'

ENV NODE_ENV development
ENV HOME ${NODE_HOME}
ENV APP_HOME ${NODE_HOME}/app
ENV SERVER_HTTP ${SERVER_HTTP}
ENV LIVERELOAD_PORT ${LIVERELOAD_PORT}

USER root

COPY package.json ${NODE_HOME}/

WORKDIR ${NODE_HOME}

RUN apt-get update && \
	apt-get dist-upgrade -y && \
	apt-get clean && \
	rm -rf /var/lib/apt/lists/* && \
	npm -g config set user ${USER_NAME} && \
	npm install -g \
				gulp \
				npm-check-updates && \
	npm install

COPY . ${APP_HOME}

RUN chown -R ${USER_NAME}:${USER_NAME} ${NODE_HOME}

WORKDIR ${APP_HOME}

USER ${USER_NAME}

VOLUME [ "${APP_HOME}" ]

EXPOSE ${SERVER_HTTP} ${LIVERELOAD_PORT}

CMD [ "npm", "start" ]

