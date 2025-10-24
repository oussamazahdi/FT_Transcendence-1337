FROM node:20-alpine

WORKDIR /front_app

COPY ./package*.json ./
RUN npm install

COPY . .

CMD [ "npm", "run", "dev" ]