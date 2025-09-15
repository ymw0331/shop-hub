# 🔑 API Services Setup Guide for ShopHub (2025)

This guide will help you obtain all necessary API keys and credentials for ShopHub's payment and email services.

## 📋 Quick Overview

| Service | Purpose | Cost | Status |
|---------|---------|------|--------|
| **Braintree** | Payment Processing | FREE Sandbox | ✅ Recommended |
| **Brevo** | Email Service | 300 emails/day FREE | ✅ Recommended |
| **SendGrid** | Email Service | No free tier (60-day trial only) | ❌ Not Recommended |
| **Resend** | Email Service | Good for React projects | ✅ Alternative |

---

## 💳 Braintree Sandbox Setup (Payment Processing)

### Why Braintree?
- **Permanently FREE** sandbox for testing
- Full payment gateway functionality
- Test credit cards provided
- PayPal integration included

### Step-by-Step Setup:

1. **Create Sandbox Account**
   - Go to: [https://sandbox.braintreegateway.com/login](https://sandbox.braintreegateway.com/login)
   - Click "Sign Up" for new account
   - **IMPORTANT**: Select "United States" for full features
   - Fill in your details (use any business name for testing)

2. **Get Your API Credentials**
   - After login, go to: **Settings → API Keys**
   - If no keys appear, click **"Generate New API Key"**
   - You'll receive:
     ```
     Merchant ID: abc123xyz789
     Public Key: public_key_here
     Private Key: private_key_here
     ```
   - **Save these immediately!**

3. **Test Credit Cards for Sandbox**
   ```
   Success: 4111111111111111
   Declined: 4000111111111115
   Insufficient Funds: 4009348888881881
   ```

4. **Add to .env**
   ```env
   BRAINTREE_MERCHANT_ID=your_merchant_id
   BRAINTREE_PUBLIC_KEY=your_public_key
   BRAINTREE_PRIVATE_KEY=your_private_key
   BRAINTREE_ENVIRONMENT=sandbox
   ```

---

## 📧 Email Service Setup

### ⚠️ SendGrid Update (2025)
**SendGrid discontinued their free tier on July 26, 2025**
- Only offers 60-day trial with 100 emails/day
- Requires paid plan after trial ($27+/month)
- **NOT recommended for portfolio projects**

### ✅ Recommended: Brevo (formerly Sendinblue)

#### Why Brevo?
- **300 emails/day FREE forever** (9,000/month)
- 100,000 contacts limit
- Full API + SMTP access
- Email templates included

#### Setup Instructions:

1. **Create Account**
   - Go to: [https://www.brevo.com](https://www.brevo.com)
   - Sign up with email
   - Verify your email address

2. **Get API Key**
   - Navigate to: **Settings → SMTP & API**
   - Click **"Create a new API key"**
   - Name it: "ShopHub Production"
   - Copy the API key immediately

3. **Configure SMTP (Optional)**
   - SMTP Server: `smtp-relay.brevo.com`
   - Port: `587`
   - Login: Your Brevo email
   - Password: Your API key

4. **Add to .env**
   ```env
   # Using Brevo
   EMAIL_SERVICE=brevo
   BREVO_API_KEY=your_brevo_api_key
   BREVO_SENDER_EMAIL=noreply@yourdomain.com
   BREVO_SENDER_NAME=ShopHub
   ```

### 🎯 Alternative: Resend (Great for React/Next.js)

#### Why Resend?
- React Email framework included
- Pre-configured templates
- Developer-friendly
- Good free tier

#### Setup:
1. Sign up at: [https://resend.com](https://resend.com)
2. Get API key from dashboard
3. Add to .env:
   ```env
   # Using Resend
   EMAIL_SERVICE=resend
   RESEND_API_KEY=re_123456789
   RESEND_FROM_EMAIL=onboarding@resend.dev
   ```

---

## 🔐 Complete .env Configuration

Here's your complete .env file with all services:

```env
# ==========================================
# DATABASE CONFIGURATION (NEON)
# ==========================================
POSTGRES_HOST=ep-xxx-xxx-123456.us-east-2.aws.neon.tech
POSTGRES_PORT=5432
POSTGRES_USER=your_neon_username
POSTGRES_PASSWORD=your_neon_password
POSTGRES_DB=shophub_db
POSTGRES_SSL=true

# For local development, use:
# POSTGRES_HOST=localhost
# POSTGRES_SSL=false

# ==========================================
# APPLICATION CONFIGURATION
# ==========================================
NODE_ENV=development
PORT=8000
JWT_SECRET=shophub-super-secret-jwt-key-make-it-long-and-complex-2025
JWT_EXPIRES_IN=7d

# ==========================================
# BRAINTREE PAYMENT (SANDBOX)
# ==========================================
BRAINTREE_MERCHANT_ID=your_sandbox_merchant_id
BRAINTREE_PUBLIC_KEY=your_sandbox_public_key
BRAINTREE_PRIVATE_KEY=your_sandbox_private_key
BRAINTREE_ENVIRONMENT=sandbox

# ==========================================
# EMAIL SERVICE (CHOOSE ONE)
# ==========================================

# Option 1: Brevo (RECOMMENDED - 300 emails/day free)
EMAIL_SERVICE=brevo
BREVO_API_KEY=xkeysib-your-api-key-here
BREVO_SENDER_EMAIL=noreply@shophub.com
BREVO_SENDER_NAME=ShopHub

# Option 2: Resend (Good for React projects)
# EMAIL_SERVICE=resend
# RESEND_API_KEY=re_your_api_key_here
# RESEND_FROM_EMAIL=onboarding@resend.dev

# Option 3: SendGrid (NOT RECOMMENDED - No free tier)
# EMAIL_SERVICE=sendgrid
# SENDGRID_API_KEY=SG.your_api_key_here
# SENDGRID_FROM_EMAIL=noreply@shophub.com

# ==========================================
# FRONTEND CONFIGURATION
# ==========================================
# Add these to client/.env
REACT_APP_API=http://localhost:8000/api
REACT_APP_SERVER=http://localhost:8000
```

---

## 🚀 Quick Start Checklist

### Required Steps:
- [ ] Create Neon database account
- [ ] Get Neon connection string
- [ ] Create Braintree sandbox account
- [ ] Get Braintree API keys
- [ ] Choose email service (Brevo recommended)
- [ ] Get email service API key
- [ ] Update .env file
- [ ] Test all services

### Testing Services:

1. **Test Database Connection**
   ```bash
   npm run dev
   # Should see: "Database connected successfully"
   ```

2. **Test Payment (Braintree)**
   - Use test card: `4111111111111111`
   - Any future date for expiry
   - Any 3-digit CVV

3. **Test Email Service**
   - Register new user
   - Check console logs for email send status

---

## 📊 Service Comparison

### Email Services (2025)

| Service | Free Tier | Best For | Limitation |
|---------|-----------|----------|------------|
| **Brevo** | 300/day (9k/month) | General use | Daily limit |
| **Resend** | Varies | React/Next.js | Developer focused |
| **Mailtrap** | 1,000/month | Testing | Monthly limit |
| **Amazon SES** | 3,000/month | AWS users | Complex setup |
| **SendGrid** | ❌ None | Enterprise | Paid only |

### Payment Services

| Service | Sandbox | Production Fees | Best For |
|---------|---------|-----------------|----------|
| **Braintree** | ✅ Free | 2.9% + $0.30 | Full features |
| **Stripe** | ✅ Free | 2.9% + $0.30 | Modern API |
| **PayPal** | ✅ Free | 2.9% + $0.30 | Wide adoption |

---

## 🆘 Troubleshooting

### Braintree Issues
- **"Invalid credentials"**: Check you're using sandbox keys, not production
- **"Merchant account not found"**: Ensure `BRAINTREE_ENVIRONMENT=sandbox`

### Email Service Issues
- **Brevo "Unauthorized"**: Verify API key starts with `xkeysib-`
- **Emails not sending**: Check sender email is verified in Brevo dashboard
- **Rate limit exceeded**: Stay within 300 emails/day for free tier

### Common Mistakes
1. Using production keys in development
2. Not setting `POSTGRES_SSL=true` for Neon
3. Forgetting to verify sender email in Brevo
4. Using SendGrid (no longer free)

---

## 📚 Additional Resources

- **Braintree Docs**: [developer.paypal.com/braintree](https://developer.paypal.com/braintree)
- **Brevo API Docs**: [developers.brevo.com](https://developers.brevo.com)
- **Resend Docs**: [resend.com/docs](https://resend.com/docs)
- **Neon Setup**: See [NEON_SETUP.md](./NEON_SETUP.md)

---

**Next Steps**: After setting up all APIs, run `npm run dev` and test the complete flow: user registration → email confirmation → product purchase → payment processing.