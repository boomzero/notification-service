FROM node:latest

WORKDIR /app

COPY . .

ENV PORT=3003

RUN yarn install

EXPOSE $PORT

ENTRYPOINT ["yarn", "dev"]
