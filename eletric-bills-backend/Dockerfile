FROM node:18 AS builder

WORKDIR /usr/app

COPY package.json ./
COPY package-lock.json ./

RUN npm install

COPY . .

FROM node:18 AS production

WORKDIR /usr/app

COPY --from=builder /usr/app .

RUN npm install --only=production

EXPOSE 5555

CMD ["npm", "run", "start"]
