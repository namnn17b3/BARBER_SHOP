FROM node:18-alpine

EXPOSE 8884

EXPOSE 28884

WORKDIR /app

RUN apk add --no-cache tzdata

ENV TZ=Asia/Ho_Chi_Minh

COPY package*.json ./

RUN npm install --force

COPY . .

RUN npm run build

CMD [ "npm", "start" ]
