# 🚀 Neon PostgreSQL Setup Guide for ShopHub (2025)

This guide will help you set up ShopHub with Neon's serverless PostgreSQL database for production deployment.

## 📋 Why Neon?

### Free Tier (2025 Updated)
- **Projects**: Up to 20 projects
- **Compute**: 50 CU-hours per project/month (1 CU = 1 vCPU + 4 GB RAM)
- **Storage**: 0.5 GB per branch
- **Egress**: 5 GB bandwidth
- **Restore History**: 6 hours PITR (Point-in-Time Recovery)
- **Auto-suspend**: After 5 minutes of inactivity

### Key Features
- **Serverless Architecture**: No server provisioning, automatic scaling
- **Database Branching**: Git-like workflow for databases
- **TypeORM Compatible**: Works seamlessly with our existing setup
- **SSL/TLS Required**: All connections encrypted by default

## 🔧 Setup Instructions

### Step 1: Create Neon Account

1. Go to [https://neon.tech](https://neon.tech)
2. Sign up with:
   - GitHub (recommended for developers)
   - Google
   - Email
   - Other partner accounts

3. During onboarding, create your first project:
   - **Project Name**: `shophub-db` (one project per application repository)
   - **Database Name**: `neondb` (default) or `shophub_db`
   - **Region**: Choose closest to your users (e.g., `us-east-2`)
   - **Branch**: `production` (primary) and `development` (auto-created)

### Step 2: Get Connection Details

After project creation, you'll receive your connection string:

1. **Save your connection string immediately** - it includes your password
2. Connection string format:
```
postgresql://[user]:[password]@[endpoint-id].aws.neon.tech/[dbname]?sslmode=require
```

Example:
```
postgresql://alex:AbC123dEf@ep-cool-darkness-123456.us-east-2.aws.neon.tech/neondb?sslmode=require
```

**Note**: The hostname includes your compute ID with an "ep-" prefix

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
- **Important**: Neon requires SSL/TLS for all connections (sslmode=require)

### Timeout Issues
Neon databases auto-suspend after 5 minutes of inactivity:
- First request after suspension takes 1-2 seconds to wake up
- This is normal and helps keep the free tier sustainable
- For production, consider upgrading to avoid cold starts

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

### Understanding Neon Branches
- Each branch is like a Git branch for your database
- Child branches copy data from parent at creation time
- Perfect for testing features without affecting production

### Create a test branch:
```bash
# Install Neon CLI first
npm install -g neonctl

# Authenticate
neon auth

# Create branch
neon branch create --name test-feature

# List branches
neon branch list

# Delete branch when done
neon branch delete test-feature
```

**Note**: Extra branches are not available on Free plan - upgrade if needed

## 📈 Monitoring

Neon provides:
- Query insights
- Connection metrics
- Storage usage tracking
- Performance analytics

Access via: Dashboard → Monitoring

## 💡 Best Practices

1. **Connection Management**:
   - Use connection pooling for production
   - Close idle connections to save compute hours

2. **Free Tier Optimization**:
   - 50 CU-hours = ~200 hours of 0.25 vCPU usage
   - Perfect for business hours operation (Mon-Fri)
   - Auto-suspend saves compute when idle

3. **Security**:
   - Never commit connection strings to Git
   - Use environment variables for all credentials
   - SSL/TLS is mandatory (not optional)

4. **Monitoring**:
   - Check compute usage in dashboard regularly
   - Monitor storage growth (0.5 GB limit per branch)
   - Track egress usage (5 GB free limit)

5. **Development Workflow**:
   - Use `development` branch for testing
   - Keep `production` branch stable
   - Delete unused branches to stay within limits

## 📊 Free Tier Usage Calculator

### Compute Hours Example:
- **50 CU-hours/month** per project means:
  - 1 CU × 50 hours = Full power for 50 hours
  - 0.5 CU × 100 hours = Half power for 100 hours
  - 0.25 CU × 200 hours = Quarter power for 200 hours (perfect for dev)

### Storage Limits:
- 0.5 GB per branch × 20 projects = 10 GB total possible
- ShopHub with demo data uses ~100-200 MB

## 🆘 Support

- **Neon Docs**: [https://neon.tech/docs](https://neon.tech/docs)
- **SQL Editor**: Available in Neon Console for quick queries
- **ShopHub Issues**: [GitHub Issues](https://github.com/ymw0331/shophub/issues)
- **Neon Discord**: [Join Community](https://discord.gg/neon)
- **VS Code Extension**: Neon Local Connect for localhost development

---

**Next Steps**: After setup, check out the [Full Testing Guide](./FULL_TESTING_GUIDE.md) to test all features.