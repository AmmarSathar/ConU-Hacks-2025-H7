# Use a lightweight Node.js image
FROM node:14-alpine

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port your React app runs on (default is 3000)
EXPOSE 3000

# Start the development server
CMD ["npm", "start"]
