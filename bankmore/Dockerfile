FROM node:alpine as build

WORKDIR /app

COPY package.json ./

RUN npm install

COPY . .

RUN npm run build -- --output-path=/app/dist/bankmore

FROM nginx:alpine
RUN rm /etc/nginx/conf.d/default.conf

COPY --from=build /app/dist/bankmore/browser /usr/share/nginx/html
RUN echo "server { listen 80; location / { root /usr/share/nginx/html; index index.html; try_files \$uri \$uri/ /index.html; } }" > /etc/nginx/conf.d/default.conf

EXPOSE 80
