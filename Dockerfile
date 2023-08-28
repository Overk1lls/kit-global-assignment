FROM node:lts-alpine

WORKDIR /usr/src/kit-global-assignment

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

ENV NODE_ENV=production

EXPOSE 8081

CMD [ "node", "dist/main.js" ]