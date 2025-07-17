# Use official Node.js LTS base image
FROM node:20

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the code
COPY . .

# Expose the server port
EXPOSE 3000

# Default command to run the server
CMD ["npm", "start"]
