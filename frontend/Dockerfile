FROM node:20-alpine as base

WORKDIR /app
COPY package*.json ./
RUN npm i

FROM base as builder
COPY . .
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
RUN npm run build

FROM builder as production
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/public ./public
CMD ["npm", "start"]