#!/bin/bash

# WordSwipe Deployment Script for Netlify

echo "🚀 Starting WordSwipe Deployment Process"

# Check if Node.js is installed
if ! command -v node &> /dev/null
then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null
then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ Node.js and npm are installed"

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    if [ $? -ne 0 ]; then
        echo "❌ Failed to install dependencies"
        exit 1
    fi
    echo "✅ Dependencies installed successfully"
else
    echo "✅ Dependencies already installed"
fi

# Build the project
echo "🔨 Building the project..."
npm run build
if [ $? -ne 0 ]; then
    echo "❌ Build failed"
    exit 1
fi

echo "✅ Build completed successfully"

# Check if Netlify CLI is installed
if ! command -v netlify &> /dev/null
then
    echo "⚠️  Netlify CLI is not installed"
    echo "💡 To install Netlify CLI, run: npm install -g netlify-cli"
    echo "📁 Your build is ready in the 'dist' folder for manual deployment"
    exit 0
fi

echo "🌐 Netlify CLI is installed"

# Deploy to Netlify
echo "🚀 Deploying to Netlify..."
netlify deploy --prod

if [ $? -eq 0 ]; then
    echo "🎉 Deployment completed successfully!"
    echo "🎮 Your WordSwipe game is now live!"
else
    echo "❌ Deployment failed"
    echo "💡 Check the error message above and try again"
    exit 1
fi