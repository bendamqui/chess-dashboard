FROM node:10.16.0-alpine
WORKDIR /usr/src/app
COPY ./api/package*.json ./
RUN npm install
COPY ./api ./
RUN npm install nodemon -g
EXPOSE 3000

