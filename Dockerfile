FROM node:22
WORKDIR /app

COPY package.json package-lock.json* ./

RUN npm install

COPY . .
COPY .env.public .env
RUN npm run build

EXPOSE 3000
ENV NODE_ENV=production

CMD ["node", "build"]
