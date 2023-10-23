FROM 132112697915.dkr.ecr.eu-central-1.amazonaws.com/node:16.17.1 as builder

COPY . /app

WORKDIR /app

RUN npm install --legacy-peer-deps

RUN npm run build

FROM nginx as production

ENV NODE_ENV production

COPY --from=builder /app/build /usr/share/nginx/admin

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
