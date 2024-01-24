# Use an official OpenJDK runtime as a parent image
FROM openjdk:11

# Set the working directory to /code
WORKDIR /code

# Copy the current directory contents into the container at /code
COPY Main.java .

# Compile the Java code
RUN javac Main.java

# Set the default command to run the Java program
CMD ["java", "Main"]
