FROM ubuntu:latest

RUN apt-get update && \
    apt-get install -y gcc python3

WORKDIR /code
