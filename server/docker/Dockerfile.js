# Dockerfile for JavaScript
FROM node:20

WORKDIR /app

COPY code.js /app/code.js
COPY input.txt /app/input.txt

CMD ["node", "/app/code.js"]
