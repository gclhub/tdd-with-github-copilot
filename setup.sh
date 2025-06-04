#!/usr/bin/env zsh

echo "===== Setting Up Mortgage Calculator ====="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
  echo "Node.js not found. Please install Node.js and try again."
  exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d "v" -f2)
NODE_MAJOR_VERSION=$(echo $NODE_VERSION | cut -d "." -f1)

if [ "$NODE_MAJOR_VERSION" -lt 14 ]; then
  echo "Node.js version too old. Version 14 or higher is required."
  echo "Current version: $NODE_VERSION"
  exit 1
fi

echo "Node.js version $NODE_VERSION detected."
echo "Installing dependencies..."
npm install

echo ""
echo "Building the project..."
npm run build

echo ""
echo "===== Setup Complete ====="
echo "Run the calculator with: npm start"
