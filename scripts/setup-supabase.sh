#!/bin/bash

# Supabase Local Setup Script
echo "🚀 Setting up Supabase Local Environment..."

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker Desktop first:"
    echo "   https://www.docker.com/products/docker-desktop/"
    exit 1
fi

# Check if Docker is running
if ! docker info &> /dev/null; then
    echo "❌ Docker is not running. Please start Docker Desktop first."
    exit 1
fi

echo "✅ Docker is running"

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo "❌ Supabase CLI is not installed. Installing..."
    npm install -g supabase
fi

echo "✅ Supabase CLI is available"

# Create migrations directory if it doesn't exist
mkdir -p supabase/migrations

# Start Supabase
echo "🚀 Starting Supabase local environment..."
supabase start

if [ $? -eq 0 ]; then
    echo "✅ Supabase started successfully!"
    echo ""
    echo "📋 Next steps:"
    echo "1. Copy the environment variables shown above to your .env.local file"
    echo "2. Create your first migration: supabase migration new your_migration_name"
    echo "3. Start your Next.js dev server: npm run dev"
    echo ""
    echo "🌐 Access your services:"
    echo "- Studio: http://127.0.0.1:54323"
    echo "- API: http://127.0.0.1:54321"
    echo "- Database: postgresql://postgres:postgres@127.0.0.1:54322/postgres"
else
    echo "❌ Failed to start Supabase. Check the error messages above."
    exit 1
fi 