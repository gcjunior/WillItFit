import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PackingStepSlider } from '../components/packing/PackingStepSlider';
import { TruckCanvas } from '../components/packing/TruckCanvas';
import { colors, radius, spacing } from '../constants/theme';
import { useAnalysis } from '../context/AnalysisContext';

export default function PackingScreen() {
  const { result } = useAnalysis();
  const [currentStep, setCurrentStep] = useState(1);

  useEffect(() => {
    if (!result) {
      router.replace('/');
    }
  }, [result]);

  if (!result) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()}>
          <Text style={styles.backText}>← Back</Text>
        </Pressable>
        <Text style={styles.title}>Packing Tutorial</Text>
        <Text style={styles.subtitle}>Drag the slider to place each box inside the truck.</Text>
      </View>

      <View style={styles.canvasWrap}>
        <TruckCanvas result={result} currentStep={currentStep} />
      </View>

      <PackingStepSlider
        boxes={result.requiredBoxes}
        currentStep={currentStep}
        onStepChange={setCurrentStep}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.sm,
  },
  backText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.text,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  canvasWrap: {
    flex: 1,
    marginHorizontal: spacing.md,
    marginBottom: spacing.sm,
    borderRadius: radius.lg,
    overflow: 'hidden',
    backgroundColor: '#E2E8F0',
  },
});
