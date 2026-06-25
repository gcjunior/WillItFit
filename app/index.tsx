import { router } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { MultiPhotoCamera } from '../components/camera/MultiPhotoCamera';
import { USE_MOCK } from '../constants/config';
import { colors, radius, spacing } from '../constants/theme';
import { useAnalysis } from '../context/AnalysisContext';

export default function CameraScreen() {
  const { photos, loading, error, addPhoto, removePhoto, analyzePhotos } = useAnalysis();

  const runAnalysis = async () => {
    const success = await analyzePhotos();
    if (success) {
      router.push('/summary');
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <Text style={styles.title}>Will It Fit?</Text>
        <Text style={styles.subtitle}>Photograph your items room by room.</Text>
      </View>

      <View style={styles.cameraWrap}>
        <MultiPhotoCamera photos={photos} onCapture={addPhoto} onRemove={removePhoto} />
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <View style={styles.actions}>
        <Pressable
          style={[styles.analyzeButton, (photos.length === 0 || loading) && styles.buttonDisabled]}
          onPress={runAnalysis}
          disabled={photos.length === 0 || loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.analyzeButtonText}>Analyze Photos</Text>
          )}
        </Pressable>

        {USE_MOCK ? (
          <Pressable style={styles.demoButton} onPress={runAnalysis} disabled={loading}>
            <Text style={styles.demoButtonText}>Run Demo (Mock Data)</Text>
          </Pressable>
        ) : null}
      </View>
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
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.text,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  cameraWrap: {
    flex: 1,
    marginHorizontal: spacing.lg,
    borderRadius: radius.lg,
    overflow: 'hidden',
    backgroundColor: '#000',
  },
  error: {
    color: colors.danger,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    fontSize: 14,
  },
  actions: {
    padding: spacing.lg,
    gap: spacing.sm,
  },
  analyzeButton: {
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  analyzeButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  demoButton: {
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  demoButtonText: {
    color: colors.textSecondary,
    fontSize: 14,
    fontWeight: '600',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
});
