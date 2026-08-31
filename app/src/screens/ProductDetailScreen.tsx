import { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { getProduct, Product } from '../services/storeService';
import { colors, spacing, fontSizes, borderRadius } from '../styles/theme';
import { ShoppingCart, ArrowLeft } from 'lucide-react-native';

export default function ProductDetailScreen({ route, navigation }: any) {
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
    Promise.resolve().then(() => {
      load();
    });
  }, [load]);

  if (error) {
    return (
      <View style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      </View>
    );
  }

  if (!product) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header with back button */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <ArrowLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Product Details</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Product Image */}
      <View style={styles.imageContainer}>
        {product.image_url ? (
          <Image source={{ uri: product.image_url }} style={styles.productImage} />
        ) : (
          <View style={styles.placeholderImage}>
            <ShoppingCart size={48} color={colors.textSecondary} />
          </View>
        )}
      </View>

      {/* Product Info Card */}
      <View style={styles.infoCard}>
        <Text style={styles.category}>{product.category}</Text>
        <Text style={styles.title}>{product.name}</Text>
        
        {product.price != null && (
          <View style={styles.priceContainer}>
            <Text style={styles.price}>₹ {(product.price / 100).toFixed(2)}</Text>
          </View>
        )}

        {product.description && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.description}>{product.description}</Text>
          </View>
        )}

        {product.target_diseases?.length ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Target Diseases</Text>
            <View style={styles.tagsContainer}>
              {product.target_diseases.map((disease, index) => (
                <View key={index} style={styles.tag}>
                  <Text style={styles.tagText}>{disease}</Text>
                </View>
              ))}
            </View>
          </View>
        ) : null}

        {/* Buy Button (Disabled) */}
        <TouchableOpacity style={styles.buyButton} disabled={true}>
          <ShoppingCart size={20} color={colors.surface} />
          <Text style={styles.buyButtonText}>Add to Cart</Text>
        </TouchableOpacity>
        
        <Text style={styles.note}>Catalog view only - purchasing disabled</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  errorText: {
    color: 'red',
    fontSize: fontSizes.md,
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: fontSizes.md,
    color: colors.textSecondary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing.md,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    padding: spacing.sm,
  },
  headerTitle: {
    fontSize: fontSizes.lg,
    fontWeight: '700',
    color: colors.text,
  },
  headerSpacer: {
    width: 40,
  },
  imageContainer: {
    backgroundColor: colors.surface,
    padding: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 200,
  },
  productImage: {
    width: '100%',
    height: 200,
    borderRadius: borderRadius.md,
    resizeMode: 'cover',
  },
  placeholderImage: {
    width: '100%',
    height: 200,
    borderRadius: borderRadius.md,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.border,
    borderStyle: 'dashed',
  },
  infoCard: {
    backgroundColor: colors.surface,
    margin: spacing.lg,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  category: {
    fontSize: fontSizes.sm,
    color: colors.primary,
    fontWeight: '600',
    textTransform: 'uppercase',
    marginBottom: spacing.xs,
  },
  title: {
    fontSize: fontSizes.xl,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.md,
  },
  priceContainer: {
    marginBottom: spacing.lg,
  },
  price: {
    fontSize: fontSizes.xl,
    color: colors.primary,
    fontWeight: '700',
  },
  section: {
    marginTop: spacing.lg,
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: fontSizes.md,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  description: {
    fontSize: fontSizes.md,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  tag: {
    backgroundColor: colors.background,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  tagText: {
    fontSize: fontSizes.sm,
    color: colors.textSecondary,
  },
  buyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  buyButtonText: {
    color: colors.surface,
    fontSize: fontSizes.md,
    fontWeight: '600',
    marginLeft: spacing.sm,
  },
  note: {
    fontSize: fontSizes.sm,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
});


