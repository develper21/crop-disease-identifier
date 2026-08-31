import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, spacing, borderRadius, fontSizes } from '../styles/theme';
import { formatDate, getConfidenceLabel, getConfidenceColor } from '../utils/helpers';

interface ScanCardProps {
  imageUrl: string;
  prediction: any;
  confidence: number;
  createdAt: string;
  onPress: () => void;
}

export function ScanCard({ imageUrl, prediction, confidence, createdAt, onPress }: ScanCardProps) {
  const topPrediction = prediction?.predictions?.[0] || prediction?.[0];
  const diseaseName = topPrediction?.name || 'Unknown';
  const confidenceLabel = getConfidenceLabel(confidence);
  const confidenceColor = getConfidenceColor(confidence);

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <Image source={{ uri: imageUrl }} style={styles.image} />
      <View style={styles.content}>
        <Text style={styles.diseaseName} numberOfLines={1}>
          {diseaseName}
        </Text>
        <Text style={styles.date}>{formatDate(createdAt)}</Text>
        <View style={styles.confidenceContainer}>
          <Text style={[styles.confidence, { color: confidenceColor }]}>
            {confidenceLabel} ({Math.round(confidence * 100)}%)
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.sm,
    marginBottom: spacing.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.border,
  },
  content: {
    flex: 1,
    marginLeft: spacing.md,
    justifyContent: 'space-between',
  },
  diseaseName: {
    fontSize: fontSizes.md,
    fontWeight: '600',
    color: colors.text,
  },
  date: {
    fontSize: fontSizes.sm,
    color: colors.textSecondary,
  },
  confidenceContainer: {
    alignSelf: 'flex-start',
  },
  confidence: {
    fontSize: fontSizes.sm,
    fontWeight: '600',
  },
});
