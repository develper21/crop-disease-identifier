import { useState } from 'react';
import { View, Text, TextInput, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { searchDiseaseSolutions, DiseaseSolution } from '../services/diseaseSolutionService';
import { useApp } from '../context/AppContext';
import { spacing, borderRadius, fontSizes } from '../styles/theme';

export default function SearchSolutionsScreen() {
  const { colors } = useApp();
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
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.primary }]}>
        <Text style={[styles.title, { color: colors.surface }]}>फसल रोग समाधान</Text>
        <Text style={[styles.subtitle, { color: colors.surface }]}>Search Disease Solutions</Text>
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          style={[styles.input, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text }]}
          placeholder="Type common name or disease name"
          placeholderTextColor={colors.textSecondary}
          value={query}
          onChangeText={setQuery}
          onSubmitEditing={handleSearch}
          returnKeyType="search"
          autoCapitalize="none"
        />
      </View>
      <TouchableOpacity onPress={handleSearch} style={[styles.button, { backgroundColor: colors.primary }]} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? 'Searching...' : 'Search'}</Text>
      </TouchableOpacity>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <FlatList
        data={results}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={{ paddingVertical: spacing.md, paddingHorizontal: spacing.lg }}
        renderItem={({ item }) => (
          <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.name, { color: colors.text }]}>{item.name}</Text>
            {item.commonNames?.length ? (
              <Text style={[styles.meta, { color: colors.textSecondary }]}>Also known as: {item.commonNames.join(', ')}</Text>
            ) : null}
            {item.description ? (
              <Text style={[styles.desc, { color: colors.text }]}>{item.description}</Text>
            ) : null}
            {item.solutions?.length ? (
              <View style={styles.solutionsBox}>
                {item.solutions.map((s, idx) => (
                  <Text key={idx} style={[styles.solutionItem, { color: colors.text }]}>• {s}</Text>
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
  inputContainer: {
    paddingHorizontal: spacing.lg,
  },
  input: {
    borderWidth: 1,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    fontSize: fontSizes.md,
  },
  button: {
    marginTop: spacing.md,
    marginHorizontal: spacing.lg,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: fontSizes.md,
  },
  error: {
    color: 'red',
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
    marginTop: spacing.xs,
    fontSize: fontSizes.sm,
  },
  desc: {
    marginTop: spacing.sm,
    fontSize: fontSizes.md,
  },
  solutionsBox: {
    marginTop: spacing.sm,
    gap: 4,
  },
  solutionItem: {
    fontSize: fontSizes.md,
  },
});


