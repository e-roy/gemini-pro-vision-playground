# Use the official Node.js image as a base image
FROM node:18

# Set the working directory
WORKDIR /app

# Copy package.json and yarn.lock into the working directory
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install --frozen-lockfile

# Copy the rest of the application code
COPY / .

# Build the Next.js app
RUN yarn build

# Expose the port the app runs on
EXPOSE 3000

# Start the app
CMD ["yarn", "start"]