import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { colors, radius, spacing } from '../../constants/theme';
import { AnalysisResult } from '../../types/analysis';

type SummaryDashboardProps = {
  result: AnalysisResult;
  onViewTutorial: () => void;
  onRetakePhotos: () => void;
};

export function SummaryDashboard({ result, onViewTutorial, onRetakePhotos }: SummaryDashboardProps) {
  const { bubbleWrapItems, recommendedTruck, requiredBoxes } = result;

  return (
    <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <Text style={styles.title}>Your Moving Plan</Text>
      <Text style={styles.subtitle}>Review supplies and truck size before packing.</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Bubble Wrap Needed</Text>
        {bubbleWrapItems.length === 0 ? (
          <Text style={styles.emptyText}>No fragile items detected.</Text>
        ) : (
          bubbleWrapItems.map((item) => (
            <View key={item} style={styles.listRow}>
              <Text style={styles.bullet}>🫧</Text>
              <Text style={styles.listText}>{item}</Text>
            </View>
          ))
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{requiredBoxes.length} Boxes Needed</Text>
        {requiredBoxes.map((box) => (
          <View key={box.id} style={styles.boxCard}>
            <View style={[styles.colorSwatch, { backgroundColor: box.color ?? '#3498DB' }]} />
            <View style={styles.boxInfo}>
              <Text style={styles.boxLabel}>{box.label}</Text>
              <Text style={styles.boxDimensions}>
                {box.w} × {box.h} × {box.d} ft
              </Text>
            </View>
          </View>
        ))}
      </View>

      <View style={[styles.section, styles.truckCard]}>
        <Text style={styles.truckLabel}>Recommended Truck</Text>
        <Text style={styles.truckName}>{recommendedTruck.name}</Text>
        <Text style={styles.truckDimensions}>
          Interior cargo: {recommendedTruck.width} × {recommendedTruck.height} × {recommendedTruck.depth} ft
        </Text>
        <Text style={styles.truckHint}>Width × Height × Depth (cargo length)</Text>
      </View>

      <Pressable style={styles.primaryButton} onPress={onViewTutorial}>
        <Text style={styles.primaryButtonText}>View Packing Tutorial</Text>
      </Pressable>

      <Pressable style={styles.secondaryButton} onPress={onRetakePhotos}>
        <Text style={styles.secondaryButtonText}>Retake Photos</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: spacing.lg,
    paddingBottom: spacing.xl * 2,
    gap: spacing.md,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.text,
  },
  subtitle: {
    fontSize: 15,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  section: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  emptyText: {
    color: colors.textSecondary,
    fontSize: 14,
  },
  listRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.xs,
  },
  bullet: {
    fontSize: 16,
  },
  listText: {
    fontSize: 15,
    color: colors.text,
    flex: 1,
  },
  boxCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  colorSwatch: {
    width: 18,
    height: 18,
    borderRadius: 4,
  },
  boxInfo: {
    flex: 1,
  },
  boxLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
  },
  boxDimensions: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
  truckCard: {
    backgroundColor: '#EFF6FF',
    borderColor: '#BFDBFE',
  },
  truckLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  truckName: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.text,
    marginTop: spacing.xs,
  },
  truckDimensions: {
    fontSize: 15,
    color: colors.text,
    marginTop: spacing.sm,
  },
  truckHint: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  primaryButton: {
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  secondaryButton: {
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  secondaryButtonText: {
    color: colors.textSecondary,
    fontSize: 15,
    fontWeight: '600',
  },
});
