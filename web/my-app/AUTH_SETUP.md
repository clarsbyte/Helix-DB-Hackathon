# AWS Cognito Authentication Setup Guide

This guide will help you complete the AWS Cognito authentication setup for N-Mapper.

## 🔑 What You Need

You need to find **two values** from your AWS Cognito Console:

1. **User Pool ID**
2. **User Pool Client ID**

## 📋 Step-by-Step Instructions

### 1. Go to AWS Cognito Console

Navigate to: https://console.aws.amazon.com/cognito/

### 2. Find Your User Pool

1. In the Cognito dashboard, click **"User pools"** in the left sidebar
2. Click on your user pool named **"HelixDB"** (or similar)

### 3. Get the User Pool ID

1. Once you're viewing your user pool, look at the **top of the page**
2. You'll see **"User pool ID"** displayed
3. It will look like: `us-east-2_XXXXXXXXX`
4. Copy this value

### 4. Get the User Pool Client ID

1. Still on the same user pool page, click the **"App integration"** tab
2. Scroll down to the **"App clients and analytics"** section
3. Click on your app client (if you don't have one, create it first - see below)
4. Copy the **"Client ID"** value
5. It will look like: `1a2b3c4d5e6f7g8h9i0j1k2l3m`

### 5. Create App Client (if you don't have one)

If you don't see any app clients:

1. Click **"Create app client"**
2. Configure:
   - **App type**: Public client
   - **App client name**: `n-mapper-web`
   - **Authentication flows**:
     - ✅ ALLOW_USER_PASSWORD_AUTH
     - ✅ ALLOW_REFRESH_TOKEN_AUTH
   - **Prevent user existence errors**: Enabled
3. Click **"Create app client"**
4. Copy the generated Client ID

### 6. Update Your .env.local File

Open `web/my-app/.env.local` and replace the placeholder values:

```env
NEXT_PUBLIC_USER_POOL_ID=us-east-2_XXXXXXXXX
NEXT_PUBLIC_USER_POOL_CLIENT_ID=1a2b3c4d5e6f7g8h9i0j1k2l3m
```

**Replace:**
- `us-east-2_XXXXXXXXX` with your actual User Pool ID
- `1a2b3c4d5e6f7g8h9i0j1k2l3m` with your actual Client ID

### 7. Restart Your Dev Server

```bash
# Stop the current server (Ctrl+C)
# Then restart:
npm run dev
```

## ✅ Testing Your Setup

### Test Sign Up Flow:

1. Go to `http://localhost:3001`
2. Click **"Sign Up"** in the navigation
3. Fill out the registration form
4. You should receive a verification code email
5. Enter the code to verify your account

### Test Login Flow:

1. Go to `http://localhost:3001/login`
2. Enter your email and password
3. You should be redirected to `/app` (the dashboard)

### Test Protected Routes:

1. Try accessing `http://localhost:3001/app` without logging in
2. You should be automatically redirected to `/login`

## 🏗️ Architecture Overview

### Files Created:

```
web/my-app/
├── lib/
│   └── auth-config.ts          # AWS Cognito configuration
├── contexts/
│   └── AuthContext.tsx         # Authentication state management
├── components/
│   └── ProtectedRoute.tsx      # Route protection wrapper
├── app/
│   ├── signup/
│   │   └── page.tsx            # Sign up page with email verification
│   ├── login/
│   │   └── page.tsx            # Login page
│   └── layout.tsx              # Updated with AuthProvider
└── .env.local                  # Environment variables
```

### Authentication Flow:

```
┌─────────────┐
│   Landing   │
│    Page     │
└──────┬──────┘
       │
       ├─── Not Authenticated ──→ Sign Up / Login
       │                              │
       │                              ↓
       │                         Verification
       │                              │
       │                              ↓
       └─── Authenticated ────────→ Dashboard
                                    (Protected)
```

### Features Included:

✅ **Sign Up with Email Verification**
- Email-based registration
- AWS Cognito sends verification code
- Two-step verification process

✅ **Secure Login**
- Email/password authentication
- Session management
- Automatic redirect on success

✅ **Protected Routes**
- `/app` dashboard requires authentication
- Automatic redirect to login if not authenticated
- Loading states during auth checks

✅ **User State Management**
- Global auth context using React Context API
- Auth state persists across page refreshes
- User info accessible throughout the app

✅ **Sign Out Functionality**
- One-click sign out from any page
- Clears session and redirects appropriately

## 🎨 UI/UX Features

- **Glassmorphic design** matching N-Mapper branding
- **Dark theme** with emerald accents
- **Error handling** with user-friendly messages
- **Loading states** for all async operations
- **Responsive design** for all screen sizes
- **Accessibility** with proper form labels and ARIA attributes

## 🔒 Security Features

- **Secure password requirements** (min 8 characters)
- **AWS Cognito security** (managed authentication)
- **HTTPS encryption** (in production)
- **No password storage** in frontend
- **Token-based sessions**
- **Automatic session refresh**

## 🐛 Troubleshooting

### "User Pool ID not found"
- Check that you updated `.env.local` with correct values
- Restart dev server after updating `.env.local`

### "Invalid client ID"
- Verify Client ID is from the correct User Pool
- Ensure app client has correct authentication flows enabled

### Email verification not working
- Check AWS SES (Simple Email Service) is configured
- In development, AWS Cognito uses a sandbox that may limit emails
- Check spam folder for verification emails

### Redirect loops
- Clear browser cookies/cache
- Check browser console for errors
- Verify User Pool and Identity Pool are in same region

## 📚 Additional Resources

- [AWS Amplify Docs](https://docs.amplify.aws/)
- [AWS Cognito User Pools](https://docs.aws.amazon.com/cognito/latest/developerguide/cognito-user-identity-pools.html)
- [Next.js Authentication Patterns](https://nextjs.org/docs/authentication)

## 🎯 Next Steps

After authentication is working:

1. **Add user profile page** - Display user info, edit settings
2. **Forgot password flow** - Password reset via email
3. **Social login** - Add Google/GitHub OAuth (optional)
4. **User preferences** - Save graph settings per user in Helix DB
5. **Multi-factor authentication** - Add 2FA for extra security

---

**Need Help?** Check the browser console for detailed error messages and refer to AWS Cognito documentation.
