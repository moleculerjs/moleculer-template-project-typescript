FROM node:22 AS build

WORKDIR /app

COPY package*.json ./

RUN npm ci --legacy-peer-deps

COPY . .

# Build
RUN npm run build

# -------------------
FROM node:22-alpine

WORKDIR /app

ENV NODE_ENV=production

COPY package*.json ./
RUN npm ci --omit=dev --legacy-peer-deps

# Copy built files
COPY --from=build /app/dist ./dist
COPY --from=build /app/public ./public

# Start server
CMD ["node", "node_modules/moleculer/bin/moleculer-runner.js", "--config", "dist/moleculer.config.js"]
