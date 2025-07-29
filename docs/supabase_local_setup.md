# Supabase Local Development Setup Guide

This guide will help you set up a local Supabase development environment for your Craft project.

## Prerequisites

### 1. Install Docker Desktop

Docker Desktop is required for running Supabase locally. Follow these steps:

1. **Download Docker Desktop:**

   - Visit [https://www.docker.com/products/docker-desktop/](https://www.docker.com/products/docker-desktop/)
   - Download the version for your device
   - Install the application

2. **Start Docker Desktop:**
   - Open Docker Desktop from your Applications folder
   - Wait for Docker to start (you'll see the Docker icon in your menu bar)
   - Verify installation by running: `docker --version`

### 2. Install Supabase CLI (if not already installed)

The Supabase CLI should already be installed as a dev dependency, but you can also install it globally:

```bash
pnpm install supabase
# or
brew install supabase/tap/supabase
```

## Setting Up Local Supabase

### 1. Start the Local Environment

Once Docker Desktop is running, start your local Supabase instance:

```bash
supabase start
```

This will:

- Start a local PostgreSQL database
- Start the Supabase API server
- Start Supabase Studio (web interface)
- Start the local auth server
- Start the local storage server

### 2. Access Your Local Services

After starting, you'll see URLs for each service:

- **API URL:** `http://127.0.0.1:54321`
- **DB URL:** `postgresql://postgres:postgres@127.0.0.1:54322/postgres`
- **Studio URL:** `http://127.0.0.1:54323`
- **Inbucket URL:** `http://127.0.0.1:54324` (for email testing)
- **Storage URL:** `http://127.0.0.1:54325`

### 3. Environment Variables

Create a `.env.local` file in your project root with the local Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_local_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_local_service_role_key_here
```

The actual keys will be displayed when you run `supabase start`.

## Database Management

### Creating Migrations

Create database migrations to manage your schema:

```bash
# Create a new migration
supabase migration new create_users_table

# Apply migrations
supabase db reset

# Generate types from your database
supabase gen types typescript --local > src/types/database.ts
```

### Example Migration

Create a file in `supabase/migrations/` with a timestamp prefix:

```sql
-- Example: 20240101000000_create_users_table.sql
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## Development Workflow

### 1. Start Development

```bash
# Start Supabase local environment
supabase start

# Start your Next.js development server
pnpm dev
```

### 2. Database Changes

```bash
# Make changes to your database
supabase migration new your_migration_name

# Apply changes
supabase db reset

# Update TypeScript types
supabase gen types typescript --local > src/types/database.ts
```

### 3. Stop Services

```bash
# Stop Supabase local environment
supabase stop

# Stop and reset database (removes all data)
supabase db reset
```

## Useful Commands

```bash
# Check status of local services
supabase status

# View logs
supabase logs

# Access database directly
supabase db reset

# Generate types
supabase gen types typescript --local > src/types/database.ts

# Start with specific services
supabase start --db-only
```

## Troubleshooting

### Common Issues

1. **Docker not running:**

   - Make sure Docker Desktop is started
   - Check Docker status: `docker ps`

2. **Port conflicts:**

   - Check if ports 54321-54325 are available
   - Stop other services using these ports

3. **Database connection issues:**

   - Reset the database: `supabase db reset`
   - Check logs: `supabase logs`

4. **Configuration errors:**
   - The config.toml file has been cleaned up to remove unsupported options
   - If you encounter config errors, check the Supabase CLI version compatibility

### Reset Everything

If you need to start fresh:

```bash
supabase stop
supabase db reset
supabase start
```

## Next Steps

1. Start Docker Desktop
2. Run `supabase start` to start your local environment
3. Update your environment variables with the local credentials
4. Create your first migration for your database schema
5. Start developing with your local Supabase instance!

## Additional Resources

- [Supabase Local Development Docs](https://supabase.com/docs/guides/local-development)
- [Supabase CLI Reference](https://supabase.com/docs/reference/cli)
- [Database Migrations Guide](https://supabase.com/docs/guides/database/migrations)
