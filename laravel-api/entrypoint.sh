#!/bin/sh
set -e

# Install dependencies if missing
if [ ! -d vendor ]; then
    echo "📦 Installing Composer dependencies..."
    composer install --no-interaction --optimize-autoloader
fi

echo "🔧 Setting up Laravel storage and cache directories..."

mkdir -p \
    storage/framework/cache \
    storage/framework/sessions \
    storage/framework/testing \
    storage/framework/views \
    bootstrap/cache \
    database

chmod -R 777 bootstrap/cache database storage/framework/cache storage/framework/sessions storage/framework/testing storage/framework/views

if [ ! -f database/database.sqlite ]; then
    touch database/database.sqlite
    chmod 777 database/database.sqlite
    echo "📄 Created database/database.sqlite"
fi

# Wait for MySQL to be ready
echo "⏳ Waiting for MySQL..."
while ! nc -z mysql 3306; do
  sleep 1
done

# Run migrations
echo "📦 Migrating database..."
php artisan migrate --force

# Seed database only if empty
CUSTOMER_COUNT=$(php artisan tinker --execute='echo App\Models\Customer::count();')
if [ "$CUSTOMER_COUNT" -eq 0 ]; then
    echo "🌱 Seeding database..."
    php artisan db:seed --force
else
    echo "🌱 Database already seeded, skipping."
fi

# Sync all customers to Elasticsearch
echo "🔍 Syncing customers to Elasticsearch..."
php artisan customers:sync-es || echo "⚠️ Elasticsearch sync skipped or failed"

echo "✅ Laravel setup complete!"

exec "$@"
