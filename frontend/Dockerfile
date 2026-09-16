FROM node:22-alpine AS build

WORKDIR /app

COPY package*.json ./
# TLS-инспекция в корпоративной сети подменяет сертификаты — для сборки отключаем strict-ssl
RUN npm config set strict-ssl false \
    && npm config set fetch-retries 5 \
    && npm config set fetch-retry-mintimeout 15000 \
    && npm config set fetch-retry-maxtimeout 120000 \
    && npm ci --no-audit --no-fund

COPY . .
RUN npm run build

FROM nginx:alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
