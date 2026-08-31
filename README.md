# 🌱 Crop Disease Identifier

A mobile app built with React Native and Expo that helps farmers identify plant diseases from photos using machine learning and provides actionable remedies in Hindi and English.

## ✨ Features

- 📸 **Camera Integration** - Capture plant photos with guided overlay
- 🖼️ **Gallery Support** - Upload existing photos from device
- 🤖 **Disease Detection** - ML-powered disease identification (currently mock)
- 📊 **Confidence Scores** - Top-3 predictions with confidence percentages
- 💊 **Treatment Remedies** - Step-by-step remedies for detected diseases
- 📜 **Scan History** - Save and review all previous scans
- 🌐 **Bilingual** - Full Hindi and English support
- 🔐 **User Authentication** - Secure sign up/sign in with Supabase
- 🎨 **Farmer-First Design** - Large buttons, clear labels, high contrast

## 🚀 Quick Start

### Prerequisites

- Node.js 16+
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- Supabase account

### Installation

1. Clone and install dependencies:
```bash
npm install
```

2. Environment is already configured in `.env`:
```
EXPO_PUBLIC_SUPABASE_URL=https://0ec90b57d6e95fcbda19832f.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
```

3. Set up Supabase database (see [Database Setup](#database-setup))

4. Start the development server:
```bash
npm run dev
```

## 🗄️ Database Setup

### Step 1: Run SQL Migration

Go to your Supabase Dashboard > SQL Editor and run the SQL from `SUPABASE_MIGRATION.sql`:

```sql
-- Creates tables: profiles, crops, diseases, scans
-- Sets up RLS policies for security
-- Adds sample crop and disease data
```

### Step 2: Create Storage Bucket

1. Go to Supabase Dashboard > Storage
2. Click "Create bucket"
3. Name: `scans`
4. Visibility: **Private**
5. Click "Create"

That's it! The app is now ready to use.

## 📱 Running the App

### Web (Limited Camera Support)
```bash
npm run dev
```
Then press `w` to open in browser

### Mobile (Recommended)

**Option 1 - Expo Go App:**
1. Install Expo Go on your phone
2. Run `npm run dev`
3. Scan QR code with Expo Go

**Option 2 - Emulator:**
- Android: Press `a` (requires Android Studio)
- iOS: Press `i` (requires Xcode on macOS)

## 🏗️ Project Structure

```
src/
├── lib/
│   └── supabase.ts          # Supabase client configuration
├── services/
│   ├── authService.ts       # Authentication (sign up, sign in, sign out)
│   ├── scanService.ts       # Image upload & scan record management
│   └── apiService.ts        # ML prediction API calls (mock)
├── screens/
│   ├── SignInScreen.tsx     # User sign in
│   ├── SignUpScreen.tsx     # User registration
│   ├── HomeScreen.tsx       # Main screen with scan button
│   ├── CameraScreen.tsx     # Camera capture with overlay guide
│   ├── PreviewScreen.tsx    # Image preview before processing
│   ├── ResultScreen.tsx     # Prediction results & remedies
│   ├── HistoryScreen.tsx    # Scan history list
│   └── SettingsScreen.tsx   # User settings & sign out
├── components/
│   ├── PrimaryButton.tsx    # Reusable button component
│   ├── Loader.tsx           # Loading indicator
│   └── ScanCard.tsx         # History list item card
├── context/
│   ├── AuthContext.tsx      # Global auth state
│   └── AppContext.tsx       # App settings (language)
├── utils/
│   ├── constants.ts         # App constants
│   └── helpers.ts           # Utility functions
├── styles/
│   └── theme.ts             # Color palette & spacing
└── App.tsx                  # Navigation & app entry point
```

## 🎨 Design System

### Colors
- **Primary**: `#2E7D32` (Deep Green)
- **Secondary**: `#A27A52` (Earth Brown)
- **Accent**: `#FFB300` (Warm Yellow)
- **Background**: `#F5F5F5`
- **Surface**: `#FFFFFF`

### Typography
- Hindi: System Devanagari font
- English: System default (Roboto on Android)

## 🔄 User Flow

1. **Sign Up/Sign In** → Create account or log in
2. **Home Screen** → Press big scan button
3. **Camera Screen** → Capture photo or select from gallery
4. **Preview** → Confirm or retake photo
5. **Processing** → Upload & analyze (2-3 seconds)
6. **Results** → View predictions, confidence, remedies
7. **History** → Access all previous scans

## 🧪 Current Limitations

1. **Mock Predictions**: ML model not integrated yet
   - Returns fixed mock results (Healthy, Early Blight, Leaf Spot)
   - Replace in `src/services/apiService.ts`

2. **Limited Crops**: Only Tomato and Okra in database
   - Add more via SQL inserts

3. **Web Camera**: Limited browser camera support
   - Use mobile device for best experience

## 🔧 Next Steps

### 1. Integrate Real ML Model

**Option A - On-Device (TensorFlow Lite)**
```bash
npm install tflite-react-native
```
- Train model with PlantVillage dataset
- Export as `.tflite` file
- Update `apiService.ts` to use local inference

**Option B - Server API (Flask/FastAPI)**
- Deploy inference server on Render/Railway
- Update `EXPO_PUBLIC_PREDICTION_API_URL` in `.env`
- Modify `apiService.ts` to call your endpoint

### 2. Add More Crop Data

```sql
INSERT INTO crops (name, scientific_name) VALUES
  ('Potato', 'Solanum tuberosum'),
  ('Pepper', 'Capsicum annuum');

INSERT INTO diseases (crop_id, name, description, remedies)
SELECT id, 'Disease Name', 'Description', '["Remedy 1", "Remedy 2"]'::jsonb
FROM crops WHERE name = 'Potato';
```

### 3. Build Expert Review System

- Create admin dashboard
- Query low-confidence scans (`is_low_conf = true`)
- Allow experts to validate/correct predictions
- Notify users when reviewed

### 4. Offline Support

```bash
npm install @react-native-async-storage/async-storage
```
- Queue scans locally when offline
- Sync when connection restored
- Show offline indicator

### 5. Push Notifications

```bash
npm install expo-notifications
```
- Notify when expert review complete
- Alert for disease outbreaks in area

## 📊 Database Schema

### Tables

**profiles**
- User information linked to Supabase auth
- Stores language preference

**crops**
- Supported crop types (Tomato, Okra, etc.)
- Scientific names

**diseases**
- Disease catalog with descriptions
- JSON remedies array (multilingual)

**scans**
- User scan history
- Image URLs, predictions, confidence
- Low-confidence flag for expert review

### Security (RLS)

- ✅ Users can only access their own scans
- ✅ Users can only modify their own profile
- ✅ All users can read crops & diseases
- ✅ Images stored in private bucket

## 🐛 Troubleshooting

### Camera Permission Denied
- Check device settings
- Uninstall and reinstall app
- On iOS: Settings > Privacy > Camera
- On Android: Settings > Apps > Permissions

### Supabase Connection Error
- Verify `.env` file exists
- Check Supabase project is not paused
- Ensure RLS policies are created

### TypeScript Errors
```bash
npm run typecheck
```

### Build Errors
```bash
# Clear cache
expo start -c

# Reinstall dependencies
rm -rf node_modules
npm install
```

## 📚 Resources

- [Expo Documentation](https://docs.expo.dev)
- [Supabase Documentation](https://supabase.com/docs)
- [React Navigation](https://reactnavigation.org)
- [PlantVillage Dataset](https://github.com/spMohanty/PlantVillage-Dataset)
- [TensorFlow Lite](https://www.tensorflow.org/lite)

## 🤝 Contributing

This is a hackathon project. To add features:

1. Fork the repository
2. Create feature branch
3. Make changes following existing patterns
4. Test on physical device
5. Submit pull request

## 📄 License

MIT License - Free for educational and commercial use

## 👥 Credits

Built for farmers to help identify crop diseases early and take preventive action.

**Tech Stack:**
- React Native + Expo
- TypeScript
- Supabase (Auth, Database, Storage)
- React Navigation
- Lucide Icons

---