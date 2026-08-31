import React, { useState } from 'react';
import { View, Image, StyleSheet, Alert } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { uploadImage, saveScanRecord } from '../services/scanService';
import { getPredictionFromApi } from '../services/apiService';
import { PrimaryButton } from '../components/PrimaryButton';
import { colors, spacing } from '../styles/theme';
import { CONFIDENCE_THRESHOLD } from '../utils/constants';

export default function PreviewScreen({ route, navigation }: any) {
  const { imageUri } = route.params;
  const { user } = useAuth();
  const [uploading, setUploading] = useState(false);

  async function handleUsePhoto() {
    if (!user) {
      Alert.alert('Error', 'You must be signed in');
      return;
    }

    setUploading(true);

    try {
      const { publicURL } = await uploadImage(user.id, imageUri);

      const predictionResult = await getPredictionFromApi(publicURL);

      const topPrediction = predictionResult.predictions[0];
      const confidence = topPrediction.confidence;
      const isLowConf = confidence < CONFIDENCE_THRESHOLD;

      const scanRecord = await saveScanRecord({
        user_id: user.id,
        image_url: publicURL,
        prediction: predictionResult,
        confidence: confidence,
        is_low_conf: isLowConf,
      });

      setUploading(false);

      navigation.navigate('Result', {
        scanId: scanRecord.id,
        predictions: predictionResult.predictions,
        imageUrl: publicURL,
        isLowConf,
      });
    } catch (error: any) {
      setUploading(false);
      console.error('Upload error:', error);
      Alert.alert('Error', error.message || 'Failed to process image');
    }
  }

  function handleRetake() {
    navigation.goBack();
  }

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: imageUri }} style={styles.image} resizeMode="contain" />
      </View>

      <View style={styles.actions}>
        <PrimaryButton title="Use Photo" onPress={handleUsePhoto} loading={uploading} />
        <PrimaryButton
          title="Retake"
          onPress={handleRetake}
          variant="outline"
          disabled={uploading}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  actions: {
    padding: spacing.lg,
    gap: spacing.md,
  },
});
