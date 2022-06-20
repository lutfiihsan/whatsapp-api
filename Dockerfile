FROM node:14.19-slim

WORKDIR /app
COPY package.json ./

RUN npm install
RUN npm i -g nodemon

COPY . .

EXPOSE 3000
CMD ["nodemon","app.js"]
