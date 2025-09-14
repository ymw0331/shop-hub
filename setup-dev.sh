#!/bin/bash
echo "🚀 Setting up development environment..."

# Check if PostgreSQL is running
if ! pg_isready -h localhost -p 5432; then
    echo "⚠️  PostgreSQL is not running. Please start it first:"
    echo "   macOS: brew services start postgresql"
    echo "   Linux: sudo systemctl start postgresql"
    exit 1
fi

# Create database if it doesn't exist
createdb ecommerce_db 2>/dev/null || echo "📝 Database already exists"

# Copy environment template
if [ ! -f .env ]; then
    echo "📋 Creating .env file from template..."
    cp .env.example .env
    echo "✏️  Please edit .env with your actual configuration"
else
    echo "✅ .env already exists"
fi

# Install dependencies
npm install

# Build the project
npm run build

echo "🎉 Development environment ready!"
echo "📋 Next steps:"
echo "   1. Edit .env with your PostgreSQL credentials"
echo "   2. Run: npm run dev"