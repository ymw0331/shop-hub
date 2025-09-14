# 🗄️ PostgreSQL Database Setup Guide

This document provides step-by-step instructions for setting up PostgreSQL database for the ShopHub e-commerce application.

## Prerequisites

- PostgreSQL installed on macOS (via Homebrew)
- Terminal access
- Beekeeper Studio (optional, for GUI database management)

## 📋 Database Setup Steps

### Step 1: Start PostgreSQL Service

```bash
# Start PostgreSQL using Homebrew
brew services start postgresql@14

# Or start postgresql (if default version)
brew services start postgresql

# Verify PostgreSQL is running
pg_isready -h localhost -p 5432
```

### Step 2: Connect to PostgreSQL as Superuser

```bash
# Connect to PostgreSQL as superuser (usually your system username)
psql postgres
```

### Step 3: Create Database User

Run these SQL commands in the PostgreSQL terminal:

```sql
-- Create a new user with password for the application
CREATE USER shophub_user WITH PASSWORD 'shophub_password_123';

-- Grant necessary privileges to create databases (needed for migrations)
ALTER USER shophub_user CREATEDB;

-- Optional: View all users to verify creation
\du
```

### Step 4: Create Application Database

```sql
-- Create the database owned by our user
CREATE DATABASE shophub_db OWNER shophub_user;

-- Grant all privileges on the database to the user
GRANT ALL PRIVILEGES ON DATABASE shophub_db TO shophub_user;

-- Optional: List all databases to verify creation
\l

-- Exit PostgreSQL terminal
\q
```

### Step 5: Test Connection

```bash
# Test connection with the new user and database
psql -h localhost -U shophub_user -d shophub_db

# When prompted, enter password: shophub_password_123
# Type \q to exit after successful connection
```

## 📝 Environment Configuration

Update your `.env` file with the database credentials:

```env
# Database Configuration
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_USER=shophub_user
POSTGRES_PASSWORD=shophub_password_123
POSTGRES_DB=shophub_db

# Application Configuration
NODE_ENV=development
PORT=8000

# JWT Configuration
JWT_SECRET=shophub-super-secret-jwt-key-make-it-long-and-complex-2024
JWT_EXPIRES_IN=7d

# Braintree Configuration (for payments)
BRAINTREE_MERCHANT_ID=your_merchant_id
BRAINTREE_PUBLIC_KEY=your_public_key
BRAINTREE_PRIVATE_KEY=your_private_key
BRAINTREE_ENVIRONMENT=sandbox

# SendGrid Configuration (for emails) 
SENDGRID_API_KEY=your_sendgrid_api_key
```

## 🔧 Beekeeper Studio Setup

For GUI database management, configure Beekeeper Studio with these settings:

- **Connection Type:** PostgreSQL
- **Host:** `localhost`
- **Port:** `5432`
- **Username:** `shophub_user`
- **Password:** `shophub_password_123`
- **Database:** `shophub_db`
- **Connection Name:** `ShopHub Development`

## 🛡️ Security Best Practices

### Why We Created a Dedicated User:

1. **Security Isolation**: App uses limited privileges, not superuser
2. **Access Control**: User only has access to the specific database
3. **Audit Trail**: Database actions are tracked per user
4. **Migration Safety**: User can create/modify tables but not system settings

### Production Considerations:

- Use environment-specific passwords
- Enable SSL connections in production
- Implement connection pooling
- Regular database backups
- Monitor connection limits

## 🔍 Verification Commands

### Check Database Exists:
```sql
-- Connect and list databases
psql -U shophub_user -d shophub_db -c "\l"
```

### Check User Permissions:
```sql
-- View user privileges
psql postgres -c "\du shophub_user"
```

### Test Application Connection:
```bash
# Run the application to test database connection
npm run dev
```

## 🚨 Troubleshooting

### Common Issues:

**1. PostgreSQL Not Running**
```bash
brew services start postgresql
# or
brew services restart postgresql
```

**2. Permission Denied**
```bash
# Make sure you're using the correct username/password
psql -h localhost -U shophub_user -d shophub_db
```

**3. Database Doesn't Exist**
```bash
# Recreate the database
createdb -U shophub_user shophub_db
```

**4. Port Already in Use**
```bash
# Check what's using port 5432
lsof -i :5432
```

## 📚 Useful PostgreSQL Commands

```sql
-- List all databases
\l

-- List all users
\du

-- Connect to a database
\c database_name

-- List all tables in current database
\dt

-- Describe a table structure
\d table_name

-- Exit PostgreSQL
\q
```

## 🔄 Database Migration Workflow

Once the database is set up:

1. **Generate Migration**: `npm run typeorm migration:generate src/migrations/InitialMigration`
2. **Run Migration**: `npm run typeorm migration:run`
3. **Revert Migration**: `npm run typeorm migration:revert`

---

## ✅ Completion Checklist

- [ ] PostgreSQL service started
- [ ] Database user `shophub_user` created
- [ ] Database `shophub_db` created and owned by user
- [ ] Connection tested successfully
- [ ] `.env` file updated with credentials
- [ ] Beekeeper Studio connected (optional)
- [ ] Application server connects to database

**Next Steps:** Run `npm run dev` to start the application server and verify database connectivity.
