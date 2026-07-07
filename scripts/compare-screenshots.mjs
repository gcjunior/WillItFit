#!/usr/bin/env node
/**
 * Fallback screenshot diff helper when Maestro assertScreenshot output needs summarising.
 * Primary comparison is Maestro assertScreenshot in visual-regression.yaml.
 *
 * Usage: node scripts/compare-screenshots.mjs
 */
import { readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const baselineDir = join(process.cwd(), '.maestro/screenshots/baseline');
const required = ['01-camera-home.png', '02-summary.png', '03-packing.png'];

console.log('UI screenshot baseline check\n');

if (!existsSync(baselineDir)) {
  console.error('Missing baseline directory:', baselineDir);
  console.error('Run: maestro test .maestro/flows/visual-capture-baseline.yaml');
  process.exit(1);
}

const present = new Set(readdirSync(baselineDir).filter((f) => f.endsWith('.png')));
const missing = required.filter((f) => !present.has(f));

if (missing.length > 0) {
  console.error('Missing baseline PNGs:');
  missing.forEach((f) => console.error('  -', f));
  console.error('\nCapture with: maestro test .maestro/flows/visual-capture-baseline.yaml');
  process.exit(1);
}

console.log('All baseline screenshots present:');
required.forEach((f) => console.log('  ✓', f));
console.log('\nRun visual regression: maestro test .maestro/flows/visual-regression.yaml');
