# Use a Debian-based Node.js image (glibc included)
FROM node:18-slim

# Install curl first, as it's missing in the base image
RUN apt-get update && apt-get install -y curl

# Install bun
RUN curl -fsSL https://bun.sh/install | bash

# Ensure bun is on the PATH
ENV BUN_INSTALL="/root/.bun"
ENV PATH="$BUN_INSTALL/bin:$PATH"

# Set working directory and copy necessary files
WORKDIR /app
COPY package.json bun.lockb ./

# Install dependencies using bun
RUN bun install

# Copy the rest of your source code and build your app
COPY . .

# You can then add the command to run your app
CMD ["bun", "run", "start"]
