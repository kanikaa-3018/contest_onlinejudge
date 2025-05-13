# Dockerfile for Java
FROM openjdk:17

WORKDIR /app

COPY code.java /app/code.java
COPY input.txt /app/input.txt

RUN javac /app/code.java

CMD ["java", "Main"]
