FROM node:20-bookworm

WORKDIR /app

COPY app/package*.json ./

RUN npm ci

COPY app .

EXPOSE 3000

CMD ["npm", "run", "dev"]