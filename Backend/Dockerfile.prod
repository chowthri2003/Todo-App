# 1. Build Stage
FROM node:20-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build   # compile TS -> JS

# 2. Production Stage
FROM node:20-alpine

WORKDIR /app
COPY package*.json ./
RUN npm install --omit=dev   # install only prod deps

COPY --from=builder /app/dist ./dist

ENV NODE_ENV=production

EXPOSE 4000

CMD ["node", "dist/index.js"]