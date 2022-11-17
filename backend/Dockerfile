FROM golang:1.18-alpine
RUN apk update && apk add git && apk add vim && apk --no-cache add make gcc g++ musl-dev binutils autoconf automake libtool pkgconfig check-dev file patch
RUN mkdir /go/src/backend
WORKDIR /go/src/backend
COPY . .
VOLUME /go/src/backend
EXPOSE 8080

RUN go mod tidy
# GoApp起動
CMD ["go","run","."]