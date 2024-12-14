FROM node:18-alpine

EXPOSE 8881

EXPOSE 28881

WORKDIR /app

RUN apk add --no-cache tzdata

ENV TZ=Asia/Ho_Chi_Minh

COPY package*.json ./

RUN npm install --force

COPY . .

RUN npm run build

CMD [ "npm", "start" ]
