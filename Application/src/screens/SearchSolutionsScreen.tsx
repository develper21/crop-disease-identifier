import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { searchDiseaseSolutions, DiseaseSolution } from '../services/diseaseSolutionService';
import { colors, spacing, borderRadius, fontSizes } from '../styles/theme';

export default function SearchSolutionsScreen() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<DiseaseSolution[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSearch() {
    setError(null);
    setLoading(true);
    try {
      const data = await searchDiseaseSolutions(query);
      setResults(data);
    } catch (e: any) {
      setError(e?.message || 'Failed to search');
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>फसल रोग समाधान</Text>
        <Text style={styles.subtitle}>Search Disease Solutions</Text>
      </View>
      <TextInput
        style={styles.input}
        placeholder="Type common name or disease name"
        value={query}
        onChangeText={setQuery}
        onSubmitEditing={handleSearch}
        returnKeyType="search"
        autoCapitalize="none"
      />
      <TouchableOpacity onPress={handleSearch} style={styles.button} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? 'Searching...' : 'Search'}</Text>
      </TouchableOpacity>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <FlatList
        data={results}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={{ paddingVertical: spacing.md }}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.name}>{item.name}</Text>
            {item.common_names?.length ? (
              <Text style={styles.meta}>Also known as: {item.common_names.join(', ')}</Text>
            ) : null}
            {item.description ? (
              <Text style={styles.desc}>{item.description}</Text>
            ) : null}
            {item.solutions?.length ? (
              <View style={styles.solutionsBox}>
                {item.solutions.map((s, idx) => (
                  <Text key={idx} style={styles.solutionItem}>• {s}</Text>
                ))}
              </View>
            ) : null}
          </View>
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
  button: {
    marginTop: spacing.md,
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  buttonText: {
    color: colors.surface,
    fontWeight: '600',
    fontSize: fontSizes.md,
  },
  error: {
    color: 'red',
    marginTop: spacing.sm,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  name: {
    fontSize: fontSizes.lg,
    fontWeight: '700',
    color: colors.text,
  },
  meta: {
    marginTop: spacing.xs,
    fontSize: fontSizes.sm,
    color: colors.textSecondary,
  },
  desc: {
    marginTop: spacing.sm,
    fontSize: fontSizes.md,
    color: colors.text,
  },
  solutionsBox: {
    marginTop: spacing.sm,
    gap: 4,
  },
  solutionItem: {
    fontSize: fontSizes.md,
    color: colors.text,
  },
});


