# Official image for Node.js
FROM node:18-alpine

# Define work directory inside of the container
WORKDIR /app

# Copy package.json e package-lock.json
COPY package*.json ./

# Install all the dependencies
RUN npm install

# Copy the rest of the code
COPY . .

# Expose the gate for the websocket
EXPOSE 8081

# Command to run the server
CMD ["npm", "start"]

