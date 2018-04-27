#
# Dockerfile for vCard development
#
# docker build -t uwegerdes/vcard .

FROM uwegerdes/nodejs

MAINTAINER Uwe Gerdes <entwicklung@uwegerdes.de>

ARG SERVER_HTTP='8080'
ARG LIVERELOAD_PORT='8081'

ENV SERVER_HTTP ${SERVER_HTTP}
ENV LIVERELOAD_PORT ${LIVERELOAD_PORT}

USER root

COPY package.json ${NODE_HOME}/

WORKDIR ${NODE_HOME}

RUN apt-get update && \
	apt-get dist-upgrade -y && \
	apt-get install -y \
					graphviz \
					imagemagick && \
	apt-get clean && \
	rm -rf /var/lib/apt/lists/* && \
	npm -g config set user ${USER_NAME} && \
	npm install -g \
				gulp && \
	export NODE_TLS_REJECT_UNAUTHORIZED=0 && \
	npm install

COPY entrypoint.sh /usr/local/bin/
RUN chmod 755 /usr/local/bin/entrypoint.sh
ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]

COPY . ${APP_HOME}

RUN chown -R ${USER_NAME}:${USER_NAME} ${NODE_HOME}

WORKDIR ${APP_HOME}

USER ${USER_NAME}

VOLUME [ "${APP_HOME}" ]

EXPOSE ${SERVER_HTTP} ${LIVERELOAD_PORT}

CMD [ "npm", "start" ]

