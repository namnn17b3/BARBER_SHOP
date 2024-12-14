FROM node:18-alpine

EXPOSE 3300

WORKDIR /app

RUN apk add --no-cache tzdata

ENV TZ=Asia/Ho_Chi_Minh

COPY package*.json ./

RUN npm install --force

COPY . .

# RUN npx next telemetry disable

# RUN npm run build

CMD [ "npm", "run", "dev" ]
