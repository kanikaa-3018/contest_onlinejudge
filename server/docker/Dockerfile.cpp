
# FROM gcc:latest

# # Set the working directory inside the container
# WORKDIR /app

# # Default command to compile and execute the C++ program
# CMD g++ /app/code.cpp -o /app/a.out && /app/a.out < /app/input.txt > /app/output.txt
FROM gcc:latest

WORKDIR /app

CMD [ "bash" ]
