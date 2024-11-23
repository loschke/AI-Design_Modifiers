# Build stage
FROM node:18-alpine as build

WORKDIR /app

# Install dependencies first (better cache utilization)
COPY package*.json ./
RUN npm ci --legacy-peer-deps

# Copy source files
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM node:18-alpine

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001

WORKDIR /app

# Copy only the necessary files from build stage
COPY --from=build /app/dist ./dist
COPY --from=build /app/package*.json ./

# Install only production dependencies
RUN npm ci --only=production --legacy-peer-deps && \
    npm cache clean --force

# Use non-root user
USER nextjs

# Set environment variables
ENV PORT=3000
ENV NODE_ENV=production

# Expose the port
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
