FROM node:18

# Install compilers, interpreters, and PM2
RUN apt-get update && \
    apt-get install -y g++ openjdk-17-jdk python3 && \
    npm install -g pm2 && \
    apt-get clean

# Set working directory
WORKDIR /app

# Copy and install dependencies
COPY package*.json ./
RUN npm install
COPY . .

# Expose port
EXPOSE 5001

# Start with PM2
CMD ["pm2-runtime", "index.js"]
