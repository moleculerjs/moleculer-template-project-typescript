FROM node:8-alpine

RUN mkdir /app
WORKDIR /app

COPY . .

RUN npm install
RUN npm run build
RUN npm prune --production

ENV NODE_ENV=production
CMD ["npm", "start"]