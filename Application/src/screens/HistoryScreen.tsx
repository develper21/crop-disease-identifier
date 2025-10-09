import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { getUserScans } from '../services/scanService';
import { ScanCard } from '../components/ScanCard';
import { Loader } from '../components/Loader';
import { colors, spacing, fontSizes } from '../styles/theme';

export default function HistoryScreen({ navigation }: any) {
  const { user } = useAuth();
  const [scans, setScans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadScans();  
  }, []);

  async function loadScans() {
    if (!user) return;

    try {
      const data = await getUserScans(user.id);
      setScans(data);
    } catch (error) {
      console.error('Error loading scans:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleRefresh() {
    setRefreshing(true);
    await loadScans();
    setRefreshing(false);
  }

  function handleScanPress(scan: any) {
    navigation.navigate('Result', {
      scanId: scan.id,
      predictions: scan.prediction?.predictions || scan.prediction,
      imageUrl: scan.image_url,
      isLowConf: scan.is_low_conf,
    });
  }

  if (loading) {
    return <Loader message="Loading history..." />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>स्कैन इतिहास</Text>
        <Text style={styles.subtitle}>Scan History</Text>
      </View>

      {scans.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No scans yet</Text>
          <Text style={styles.emptySubtext}>Start by scanning your first plant!</Text>
        </View>
      ) : (
        <FlatList
          data={scans}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ScanCard
              imageUrl={item.image_url}
              prediction={item.prediction}
              confidence={item.confidence}
              createdAt={item.created_at}
              onPress={() => handleScanPress(item)}
            />
          )}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingTop: spacing.xxl,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
    backgroundColor: colors.primary,
  },
  title: {
    fontSize: fontSizes.xl,
    fontWeight: 'bold',
    color: colors.surface,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: fontSizes.md,
    color: colors.surface,
    textAlign: 'center',
    marginTop: spacing.xs,
    opacity: 0.9,
  },
  list: {
    padding: spacing.lg,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  emptyText: {
    fontSize: fontSizes.lg,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  emptySubtext: {
    fontSize: fontSizes.md,
    color: colors.textSecondary,
  },
});
