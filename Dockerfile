# Use an official Node.js runtime as the base image
FROM node:18-alpine AS builder

# Set the working directory in the container to /app
WORKDIR /app

# Copy package.json and package-lock.json from host to container
COPY package.json package-lock.json ./

# Install any dependencies defined in the package.json file
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the TypeScript files to JavaScript
RUN npm run build

# Start a new stage for the production image
FROM node:18-alpine

# Set the working directory in the container to /app
WORKDIR /app

# Copy the built application from the builder stage
COPY --from=builder /app/dist /app/dist

# Expose port 3333 for the application
EXPOSE 3333

# Set the environment variable for production
ENV NODE_ENV=production

# Start the application
CMD ["npm", "start"]
