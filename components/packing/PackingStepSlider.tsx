import Slider from '@react-native-community/slider';
import { StyleSheet, Text, View } from 'react-native';

import { colors, radius, spacing } from '../../constants/theme';
import { RequiredBox } from '../../types/analysis';

type PackingStepSliderProps = {
  boxes: RequiredBox[];
  currentStep: number;
  onStepChange: (step: number) => void;
};

const PLACEMENT_HINTS = [
  'Place against the back wall, left corner.',
  'Stack beside the previous box on the floor.',
  'Stack on top of the first box.',
  'Fill remaining floor space toward the front.',
];

export function PackingStepSlider({ boxes, currentStep, onStepChange }: PackingStepSliderProps) {
  const total = boxes.length;
  const activeBox = boxes[currentStep - 1];
  const hint = PLACEMENT_HINTS[(currentStep - 1) % PLACEMENT_HINTS.length];

  return (
    <View style={styles.container}>
      <Text style={styles.stepLabel}>
        Step {currentStep} of {total}
        {activeBox ? ` — ${activeBox.label}` : ''}
      </Text>
      <Text style={styles.hint}>{hint}</Text>
      <Slider
        style={styles.slider}
        minimumValue={1}
        maximumValue={total}
        step={1}
        value={currentStep}
        onValueChange={(value) => onStepChange(Math.round(value))}
        minimumTrackTintColor={colors.primary}
        maximumTrackTintColor={colors.border}
        thumbTintColor={colors.primaryDark}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.xl,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 8,
  },
  stepLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  hint: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  slider: {
    width: '100%',
    height: 40,
  },
});
