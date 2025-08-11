#!/bin/bash

echo "🚀 Initializing Schedule Timeline Library..."

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build the library
echo "🔨 Building the library..."
npm run build

# Run tests
echo "🧪 Running tests..."
npm test

echo "✅ Library initialized successfully!"
echo ""
echo "Next steps:"
echo "1. Create a GitHub repository: https://github.com/new"
echo "2. Push your code:"
echo "   git init"
echo "   git add ."
echo "   git commit -m 'Initial commit: Schedule Timeline Library'"
echo "   git branch -M main"
echo "   git remote add origin https://github.com/DEmmaRL/schedule-timeline.git"
echo "   git push -u origin main"
echo ""
echo "3. To publish to npm:"
echo "   npm login"
echo "   npm publish --access public"
echo ""
echo "📚 Check the README.md for usage examples!"
