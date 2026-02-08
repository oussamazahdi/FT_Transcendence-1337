FROM node:20-bookworm-slim

RUN apt update && apt install sqlite3 -y

WORKDIR /app

COPY package*.json ./
RUN npm i

COPY . .

EXPOSE 3001
CMD ["npm", "run", "start"]
