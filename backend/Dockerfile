# Use the official Python image as the base image
FROM python:3.12.2

# Set the working directory inside the container
WORKDIR /app

# Copy the requirements.txt file to the working directory
COPY requirements.txt .

# Install the dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application code to the working directory
COPY . .

# Expose the port the app runs on
EXPOSE 8000

# Define the command to run the FastAPI app
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
