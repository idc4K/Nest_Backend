FROM node:18

WORKDIR /user/src/app

COPY package*.json ./

RUN npm install -g pnpm
RUN pnpm install
COPY . .

RUN pnpm generate
RUN pnpm build

EXPOSE 3001

CMD [ "pnpm", "start:dev" ]