# Use an official Node.js runtime as the base image
FROM node:18-alpine

# Set the working directory in the container to /app
WORKDIR /app

# Copy package.json and package-lock.json from host to container
COPY package.json package-lock.json./

# Install any dependencies defined in the package.json file
RUN npm install

# Expose port 3000 for the application
EXPOSE 3333

# Start the application
CMD ["npm", "start"]