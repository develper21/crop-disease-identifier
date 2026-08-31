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
import { useApp } from '../context/AppContext';
import { spacing, fontSizes, borderRadius } from '../styles/theme';
import { getConfidenceColor } from '../utils/helpers';

export default function ResultScreen({ route, navigation }: any) {
  const { colors } = useApp();
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
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]} showsVerticalScrollIndicator={false}>
      {/* Image Card */}
      <View style={[styles.card, { backgroundColor: colors.surface }]}>
        <Image source={{ uri: imageUrl }} style={styles.image} />
      </View>

      {/* Disease Info */}
      <View style={[styles.card, { backgroundColor: colors.surface }]}>
        <Text style={[styles.cardTitle, { color: colors.text }]}>Detected Disease:</Text>
        <Text style={[styles.diseaseName, { color: colors.text }]}>{predictions[0].name}</Text>

        <View style={styles.confidenceRow}>
          <Text style={[styles.confidenceLabel, { color: colors.textSecondary }]}>Confidence Level</Text>
          <Text style={[styles.confidenceValue, { color: colors.text }]}>
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
        <Text style={[styles.confidenceNote, { color: colors.textSecondary }]}>
          {predictions[0].confidence > 0.7
            ? 'High confidence'
            : 'Low confidence - please verify'}
        </Text>
      </View>

      {/* Remedy */}
      <View style={[styles.card, { backgroundColor: colors.surface }]}>
        <View style={styles.remedyHeader}>
          <Leaf size={18} color={colors.primary} />
          <Text style={[styles.remedyTitle, { color: colors.text }]}>Suggested Remedy</Text>
        </View>

        {predictions[0].name === 'Healthy' ? (
          <Text style={[styles.remedyItem, { color: colors.text }]}>
            ✓ Your plant looks healthy! Continue regular care and monitoring.
          </Text>
        ) : (
          <>
            <Text style={[styles.remedyItem, { color: colors.text }]}>
              • Remove affected leaves and destroy them immediately
            </Text>
            <Text style={[styles.remedyItem, { color: colors.text }]}>
              • Apply copper-based fungicide spray every 7-10 days
            </Text>
            <Text style={[styles.remedyItem, { color: colors.text }]}>
              • Improve air circulation around plants
            </Text>
            <Text style={[styles.remedyItem, { color: colors.text }]}>
              • Avoid overhead watering to reduce moisture
            </Text>
            <Text style={[styles.remedyItem, { color: colors.text }]}>
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

        <TouchableOpacity style={[styles.actionButton, { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.primary }]} onPress={() => {}}>
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
    padding: spacing.md,
  },
  card: {
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: borderRadius.md,
  },
  cardTitle: {
    fontSize: fontSizes.md,
    fontWeight: '600',
    marginBottom: spacing.sm,
  },
  diseaseName: {
    fontSize: fontSizes.xl,
    fontWeight: 'bold',
    marginBottom: spacing.md,
  },
  confidenceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  confidenceLabel: {
    fontSize: fontSizes.sm,
  },
  confidenceValue: {
    fontSize: fontSizes.md,
    fontWeight: '600',
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: spacing.sm,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  confidenceNote: {
    fontSize: fontSizes.sm,
    fontStyle: 'italic',
  },
  remedyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  remedyTitle: {
    fontSize: fontSizes.lg,
    fontWeight: 'bold',
  },
  remedyItem: {
    fontSize: fontSizes.md,
    marginBottom: spacing.sm,
    lineHeight: 22,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.md,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    gap: spacing.sm,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: fontSizes.sm,
    fontWeight: '600',
  },
});
