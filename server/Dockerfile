FROM node:18.9.0-alpine3.16
WORKDIR /app
COPY package*.json /app
RUN npm install
COPY . .
EXPOSE 3001
ENV DATABASE_URL=${DATABASE_URL}
ENV PORT=3001
RUN npx prisma generate
CMD ["npm", "start"]