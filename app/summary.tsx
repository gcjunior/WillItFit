import { router } from 'expo-router';
import { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { SummaryDashboard } from '../components/summary/SummaryDashboard';
import { colors } from '../constants/theme';
import { useAnalysis } from '../context/AnalysisContext';

export default function SummaryScreen() {
  const { result, reset } = useAnalysis();

  useEffect(() => {
    if (!result) {
      router.replace('/');
    }
  }, [result]);

  if (!result) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <SummaryDashboard
        result={result}
        onViewTutorial={() => router.push('/packing')}
        onRetakePhotos={() => {
          reset();
          router.replace('/');
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
});
