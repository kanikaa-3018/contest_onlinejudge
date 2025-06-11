FROM node:18

# Install compilers and interpreters
RUN apt-get update && \
    apt-get install -y g++ openjdk-17-jdk python3 && \
    apt-get clean

# Set working directory
WORKDIR /app

# Copy source files and install Node dependencies
COPY . .
RUN npm install

# Expose the backend port
EXPOSE 5001

# Start the server using plain Node
CMD ["node", "index.js"]
