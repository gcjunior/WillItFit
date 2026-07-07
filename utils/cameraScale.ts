import {
  CAMERA_HORIZONTAL_FOV_DEGREES,
  CAMERA_SUBJECT_DISTANCE_METERS,
  METERS_TO_FEET,
} from '../constants/config';

export type ImageScaleContext = {
  width: number;
  height: number;
  distanceMeters: number;
  visibleWidthMeters: number;
  visibleHeightMeters: number;
  metersPerPixelX: number;
  metersPerPixelY: number;
  feetPerPixelX: number;
  feetPerPixelY: number;
};

function degreesToRadians(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

export function getImageScaleAtDistance(
  imageWidth: number,
  imageHeight: number,
  distanceMeters: number = CAMERA_SUBJECT_DISTANCE_METERS,
  horizontalFovDegrees: number = CAMERA_HORIZONTAL_FOV_DEGREES,
): ImageScaleContext {
  const halfHorizontalFov = degreesToRadians(horizontalFovDegrees) / 2;
  const aspectRatio = imageWidth / imageHeight;
  const halfVerticalFov = Math.atan(Math.tan(halfHorizontalFov) / aspectRatio);

  const visibleWidthMeters = 2 * distanceMeters * Math.tan(halfHorizontalFov);
  const visibleHeightMeters = 2 * distanceMeters * Math.tan(halfVerticalFov);
  const metersPerPixelX = visibleWidthMeters / imageWidth;
  const metersPerPixelY = visibleHeightMeters / imageHeight;

  return {
    width: imageWidth,
    height: imageHeight,
    distanceMeters,
    visibleWidthMeters,
    visibleHeightMeters,
    metersPerPixelX,
    metersPerPixelY,
    feetPerPixelX: metersPerPixelX * METERS_TO_FEET,
    feetPerPixelY: metersPerPixelY * METERS_TO_FEET,
  };
}

export function formatScaleContextForPrompt(scales: ImageScaleContext[]): string {
  const header = `All photos were taken with the camera ${CAMERA_SUBJECT_DISTANCE_METERS} meter (${(
    CAMERA_SUBJECT_DISTANCE_METERS * METERS_TO_FEET
  ).toFixed(1)} ft) from the subjects. Use the per-image scale below to convert pixel extents to real dimensions, then return box dimensions in feet.`;

  const perImage = scales
    .map((scale, index) => {
      return [
        `Photo ${index + 1} (${scale.width}×${scale.height}px):`,
        `- Subject distance: ${scale.distanceMeters} m`,
        `- Visible scene: ${scale.visibleWidthMeters.toFixed(2)} m wide × ${scale.visibleHeightMeters.toFixed(2)} m tall`,
        `- Scale: ${scale.feetPerPixelX.toFixed(5)} ft/pixel horizontally, ${scale.feetPerPixelY.toFixed(5)} ft/pixel vertically`,
        `- Example: a 200 px wide object ≈ ${(200 * scale.feetPerPixelX).toFixed(2)} ft wide`,
      ].join('\n');
    })
    .join('\n\n');

  return `${header}\n\n${perImage}`;
}
