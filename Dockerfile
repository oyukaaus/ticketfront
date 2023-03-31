FROM node:16.14.0 AS build-step



WORKDIR /build

COPY package* ./

RUN npm install --legacy-peer-deps

COPY . .

RUN npm run build

FROM nginx:alpine
# Set working directory to nginx asset directory
WORKDIR /usr/share/nginx/html
# Remove default nginx static assets
RUN rm -rf ./*
# Copy static assets from builder stage
COPY  --from=build-step /build/build/ ./build
COPY  nginx.conf /etc/nginx/conf.d/default.conf

# Containers run nginx with global directives and daemon off
ENTRYPOINT ["nginx", "-g", "daemon off;"]