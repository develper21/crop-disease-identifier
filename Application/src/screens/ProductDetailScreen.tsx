import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { getProduct, Product } from '../services/storeService';
import { colors, spacing, fontSizes } from '../styles/theme';

export default function ProductDetailScreen({ route }: any) {
  const { id } = route.params as { id: number };
  const [product, setProduct] = useState<Product | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setError(null);
    try {
      const p = await getProduct(id);
      setProduct(p);
    } catch (e: any) {
      setError(e?.message || 'Failed to load product');
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  if (error) {
    return (
      <View style={styles.container}><Text style={{ color: 'red' }}>{error}</Text></View>
    );
  }

  if (!product) {
    return (
      <View style={styles.container}><Text>Loading...</Text></View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: spacing.lg }}>
      <View style={styles.header}>
        <Text style={styles.title}>{product.name}</Text>
        <Text style={styles.subtitle}>Category: {product.category}</Text>
      </View>
      {product.target_diseases?.length ? (
        <Text style={styles.meta}>Targets: {product.target_diseases.join(', ')}</Text>
      ) : null}
      {product.price != null ? (
        <Text style={styles.price}>₹ {product.price.toFixed(2)}</Text>
      ) : null}
      {product.description ? (
        <Text style={styles.desc}>{product.description}</Text>
      ) : null}
      <Text style={styles.note}>Note: Buying is disabled. This is a catalog-only view.</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    marginBottom: spacing.md,
  },
  title: {
    fontSize: fontSizes.xl,
    fontWeight: '700',
    color: colors.text,
  },
  subtitle: {
    marginTop: spacing.xs,
    fontSize: fontSizes.sm,
    color: colors.textSecondary,
  },
  meta: {
    marginTop: spacing.xs,
    fontSize: fontSizes.sm,
    color: colors.textSecondary,
  },
  desc: {
    marginTop: spacing.md,
    fontSize: fontSizes.md,
    color: colors.text,
  },
  price: {
    marginTop: spacing.sm,
    fontSize: fontSizes.lg,
    color: colors.primary,
    fontWeight: '700',
  },
  note: {
    marginTop: spacing.lg,
    fontSize: fontSizes.sm,
    color: colors.textSecondary,
  },
});


