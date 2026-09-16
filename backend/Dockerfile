FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
# TLS-инспекция в корпоративной сети подменяет сертификаты — для сборки отключаем strict-ssl
RUN npm config set strict-ssl false \
    && npm config set fetch-retries 5 \
    && npm config set fetch-retry-mintimeout 15000 \
    && npm config set fetch-retry-maxtimeout 120000 \
    && npm ci --omit=dev --no-audit --no-fund

COPY src ./src

EXPOSE 3000

CMD ["node", "src/index.js"]
