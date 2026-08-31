# 🚀 Quick Start Guide - Crop Disease Identifier

## 📋 Pre-flight Checklist

Your app is **ready to run** except for 2 manual Supabase setup steps.

## ⚡ 5-Minute Setup

### Step 1: Database Schema (2 minutes)

1. Open [Supabase Dashboard](https://app.supabase.com)
2. Go to **SQL Editor**
3. Click **New Query**
4. Copy entire contents of `SUPABASE_MIGRATION.sql`
5. Paste and click **Run**
6. ✅ You should see "Success. No rows returned"

### Step 2: Storage Bucket (1 minute)

1. In Supabase Dashboard, go to **Storage**
2. Click **Create bucket**
3. Name: `scans`
4. Visibility: **Private** (important!)
5. Click **Create bucket**
6. ✅ Done! No policies needed.

### Step 3: Run the App (1 minute)

```bash
npm run dev
```

Then:
- Press `w` to open in web browser (limited camera support)
- **OR** scan QR code with Expo Go app on your phone (recommended)
- **OR** press `a`/`i` for Android/iOS emulator

## 🎯 Test the App

### Create Account
1. Click **Sign Up**
2. Enter name, email, password
3. Click **Sign Up**
4. Click **Sign In** and log in

### Scan a Plant
1. On home screen, press big green **स्कैन करें** button
2. Grant camera permission if asked
3. Take a photo OR click gallery icon
4. Preview photo → press **Use Photo**
5. Wait 2-3 seconds for processing
6. View results with predictions and remedies!

### View History
1. Tap **History** tab at bottom
2. See all your scans
3. Tap any card to view details again

## ✅ Verification

Everything working if you can:
- ✅ Sign up and sign in
- ✅ Capture/upload a photo
- ✅ See prediction results
- ✅ View scan in history tab
- ✅ Sign out from settings

## 🐛 Common Issues

**"Cannot find module @react-navigation/stack"**
```bash
npm install
```

**Camera not working in browser**
- Use your phone with Expo Go app instead
- Or use Android/iOS emulator

**Supabase error "relation does not exist"**
- Run the SQL migration from `SUPABASE_MIGRATION.sql`

**"Failed to upload image"**
- Create the `scans` storage bucket
- Ensure bucket is **Private**

## 📱 Mobile Testing (Best Experience)

1. Install [Expo Go](https://expo.dev/client) on your phone
2. Run `npm run dev` on your computer
3. Scan the QR code with:
   - iOS: Camera app
   - Android: Expo Go app
4. App loads on your phone!

## 🎨 Current Features

**Working:**
- ✅ User authentication
- ✅ Camera capture
- ✅ Gallery upload
- ✅ Image processing
- ✅ Mock predictions (shows 3 results)
- ✅ Scan history
- ✅ Language toggle
- ✅ Bilingual UI (Hindi/English)

**Mock Data:**
- Returns: Healthy (85%), Early Blight (10%), Leaf Spot (5%)
- This is placeholder until you integrate real ML model

## 🤖 Next: Add Real ML Model

Replace mock predictions in `src/services/apiService.ts`:

**Option A - Your API:**
```typescript
// Update this in apiService.ts
const PREDICTION_API_URL = 'https://your-api.com/predict';
```

**Option B - On-Device:**
```bash
npm install tflite-react-native
# Then load .tflite model in app
```

## 📚 Full Documentation

- `README.md` - Complete feature list and guide
- `SETUP.md` - Detailed setup instructions
- `PROJECT_SUMMARY.md` - Technical implementation details
- `SUPABASE_MIGRATION.sql` - Database schema

## 🎉 You're Ready!

Your Crop Disease Identifier app is fully functional. All features work except the ML model is using mock predictions.

**Happy farming! 🌱**
