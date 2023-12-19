# pull the base image
FROM node:alpine as base
USER root

FROM base AS builder
USER root
WORKDIR /code
RUN apk add --no-cache python3 py3-pip make g++

COPY package.json package.json
COPY package-lock.json package-lock.json
COPY client/package.json client/package.json
COPY client/package-lock.json client/package-lock.json
COPY server/package.json server/package.json
COPY server/package-lock.json server/package-lock.json
RUN npm install --loglevel warn
RUN npm run install:all --loglevel warn

COPY . /code

RUN rm -rf client/build/*
RUN npm run build
RUN rm -rf server/public/*
RUN mv client/build/* server/public/


FROM base AS production
USER root
LABEL name="Document Extraction Toolkit" \
  vendor="IBM" \
  #version="$IMAGE_VERSION" \
  summary="Web Application UI for Document Extraction Toolkit" \
  description="Create prompts for watsonX and use it to extract information from PDF files"

ENV NODE_ENV production

# Create a non-root user
RUN addgroup -S watson 
RUN adduser -S watson -G watson

RUN npm i -g pm2

# Create app directory
WORKDIR /home/watson

# Copy the built application
COPY --from=builder --chown=app:0 ["/code/server", "/home/watson"]

RUN chmod -R 777 /home/watson

USER watson

ENV HOME="/home/watson"

EXPOSE 7001

CMD ["pm2-runtime", "index.js"]