# Stage 1: Build the application using Bun
FROM oven/bun:latest AS build-stage

# Set working directory
WORKDIR /app

# Copy package.json and lock files
COPY package*.json bun.lockb ./

# Install dependencies using Bun
RUN bun install

# Copy all files
COPY . .

# Build the application
# Add build args for environment variables
ARG NUXT_PUBLIC_BLOG_URL
ENV NUXT_PUBLIC_BLOG_URL=${NUXT_PUBLIC_BLOG_URL}

ARG NUXT_BACKEND_API
ENV NUXT_BACKEND_API=${NUXT_BACKEND_API}

ARG NUXT_UMAMI_ID
ENV NUXT_UMAMI_ID=${NUXT_UMAMI_ID}

ARG NUXT_UMAMI_HOST
ENV NUXT_UMAMI_HOST=${NUXT_UMAMI_HOST}


RUN bun run build

# Stage 2: Serve the application using Bun
FROM oven/bun:latest AS production-stage

# Set working directory
WORKDIR /app

# Copy only the necessary files from the build stage
COPY --from=build-stage /app/.output /app/.output
COPY --from=build-stage /app/package*.json /app/bun.lockb ./

# Install only production dependencies using Bun
RUN bun install --production

# Expose the port the Nuxt app will run on
EXPOSE 3000

# Set environment variable for production
ENV NODE_ENV=production
ENV NUXT_PUBLIC_BLOG_URL=${NUXT_PUBLIC_BLOG_URL}
ENV NUXT_BACKEND_API=${NUXT_BACKEND_API}
ENV NUXT_UMAMI_ID=${NUXT_UMAMI_ID}
ENV NUXT_UMAMI_HOST=${NUXT_UMAMI_HOST}

# Command to run the app using Bun
CMD ["bun", ".output/server/index.mjs"]
