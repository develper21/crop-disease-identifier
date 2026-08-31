export const STORAGE_BUCKET = 'scans';

export const LANGUAGES = {
  hi: 'हिंदी',
  en: 'English',
};

export const CONFIDENCE_THRESHOLD = 0.6;

export const PREDICTION_API_URL = process.env.EXPO_PUBLIC_PREDICTION_API_URL;

export const MOCK_PREDICTIONS = [
  { disease_id: null, name: 'Healthy', confidence: 0.85 },
  { disease_id: null, name: 'Early Blight', confidence: 0.10 },
  { disease_id: null, name: 'Leaf Spot', confidence: 0.05 },
];
