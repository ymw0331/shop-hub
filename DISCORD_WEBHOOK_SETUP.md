# 🔔 Discord Webhook Setup Guide for ShopHub CI/CD

## 📋 Prerequisites
- Admin access to a Discord server
- Admin access to your GitHub repository

## 🚀 Step 1: Create Discord Webhook

### 1.1 Open Discord and Navigate to Your Server
- Open Discord (desktop app or web)
- Go to the server where you want notifications

### 1.2 Create a Webhook
1. **Right-click** on the channel where you want notifications (e.g., #deployments or #github)
2. Click **Edit Channel** (or click the gear icon next to the channel name)
3. Navigate to **Integrations** in the left sidebar
4. Click on **Webhooks**
5. Click **New Webhook** button

### 1.3 Configure the Webhook
1. **Name:** Set to `GitHub Deploy Bot` (or any name you prefer)
2. **Avatar:** (Optional) Upload a custom avatar for the bot
3. **Channel:** Confirm it's the correct channel
4. Click **Copy Webhook URL** button
5. **IMPORTANT:** Save this URL securely - you'll need it for GitHub

### 1.4 Save Changes
Click **Save Changes** to create the webhook

## 🔐 Step 2: Add Webhook to GitHub Secrets

### 2.1 Navigate to Your Repository Settings
1. Go to your GitHub repository: `https://github.com/[your-username]/e-commercehub`
2. Click on **Settings** tab
3. In the left sidebar, expand **Secrets and variables**
4. Click on **Actions**

### 2.2 Create New Repository Secret
1. Click **New repository secret** button
2. Fill in the details:
   - **Name:** `DISCORD_WEBHOOK`
   - **Secret:** Paste the webhook URL you copied from Discord
3. Click **Add secret**

## ✅ Step 3: Verify Setup

### 3.1 Test the Webhook
The webhook will be triggered automatically when:
- You push to the `master` or `main` branch
- You create or update a pull request
- You manually trigger the workflow

### 3.2 Manual Test
To manually test the webhook:
1. Go to **Actions** tab in your GitHub repository
2. Select **Deploy to Production** workflow
3. Click **Run workflow**
4. Select branch and click **Run workflow**

## 📊 What Notifications You'll Receive

### Deploy Workflow (`deploy.yml`)
- 🔄 **Build Started** - When deployment begins
- ✅ **Build Success** - When builds complete successfully
- ❌ **Build Failed** - If builds encounter errors
- 🎉 **Deployment Complete** - When sites are live
- ⚠️ **Deployment Warning** - If health checks fail

### PR Check Workflow (`pr-check.yml`)
- 🔍 **New PR Opened** - When someone creates a PR
- ✅ **PR Checks Passed** - All validations successful
- ❌ **PR Checks Failed** - Issues found in PR
- 💬 **PR Comments** - Automated feedback on PRs

## 🎨 Discord Message Format

The bot sends rich embeds with:
- **Color coding**: Green (success), Yellow (warning), Red (failure), Blue (info)
- **Timestamps**: When events occurred
- **Direct links**: To deployments, PRs, and workflow logs
- **Status indicators**: Clear visual feedback
- **Commit info**: Author, message, and SHA

## 🛠️ Troubleshooting

### Webhook Not Working?
1. **Check Secret Name**: Ensure it's exactly `DISCORD_WEBHOOK` in GitHub
2. **Verify URL**: Make sure the full Discord webhook URL was pasted
3. **Check Permissions**: Ensure the webhook has permission to post in the channel
4. **Test Manually**: Try posting to the webhook using curl:

```bash
curl -X POST YOUR_WEBHOOK_URL \
  -H "Content-Type: application/json" \
  -d '{"content": "Test message from CI/CD"}'
```

### No Notifications?
- Check GitHub Actions tab for workflow run status
- Verify the workflow files are in `.github/workflows/`
- Ensure you're pushing to the correct branch (`master` or `main`)

### Rate Limits
Discord webhooks have rate limits:
- 30 requests per minute per webhook
- This should be sufficient for normal CI/CD usage

## 🔒 Security Notes

- **Never commit** the webhook URL directly in code
- **Keep it secret**: Treat the webhook URL like a password
- **Rotate if exposed**: If the URL is compromised, delete and create a new webhook
- **Use GitHub Secrets**: Always store sensitive data in GitHub Secrets

## 📝 Optional Customizations

### Custom Bot Name/Avatar
In Discord webhook settings, you can:
- Change the bot name to match your project
- Upload a custom avatar (your logo, etc.)

### Different Channels for Different Events
You can create multiple webhooks:
- `DISCORD_WEBHOOK_DEPLOY` for deployment notifications
- `DISCORD_WEBHOOK_PR` for PR notifications
- Update the workflow files accordingly

### Mention Specific Users
Add user mentions in critical notifications:
```yaml
-d '{"content": "<@USER_ID> Deployment failed!", "embeds": [...]}'
```

## 🎯 Next Steps

1. ✅ Create Discord webhook
2. ✅ Add `DISCORD_WEBHOOK` to GitHub Secrets
3. ✅ Push code to trigger the workflow
4. ✅ Monitor Discord for notifications

## 📚 Resources

- [Discord Webhook Documentation](https://discord.com/developers/docs/resources/webhook)
- [GitHub Actions Secrets](https://docs.github.com/en/actions/security-guides/encrypted-secrets)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)

---

*Created for ShopHub E-Commerce Platform CI/CD Pipeline*