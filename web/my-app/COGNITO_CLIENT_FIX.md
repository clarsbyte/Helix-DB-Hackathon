# Fix: "Client is configured with secret but SECRET_HASH was not received"

## ❌ The Problem

Your Cognito App Client (`17os51p796tgahn21e2m054dq2`) is configured with a **client secret**, but client secrets **cannot be used securely in web browsers** because they would be exposed in the frontend code.

## ✅ The Solution: Create a Public App Client

Follow these steps to create a new App Client **without** a secret:

### Step 1: Go to AWS Cognito Console

1. Navigate to: https://console.aws.amazon.com/cognito/
2. Click on **"User pools"**
3. Select your **"HelixDB"** user pool

### Step 2: Create New App Client

1. Click the **"App integration"** tab
2. Scroll to **"App clients and analytics"** section
3. Click **"Create app client"**

### Step 3: Configure the App Client

Fill in these settings:

```
App client name: n-mapper-web-public

App type: ○ Public client  ← SELECT THIS (NOT Confidential client)

Authentication flows:
  ✅ ALLOW_USER_PASSWORD_AUTH
  ✅ ALLOW_REFRESH_TOKEN_AUTH
  ✅ ALLOW_USER_SRP_AUTH (optional)
  ☐ Don't check ALLOW_CUSTOM_AUTH unless you need it

Refresh token expiration: 30 days (default is fine)

ID token expiration: 60 minutes (default is fine)

Access token expiration: 60 minutes (default is fine)

Authentication flows session duration: 3 minutes (default is fine)

Prevent user existence errors: ✅ Enabled (recommended)
```

### Step 4: Save and Get New Client ID

1. Click **"Create app client"**
2. You'll see the new client created
3. **Copy the new Client ID** (it will be different from your current one)
4. It will look like: `1abc2def3ghi4jkl5mno6pqr7s`

### Step 5: Update Your .env.local

Replace the old Client ID in `web/my-app/.env.local`:

```env
# OLD (with secret):
NEXT_PUBLIC_USER_POOL_CLIENT_ID=17os51p796tgahn21e2m054dq2

# NEW (without secret):
NEXT_PUBLIC_USER_POOL_CLIENT_ID=your-new-client-id-here
```

### Step 6: Restart Dev Server

```bash
# Stop the server (Ctrl+C)
# Then restart:
npm run dev
```

### Step 7: Test Authentication

1. Go to http://localhost:3001/signup
2. Create a new account
3. Verify email with the code sent to your inbox
4. Login at http://localhost:3001/login
5. You should be redirected to the dashboard!

## 🔍 Why Public Client vs Confidential Client?

| Type | Use Case | Secret Required? |
|------|----------|------------------|
| **Public Client** | Web apps, Mobile apps, SPAs | ❌ No secret |
| **Confidential Client** | Backend servers, APIs | ✅ Has secret |

Since N-Mapper is a **Next.js web application** running in the browser, we need a **Public Client**.

## 🛠️ Alternative: Keep Current Client but Remove Secret

If you want to keep using client `17os51p796tgahn21e2m054dq2`:

1. Go to **App integration** → **App clients**
2. Click on your existing client `17os51p796tgahn21e2m054dq2`
3. **Unfortunately, you CANNOT remove the secret from an existing client**
4. You must create a new one (follow steps above)

## ✅ Verification

After updating `.env.local` and restarting:

1. Check browser console - you should NOT see the "SECRET_HASH" error
2. Try signing up - you should receive verification email
3. Try logging in - you should be redirected to dashboard

## 🐛 Still Having Issues?

If you still see errors:

1. **Clear browser cache and cookies**
2. **Check browser console** for specific error messages
3. **Verify User Pool ID** is correct: `us-east-2_LQv12lI7y`
4. **Verify new Client ID** is from a Public Client (no secret)
5. **Restart dev server** after changing `.env.local`

---

**Once fixed, delete the old App Client** (the one with secret) to keep your Cognito setup clean.
