FROM node:20

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY tsconfig.json ./
COPY ./src ./src
COPY .env ./
EXPOSE 8080
CMD npm start
