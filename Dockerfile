# Use an official Node.js runtime as the base image
FROM node:18-alpine AS builder

RUN mkdir /app

# Set the working directory in the container to /app
WORKDIR /app

COPY package*.json /app/

# Install any dependencies defined in the package.json file
RUN npm install

# Copy the rest of the application code
COPY . /app/

# Build the application (adjust if your build process is different)
RUN npm run build

# Start a new stage for the production image
FROM node:18-alpine

# Set the working directory in the container to /app
WORKDIR /app

# Copy the built application from the builder stage (adjust if not applicable)
COPY --from=builder /app/dist /app/dist

# Expose port 3333 for the application
EXPOSE 3333

# Set the environment variable for production
ENV NODE_ENV=production

# Start the application
CMD ["npm", "start"]
