FROM node:18 AS build
WORKDIR /app
COPY package.json ./
RUN npm install
COPY . .

ARG VITE_SERVER_URL
ARG VITE_WEBSITE_DOMAIN

ENV VITE_SERVER_URL=$VITE_SERVER_URL
ENV VITE_WEBSITE_DOMAIN=$VITE_WEBSITE_DOMAIN

RUN npm run build

FROM node:18
WORKDIR /app
COPY --from=build /app/dist /app
CMD ["npx", "http-server", "/app", "-p", "8080", "--fallback", "index.html"]