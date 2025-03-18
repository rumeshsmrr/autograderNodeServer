# Use official Node.js runtime as a parent image
FROM node:18

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy app files
COPY . .

# Expose the port (make sure this matches your ECS env variable)
EXPOSE 5001

# Start the server
CMD ["node", "server.js"]
