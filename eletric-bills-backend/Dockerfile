FROM node

WORKDIR /usr/app

COPY package.json ./

RUN npm install
RUN npm install -g ts-node-dev

COPY . .

EXPOSE 3334

CMD ["npm","run", "dev"]
