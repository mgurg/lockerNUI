# Dockerfile

# Stage 1: Build the application
FROM node:18-alpine AS build-stage

# Set working directory
WORKDIR /app

# Copy package.json and lock files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all files
COPY . .

# Build the application
RUN npm run build

# Stage 2: Serve the application
FROM node:18-alpine AS production-stage

# Set working directory
WORKDIR /app

# Copy only the necessary files from the build stage
COPY --from=build-stage /app/.output /app/.output
COPY --from=build-stage /app/package*.json ./

# Install only production dependencies
RUN npm install --only=production

# Expose the port the Nuxt app will run on
EXPOSE 3000

# Set environment variable for production
ENV NODE_ENV=production

# Command to run the app
CMD ["node", ".output/server/index.mjs"]
