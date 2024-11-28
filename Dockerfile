# Step 1: Use an official Node.js image to build the React app
FROM node:18 AS build

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application source code
COPY . .

# Build the React app for production
ARG REACT_APP_ENV
ENV REACT_APP_ENV=$REACT_APP_ENV
RUN npm run build

# Step 2: Use an Nginx image to serve the React app
FROM nginx:alpine

# Copy the build output from the previous step to the Nginx web root
COPY --from=build /app/build /usr/share/nginx/html

# Copy the custom Nginx configuration
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 3001
EXPOSE 3001

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]
