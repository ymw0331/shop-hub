# 🚀 Neon PostgreSQL Setup Guide for ShopHub

This guide will help you set up ShopHub with Neon's serverless PostgreSQL database for production deployment.

## 📋 Why Neon?

- **Free Tier**: 0.5 GB storage, perfect for portfolio projects
- **Serverless**: Instant wake-up, scales to zero when idle
- **TypeORM Compatible**: Works seamlessly with our existing setup
- **Database Branching**: Create test branches without affecting production
- **Auto-suspend**: Saves resources when not in use

## 🔧 Setup Instructions

### Step 1: Create Neon Account

1. Go to [https://neon.tech](https://neon.tech)
2. Sign up with GitHub or email
3. Create a new project:
   - **Project Name**: `shophub-db`
   - **Database Name**: `shophub_db`
   - **Region**: Choose closest to your users

### Step 2: Get Connection Details

From your Neon dashboard:

1. Navigate to your project
2. Click on "Connection Details"
3. You'll see a connection string like:
```
postgresql://username:password@ep-xxx-xxx-123456.us-east-2.aws.neon.tech/shophub_db?sslmode=require
```

### Step 3: Configure Environment Variables

Update your `.env` file with Neon credentials:

```env
# Database Configuration (Neon)
POSTGRES_HOST=ep-xxx-xxx-123456.us-east-2.aws.neon.tech
POSTGRES_PORT=5432
POSTGRES_USER=your_neon_username
POSTGRES_PASSWORD=your_neon_password
POSTGRES_DB=shophub_db
POSTGRES_SSL=true

# Or use single connection string
DATABASE_URL=postgresql://username:password@ep-xxx-xxx-123456.us-east-2.aws.neon.tech/shophub_db?sslmode=require
```

### Step 4: Build and Migrate

```bash
# 1. Install dependencies
npm install

# 2. Build TypeScript
npm run build

# 3. Run migrations to create tables
npm run typeorm migration:run
```

### Step 5: Populate Database with Demo Data

```bash
# Seed the database with sample data
npm run db:seed
```

This will create:
- ✅ 15 product categories
- ✅ 100+ demo users with addresses
- ✅ 500+ products across categories
- ✅ Sample orders with various statuses
- ✅ Admin and customer test accounts

### Step 6: Test the Connection

```bash
# Start the development server
npm run dev

# You should see:
# ✅ Database connected successfully
# ✅ Server is running on port 8000
```

## 🔑 Test Accounts

After seeding, use these accounts:

```javascript
// Admin Account
Email: admin@test.com
Password: admin123456

// Customer Account
Email: customer@test.com
Password: password123
```

## 🚨 Troubleshooting

### SSL Connection Error
If you get SSL errors, ensure:
- `POSTGRES_SSL=true` is set in `.env`
- The data-source.ts has SSL configuration

### Timeout Issues
Neon databases auto-suspend after 5 minutes of inactivity. First request may take 1-2 seconds to wake up.

### Migration Errors
```bash
# Clear and reseed if needed
npm run db:clear
npm run db:seed
```

## 🌐 Production Deployment

### Frontend (Vercel/Netlify)
Add environment variable:
```env
REACT_APP_API=https://your-backend-url.com/api
```

### Backend (Railway/Render)
Add all PostgreSQL environment variables from Neon dashboard.

## 📊 Database Management

### Using Neon Dashboard
- View queries and performance
- Create database branches
- Monitor storage usage
- Set up connection pooling

### Using Beekeeper Studio
Connect with:
- **Type**: PostgreSQL
- **Host**: Your Neon endpoint
- **Port**: 5432
- **Database**: shophub_db
- **SSL**: Required

## 🔄 Database Branching (Advanced)

Create a test branch:
```bash
# Via Neon CLI
neon branch create --name test-feature

# Update .env with branch endpoint
# Test your changes
# Merge or delete branch when done
```

## 📈 Monitoring

Neon provides:
- Query insights
- Connection metrics
- Storage usage tracking
- Performance analytics

Access via: Dashboard → Monitoring

## 💡 Best Practices

1. **Use Connection Pooling** for production
2. **Enable Row Level Security** for sensitive data
3. **Regular Backups** (Neon keeps 7 days automatically)
4. **Monitor Query Performance** in dashboard
5. **Use Database Branches** for testing features

## 🆘 Support

- **Neon Docs**: [https://neon.tech/docs](https://neon.tech/docs)
- **ShopHub Issues**: [GitHub Issues](https://github.com/ymw0331/shophub/issues)
- **Neon Discord**: [Join Community](https://discord.gg/neon)

---

**Next Steps**: After setup, check out the [Full Testing Guide](./FULL_TESTING_GUIDE.md) to test all features.