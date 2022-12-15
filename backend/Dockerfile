FROM golang:latest
# RUN apk update && apk add git && apk add vim && apk --no-cache add make gcc g++ musl-dev binutils autoconf automake libtool pkgconfig check-dev file patch

RUN mkdir /go/src/backend
WORKDIR /go/src/backend
VOLUME /go/src/backend
COPY . .
EXPOSE 8080
# GoApp起動
CMD ["go","run","."]

