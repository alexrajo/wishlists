FROM node:16-alpine
COPY . .
RUN npm install
EXPOSE 3001
ENV DATABASE_URL="wishlisterdb.database.windows.net;database=wishlist-db;Authentication=Active Directory Default;"
ENV PORT=3001
RUN npx prisma generate
CMD ["npm", "start"]
