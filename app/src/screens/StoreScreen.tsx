import { useEffect, useState, useCallback } from 'react';
import { View, Text, TextInput, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { listProducts, Product } from '../services/storeService';
import { useApp } from '../context/AppContext';
import { spacing, borderRadius, fontSizes } from '../styles/theme';

export default function StoreScreen({ navigation }: any) {
  const { colors } = useApp();
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
    Promise.resolve().then(() => {
      doSearch();
    });
  }, [doSearch]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.primary }]}>
        <Text style={[styles.title, { color: colors.surface }]}>स्टोर</Text>
        <Text style={[styles.subtitle, { color: colors.surface }]}>Store - Organic & Inorganic Medicines</Text>
      </View>

      <View style={styles.filters}>
        <TextInput
          style={[styles.input, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text }]}
          placeholder="Search medicines..."
          placeholderTextColor={colors.textSecondary}
          value={query}
          onChangeText={setQuery}
          onSubmitEditing={doSearch}
          returnKeyType="search"
        />
        <View style={styles.chipsRow}>
          {['all', 'organic', 'inorganic'].map((c) => (
            <TouchableOpacity
              key={c}
              style={[styles.chip, { borderColor: colors.border }, (category ?? 'all') === c && { backgroundColor: colors.primary }]}
              onPress={() => {
                setCategory(c === 'all' ? undefined : c);
                setTimeout(doSearch, 0);
              }}
            >
              <Text style={[styles.chipText, { color: colors.textSecondary }, (category ?? 'all') === c && { color: colors.surface }]}>
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
            style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}
            onPress={() => navigation.navigate('ProductDetail', { id: item.id })}
          >
            <Text style={[styles.name, { color: colors.text }]}>{item.name}</Text>
            <Text style={[styles.meta, { color: colors.textSecondary }]}>Category: {item.category}</Text>
            {item.target_diseases?.length ? (
              <Text style={[styles.meta, { color: colors.textSecondary }]}>Targets: {item.target_diseases.join(', ')}</Text>
            ) : null}
            {item.price != null ? (
              <Text style={[styles.price, { color: colors.primary }]}>₹ {(item.price / 100).toFixed(2)}</Text>
            ) : null}
            {item.description ? (
              <Text style={[styles.desc, { color: colors.text }]} numberOfLines={2}>{item.description}</Text>
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
  },
  header: {
    paddingTop: spacing.xxl,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
  },
  title: {
    fontSize: fontSizes.xl,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: fontSizes.md,
    textAlign: 'center',
    marginTop: spacing.xs,
    opacity: 0.9,
  },
  filters: {
    padding: spacing.lg,
  },
  input: {
    borderWidth: 1,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    fontSize: fontSizes.md,
  },
  chipsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    borderWidth: 1,
  },
  chipText: {
    fontSize: fontSizes.sm,
  },
  error: {
    color: 'red',
    marginHorizontal: spacing.lg,
    marginTop: spacing.sm,
  },
  card: {
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
  },
  name: {
    fontSize: fontSizes.lg,
    fontWeight: '700',
  },
  meta: {
    fontSize: fontSizes.sm,
    marginTop: spacing.xs,
  },
  price: {
    fontSize: fontSizes.lg,
    fontWeight: '700',
    marginTop: spacing.sm,
  },
  desc: {
    fontSize: fontSizes.md,
    marginTop: spacing.sm,
  },
});
