FROM node:20-alpine

WORKDIR /front_app

COPY ./srcs/package*.json ./
RUN npm install

COPY ./srcs .

CMD [ "npm", "run", "dev" ]