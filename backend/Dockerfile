FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

# Copy all source files (including prisma/ and prisma.config.js)
COPY . .

# Generate Prisma client — DATABASE_URL is not needed for generate,
# but prisma.config.js calls env() so we pass a placeholder to satisfy it
RUN DATABASE_URL="postgresql://placeholder:placeholder@localhost:5432/placeholder" \
    npx prisma generate

EXPOSE 5000

CMD ["node", "server.js"]
