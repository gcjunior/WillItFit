import { CameraView, useCameraPermissions } from 'expo-camera';
import { useRef } from 'react';
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { MAX_PHOTOS } from '../../constants/config';
import { colors, radius, spacing } from '../../constants/theme';

type MultiPhotoCameraProps = {
  photos: string[];
  onCapture: (base64: string) => void;
  onRemove: (index: number) => void;
};

export function MultiPhotoCamera({ photos, onCapture, onRemove }: MultiPhotoCameraProps) {
  const cameraRef = useRef<CameraView>(null);
  const [permission, requestPermission] = useCameraPermissions();

  if (!permission) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.centered}>
        <Text style={styles.permissionText}>Camera access is required to photograph your items.</Text>
        <Pressable style={styles.permissionButton} onPress={requestPermission}>
          <Text style={styles.permissionButtonText}>Grant Camera Permission</Text>
        </Pressable>
      </View>
    );
  }

  const atPhotoLimit = photos.length >= MAX_PHOTOS;

  const handleCapture = async () => {
    if (!cameraRef.current || atPhotoLimit) {
      return;
    }

    const photo = await cameraRef.current.takePictureAsync({
      base64: true,
      quality: 0.7,
      skipProcessing: true,
    });

    if (photo?.base64) {
      onCapture(photo.base64);
    }
  };

  return (
    <View style={styles.container}>
      <CameraView ref={cameraRef} style={styles.camera} facing="back" />
      <View style={styles.overlay}>
        <Text style={styles.counter}>
          Photo {photos.length + 1}
          {photos.length > 0 ? ` (${photos.length} captured)` : ''}
        </Text>
        {atPhotoLimit ? (
          <Text style={styles.limitText}>Maximum {MAX_PHOTOS} photos reached.</Text>
        ) : null}
        <Pressable
          style={[styles.captureButton, atPhotoLimit && styles.captureButtonDisabled]}
          onPress={handleCapture}
          disabled={atPhotoLimit}
        >
          <View style={styles.captureInner} />
        </Pressable>
      </View>

      {photos.length > 0 ? (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.thumbnailStrip}>
          {photos.map((photo, index) => (
            <View key={`${index}-${photo.slice(0, 12)}`} style={styles.thumbnailWrap}>
              <Image source={{ uri: `data:image/jpeg;base64,${photo}` }} style={styles.thumbnail} />
              <Pressable style={styles.removeButton} onPress={() => onRemove(index)}>
                <Text style={styles.removeButtonText}>×</Text>
              </Pressable>
            </View>
          ))}
        </ScrollView>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  camera: {
    flex: 1,
  },
  overlay: {
    position: 'absolute',
    bottom: spacing.lg,
    left: 0,
    right: 0,
    alignItems: 'center',
    gap: spacing.sm,
  },
  counter: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
    backgroundColor: 'rgba(0,0,0,0.45)',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.sm,
  },
  limitText: {
    color: colors.warning,
    fontSize: 13,
    fontWeight: '600',
  },
  captureButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 4,
    borderColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  captureButtonDisabled: {
    opacity: 0.4,
  },
  captureInner: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FFFFFF',
  },
  thumbnailStrip: {
    position: 'absolute',
    top: spacing.md,
    left: 0,
    right: 0,
    maxHeight: 88,
    paddingHorizontal: spacing.sm,
  },
  thumbnailWrap: {
    marginRight: spacing.sm,
    position: 'relative',
  },
  thumbnail: {
    width: 72,
    height: 72,
    borderRadius: radius.sm,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  removeButton: {
    position: 'absolute',
    top: -6,
    right: -6,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.danger,
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 18,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
    backgroundColor: colors.background,
  },
  permissionText: {
    fontSize: 15,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  permissionButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
  },
  permissionButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
});
