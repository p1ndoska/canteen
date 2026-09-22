FROM node:22-alpine

WORKDIR /app

# heif-convert — конвертация HEIC-фото в JPEG при загрузке.
# Корпоративная сеть подменяет TLS-сертификаты — качаем репозитории по http
# (подписи пакетов apk проверяет независимо от транспорта).
RUN sed -i 's|https://dl-cdn.alpinelinux.org|http://dl-cdn.alpinelinux.org|g' /etc/apk/repositories \
    && apk add --no-cache libheif-tools

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
