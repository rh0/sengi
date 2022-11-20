FROM node:alpine AS build

WORKDIR /build
ADD . /build

RUN apk add --no-cache python make g++ \
    && npm install \

FROM alpine:latest

RUN apk add --update --no-cache lighttpd

ADD lighttpd.conf /etc/lighttpd/lighttpd.conf
COPY --from=build /build/dist /app
COPY --from=build /build/assets/docker_init /app/start

EXPOSE 80

ENTRYPOINT ["lighttpd", "-D"]
CMD ["-f", "/etc/lighttpd/lighttpd.conf"]
