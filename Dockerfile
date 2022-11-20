FROM node:10-alpine AS build

WORKDIR /build
ADD . /build

RUN apk add --no-cache --virtual .gyp python3 make g++ \
    && npm install \
    && apk del .gyp

FROM alpine:latest

RUN apk add --update --no-cache lighttpd

ADD lighttpd.conf /etc/lighttpd/lighttpd.conf
COPY --from=build /build/dist /app
COPY --from=build /build/assets/docker_init /app/start

EXPOSE 80

ENTRYPOINT ["lighttpd", "-D"]
CMD ["-f", "/etc/lighttpd/lighttpd.conf"]
