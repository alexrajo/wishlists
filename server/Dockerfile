FROM node:16-alpine
WORKDIR /app
COPY package*.json /app
RUN npm install
COPY . .
EXPOSE 3001
ENV DATABASE_URL "postgresql://postgres:postgres@wishlist-db-postgres-new:5432/wishlist-db"
RUN npx prisma generate
CMD ["npm", "start"]
