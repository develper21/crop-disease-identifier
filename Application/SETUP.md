# Crop Disease Identifier - Setup Guide

## Prerequisites

- Node.js 16+
- Expo CLI (`npm install -g expo-cli`)
- Supabase account

## Installation

1. Install dependencies:
```bash
npm install
```

## Supabase Setup

### 1. Database Schema

Run this SQL in your Supabase SQL Editor to create the database schema:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles table (linked to auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id uuid REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name text,
  phone text,
  preferred_language text DEFAULT 'hi',
  created_at timestamptz DEFAULT now()
);

-- Crops table
CREATE TABLE IF NOT EXISTS crops (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  scientific_name text,
  created_at timestamptz DEFAULT now()
);

-- Diseases table
CREATE TABLE IF NOT EXISTS diseases (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  crop_id uuid REFERENCES crops(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  remedies jsonb,
  created_at timestamptz DEFAULT now()
);

-- Scans (history)
CREATE TABLE IF NOT EXISTS scans (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  crop_id uuid REFERENCES crops(id),
  image_url text,
  prediction jsonb,
  confidence numeric,
  notes text,
  is_low_conf boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_scans_user_id ON scans (user_id);
CREATE INDEX IF NOT EXISTS idx_scans_created_at ON scans (created_at DESC);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE crops ENABLE ROW LEVEL SECURITY;
ALTER TABLE diseases ENABLE ROW LEVEL SECURITY;
ALTER TABLE scans ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Crops policies (read-only for authenticated users)
CREATE POLICY "Authenticated users can view crops"
  ON crops FOR SELECT
  TO authenticated
  USING (true);

-- Diseases policies (read-only for authenticated users)
CREATE POLICY "Authenticated users can view diseases"
  ON diseases FOR SELECT
  TO authenticated
  USING (true);

-- Scans policies
CREATE POLICY "Users can insert own scans"
  ON scans FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own scans"
  ON scans FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own scans"
  ON scans FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Insert sample crops and diseases
INSERT INTO crops (name, scientific_name) VALUES
  ('Tomato', 'Solanum lycopersicum'),
  ('Okra', 'Abelmoschus esculentus')
ON CONFLICT DO NOTHING;

INSERT INTO diseases (crop_id, name, description, remedies)
SELECT
  c.id,
  'Healthy',
  'Plant appears healthy with no visible disease symptoms.',
  '["Continue regular watering and fertilization", "Monitor for any changes", "Maintain good air circulation"]'::jsonb
FROM crops c WHERE c.name = 'Tomato'
ON CONFLICT DO NOTHING;

INSERT INTO diseases (crop_id, name, description, remedies)
SELECT
  c.id,
  'Early Blight',
  'Fungal disease causing dark spots with concentric rings on older leaves.',
  '["Remove and destroy infected leaves", "Apply fungicide containing chlorothalonil", "Improve air circulation", "Avoid overhead watering", "Rotate crops yearly"]'::jsonb
FROM crops c WHERE c.name = 'Tomato'
ON CONFLICT DO NOTHING;
```

### 2. Storage Bucket

1. Go to Supabase Dashboard > Storage
2. Create a new bucket named `scans`
3. Set bucket to **private** (not public)
4. No additional policies needed (handled by RLS)

### 3. Environment Variables

Your `.env` file already contains:
```
EXPO_PUBLIC_SUPABASE_URL=https://0ec90b57d6e95fcbda19832f.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
```

These are already configured and working.

## Running the App

### Development Mode

```bash
npm run dev
```

This will start the Expo development server. You can then:
- Press `w` to open in web browser
- Scan QR code with Expo Go app on your phone
- Press `a` for Android emulator
- Press `i` for iOS simulator

### Testing Web Version

The web version will work but camera functionality is limited. For full testing:
- Use a real device with Expo Go app
- Or use an emulator/simulator

## Features

- **Authentication**: Email/password sign up and sign in
- **Camera**: Capture plant photos with overlay guide
- **Gallery**: Select photos from device gallery
- **Disease Detection**: Upload and analyze plant images (currently uses mock predictions)
- **Scan History**: View all previous scans
- **Bilingual**: Hindi and English support
- **Results**: Top-3 predictions with confidence scores and remedies

## Project Structure

```
src/
├── lib/              # Supabase client
├── services/         # API services (auth, scan, prediction)
├── screens/          # All app screens
├── components/       # Reusable UI components
├── context/          # React context (Auth, App)
├── navigation/       # (integrated in App.tsx)
├── utils/            # Helper functions and constants
└── styles/           # Theme and styling
```

## Next Steps

1. **ML Model Integration**: Replace mock predictions with real model
   - Train model using PlantVillage dataset
   - Export as TensorFlow Lite or create REST API
   - Update `src/services/apiService.ts`

2. **Add More Crops**: Insert more crop and disease data in Supabase

3. **Expert Review**: Build admin panel for low-confidence scans

4. **Offline Support**: Queue scans when offline, sync when online

5. **Notifications**: Alert users when expert reviews are available

## Troubleshooting

### Camera not working
- Check permissions in device settings
- Ensure using physical device or proper emulator

### Supabase errors
- Verify `.env` file exists and has correct values
- Check Supabase dashboard for table/bucket creation
- Ensure RLS policies are applied

### Build errors
- Run `npm install` to ensure all dependencies are installed
- Clear cache: `expo start -c`
- Delete `node_modules` and reinstall

## Support

For issues or questions about this app, refer to the original specification document or check:
- Expo documentation: https://docs.expo.dev
- Supabase documentation: https://supabase.com/docs
- React Navigation: https://reactnavigation.org/docs
