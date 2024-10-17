FROM node

WORKDIR /usr/app

COPY package.json ./
COPY tsconfig.json ./

RUN npm install

COPY ./src .

EXPOSE 5555

CMD ["npm","run", "dev"]
