FROM node:lts-alpine

# Working directory
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm ci --silent

# Copy source
COPY . .

# Build and cleanup
ENV NODE_ENV=production
RUN npm run build \
 && npm prune

# Start server
CMD ["npm", "start"]
