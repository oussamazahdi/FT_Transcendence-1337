FROM node:20-alpine

RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    sqlite \
    sqlite-dev

WORKDIR /app

COPY package*.json ./

RUN npm install .
RUN npm rebuild better-sqlite3
RUN npm install -g nodemon

COPY . .

EXPOSE 3001

CMD ["npm", "run", "dev"]
