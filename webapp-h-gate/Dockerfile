# Stage 1: Build
FROM node:22-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm config set fetch-retry-mintimeout 20000 && \
    npm config set fetch-retry-maxtimeout 120000 && \
    npm config set fetch-timeout 300000 && \
    npm ci

COPY . .
# "docker" usa environment.docker.ts: API su /api tramite il proxy nginx
ARG BUILD_CONFIGURATION=docker
RUN npm run build -- --configuration ${BUILD_CONFIGURATION}

# Stage 2: Serve con Nginx
FROM nginx:1.27-alpine

COPY --from=build /app/dist/webapp-h-gate/browser /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
