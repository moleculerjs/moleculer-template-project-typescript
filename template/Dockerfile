FROM node:22 as build

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

# Copy source
COPY . .

# Copy built files
COPY --from=build /app/dist .

# Build and cleanup
ENV NODE_ENV=production
RUN npm ci --omit=dev --legacy-peer-deps

# Start server
CMD ["node", "node_modules/moleculer/bin/moleculer-runner.js"]
