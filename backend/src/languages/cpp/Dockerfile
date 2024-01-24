# Use an official GCC image as a parent image
FROM gcc:latest

# Set the working directory to /code
WORKDIR /code

# Copy the current directory contents into the container at /code
COPY main.cpp .

# Compile the C++ code
RUN g++ -o main main.cpp

# Set the default command to run the C++ program
CMD ["./main"]
