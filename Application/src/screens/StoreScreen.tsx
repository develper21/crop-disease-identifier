import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, TextInput, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { listProducts, Product } from '../services/storeService';
import { colors, spacing, borderRadius, fontSizes } from '../styles/theme';

export default function StoreScreen({ navigation }: any) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<string | undefined>();
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const doSearch = useCallback(async () => {
    setError(null);
    setLoading(true);
    try {
      const data = await listProducts({ query, category });
      setResults(data);
    } catch (e: any) {
      setError(e?.message || 'Failed to load');
    } finally {
      setLoading(false);
    }
  }, [query, category]);

  useEffect(() => {
    doSearch();
  }, [doSearch]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>स्टोर</Text>
        <Text style={styles.subtitle}>Store - Organic & Inorganic Medicines</Text>
      </View>

      <View style={styles.filters}>
        <TextInput
          style={styles.input}
          placeholder="Search medicines..."
          value={query}
          onChangeText={setQuery}
          onSubmitEditing={doSearch}
          returnKeyType="search"
        />
        <View style={styles.chipsRow}>
          {['all', 'organic', 'inorganic'].map((c) => (
            <TouchableOpacity
              key={c}
              style={[styles.chip, (category ?? 'all') === c && styles.chipActive]}
              onPress={() => {
                setCategory(c === 'all' ? undefined : c);
                setTimeout(doSearch, 0);
              }}
            >
              <Text style={[styles.chipText, (category ?? 'all') === c && styles.chipTextActive]}>
                {c}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <FlatList
        data={results}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={{ padding: spacing.lg }}
        refreshing={loading}
        onRefresh={doSearch}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('ProductDetail', { id: item.id })}
          >
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.meta}>Category: {item.category}</Text>
            {item.target_diseases?.length ? (
              <Text style={styles.meta}>Targets: {item.target_diseases.join(', ')}</Text>
            ) : null}
            {item.price != null ? (
              <Text style={styles.price}>₹ {item.price.toFixed(2)}</Text>
            ) : null}
            {item.description ? (
              <Text style={styles.desc} numberOfLines={2}>{item.description}</Text>
            ) : null}
          </TouchableOpacity>
        )}
      />
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
  filters: {
    padding: spacing.lg,
  },
  input: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    fontSize: fontSizes.md,
    color: colors.text,
  },
  chipsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: spacing.md,
  },
  chip: {
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 999,
    backgroundColor: colors.surface,
  },
  chipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  chipText: {
    color: colors.text,
  },
  chipTextActive: {
    color: colors.surface,
    fontWeight: '600',
  },
  error: {
    color: 'red',
    paddingHorizontal: spacing.lg,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  name: {
    fontSize: fontSizes.lg,
    fontWeight: '700',
    color: colors.text,
  },
  meta: {
    marginTop: spacing.xs,
    color: colors.textSecondary,
    fontSize: fontSizes.sm,
  },
  desc: {
    marginTop: spacing.sm,
    color: colors.text,
    fontSize: fontSizes.md,
  },
  price: {
    marginTop: spacing.sm,
    color: colors.primary,
    fontSize: fontSizes.md,
    fontWeight: '700',
  },
});


