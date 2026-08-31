import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  Share,
  TouchableOpacity,
  Animated,
} from 'react-native';
import {
  Share as ShareIcon,
  RotateCcw as RescanIcon,
  BookMarked as SaveIcon,
  Leaf,
} from 'lucide-react-native';
import { colors, spacing, fontSizes, borderRadius } from '../styles/theme';
import { getConfidenceColor } from '../utils/helpers';

export default function ResultScreen({ route, navigation }: any) {
  const { predictions, imageUrl } = route.params;

  async function handleShare() {
    try {
      const topPrediction = predictions[0];
      await Share.share({
        message: `Disease Detection Result:\n${topPrediction.name} (${Math.round(
          topPrediction.confidence * 100
        )}% confidence)`,
      });
    } catch (error) {
      console.error('Share error:', error);
    }
  }

  function handleScanAgain() {
    navigation.navigate('MainTabs', { screen: 'Home' });
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Image Card */}
      <View style={styles.card}>
        <Image source={{ uri: imageUrl }} style={styles.image} />
      </View>

      {/* Disease Info */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Detected Disease:</Text>
        <Text style={styles.diseaseName}>{predictions[0].name}</Text>

        <View style={styles.confidenceRow}>
          <Text style={styles.confidenceLabel}>Confidence Level</Text>
          <Text style={styles.confidenceValue}>
            {Math.round(predictions[0].confidence * 100)}%
          </Text>
        </View>

        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              {
                width: `${predictions[0].confidence * 100}%`,
                backgroundColor: getConfidenceColor(predictions[0].confidence),
              },
            ]}
          />
        </View>
        <Text style={styles.confidenceNote}>
          {predictions[0].confidence > 0.7
            ? 'High confidence'
            : 'Low confidence - please verify'}
        </Text>
      </View>

      {/* Remedy */}
      <View style={styles.card}>
        <View style={styles.remedyHeader}>
          <Leaf size={18} color={colors.primary} />
          <Text style={styles.remedyTitle}>Suggested Remedy</Text>
        </View>

        {predictions[0].name === 'Healthy' ? (
          <Text style={styles.remedyItem}>
            ✓ Your plant looks healthy! Continue regular care and monitoring.
          </Text>
        ) : (
          <>
            <Text style={styles.remedyItem}>
              • Remove affected leaves and destroy them immediately
            </Text>
            <Text style={styles.remedyItem}>
              • Apply copper-based fungicide spray every 7-10 days
            </Text>
            <Text style={styles.remedyItem}>
              • Improve air circulation around plants
            </Text>
            <Text style={styles.remedyItem}>
              • Avoid overhead watering to reduce moisture
            </Text>
            <Text style={styles.remedyItem}>
              • Use resistant varieties for future planting
            </Text>
          </>
        )}
      </View>

      {/* Actions */}
      <View style={styles.actions}>
        <TouchableOpacity style={[styles.actionButton, { backgroundColor: colors.primary }]} onPress={handleScanAgain}>
          <RescanIcon size={18} color="#fff" />
          <Text style={styles.actionButtonText}>Rescan</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.actionButton, { backgroundColor: '#fff', borderWidth: 1, borderColor: colors.primary }]} onPress={() => {}}>
          <SaveIcon size={18} color={colors.primary} />
          <Text style={[styles.actionButtonText, { color: colors.primary }]}>Save to History</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.actionButton, { backgroundColor: colors.secondary }]} onPress={handleShare}>
          <ShareIcon size={18} color="#fff" />
          <Text style={styles.actionButtonText}>Share Results</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.md,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  image: {
    width: '100%',
    height: 240,
    borderRadius: borderRadius.md,
  },
  cardTitle: {
    fontSize: fontSizes.md,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  diseaseName: {
    fontSize: fontSizes.lg,
    fontWeight: '700',
    color: 'red',
    marginBottom: spacing.md,
  },
  confidenceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  confidenceLabel: {
    fontSize: fontSizes.sm,
    color: colors.text,
  },
  confidenceValue: {
    fontSize: fontSizes.sm,
    fontWeight: '700',
    color: colors.text,
  },
  progressBar: {
    height: 8,
    backgroundColor: colors.border,
    borderRadius: borderRadius.sm,
    overflow: 'hidden',
    marginBottom: spacing.sm,
  },
  progressFill: {
    height: '100%',
  },
  confidenceNote: {
    fontSize: fontSizes.xs,
    color: 'gray',
  },
  remedyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
    gap: spacing.sm,
  },
  remedyTitle: {
    fontSize: fontSizes.md,
    fontWeight: '700',
    color: colors.primary,
  },
  remedyItem: {
    fontSize: fontSizes.sm,
    color: colors.text,
    marginBottom: spacing.sm,
    lineHeight: 20,
  },
  actions: {
    gap: spacing.md,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
    gap: spacing.sm,
  },
  actionButtonText: {
    fontSize: fontSizes.md,
    fontWeight: '600',
    color: '#fff',
  },
});
