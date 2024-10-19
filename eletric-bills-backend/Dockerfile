FROM node:18

WORKDIR /usr/app

COPY package.json pnpm-lock.yaml ./

RUN npm install -g pnpm && pnpm install

COPY . .

EXPOSE 5555

CMD ["pnpm", "run", "dev"]
