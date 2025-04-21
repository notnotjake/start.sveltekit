FROM node:22
WORKDIR /app

COPY package.json package-lock.json* ./

RUN npm install

COPY . .

RUN mkdir -p db

RUN npx svelte-kit sync

ENV NODE_ENV=production
ENV PUBLIC_NODE_ENV=production
ENV PUBLIC_URL_BASE="bountiful-kindness-production.up.railway.app"
ENV PUBLIC_URL_ASSETS="https://assets.lightdance.design"
ENV PUBLIC_ANALYTICS=FALSE

RUN npm run build

EXPOSE 3000
CMD ["node", "build"]
