FROM node:18-alpine
WORKDIR /app
COPY Server/package*.json ./
RUN npm install
COPY Server ./Server
COPY Routes ./Routes
COPY Models ./Models
EXPOSE 5000
CMD ["npm", "start", "--prefix", "Server"]