# Stage 1: Build
FROM node:19-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm config set fetch-retry-mintimeout 20000 && \
    npm config set fetch-retry-maxtimeout 120000 && \
    npm config set fetch-timeout 300000 && \
    npm ci

COPY . .
RUN npm run build -- --configuration production

# Stage 2: Serve con Nginx
FROM nginx:alpine

COPY --from=build /app/dist/webapp-h-gate/browser /usr/share/nginx/html

# Configurazione nginx per Angular (gestisce il routing lato client)
RUN echo 'server { \
    listen 80; \
    root /usr/share/nginx/html; \
    index index.html; \
    location / { \
        try_files $uri $uri/ /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]