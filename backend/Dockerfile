FROM node:20-alpine

WORKDIR /app

# Install openssl for Prisma runtime
RUN apk add --no-cache openssl

# Set dummy DATABASE_URL for safety
ENV DATABASE_URL="postgresql://postgres:vpf_secret_2024@postgres:5432/guinee_propre_db?schema=public"

# Copy package descriptors and TypeScript config
COPY package*.json tsconfig.json ./

# Copy pre-installed node_modules directly (avoids network downloads)
COPY node_modules ./node_modules

# Copy Prisma schema and config
COPY prisma ./prisma
COPY prisma.config.ts ./

# Copy source code
COPY src ./src

# Copy entrypoint script and fix Windows CRLF line endings
COPY docker-entrypoint.sh ./
RUN sed -i 's/\r$//' docker-entrypoint.sh && chmod +x docker-entrypoint.sh

EXPOSE 3000

ENTRYPOINT ["./docker-entrypoint.sh"]
