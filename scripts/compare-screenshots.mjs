#!/usr/bin/env node
/**
 * Verify reference screenshots exist in public/screenshots/ before visual regression.
 *
 * Usage: node scripts/compare-screenshots.mjs
 */
import { existsSync } from 'node:fs';
import { join } from 'node:path';

const referenceDir = join(process.cwd(), 'public/screenshots');
const required = ['index.png', 'summary.png', 'packing.png'];

console.log('UI screenshot reference check\n');

if (!existsSync(referenceDir)) {
  console.error('Missing directory:', referenceDir);
  console.error('Add reference PNGs — see public/screenshots/README.md');
  process.exit(1);
}

const missing = required.filter((file) => !existsSync(join(referenceDir, file)));

if (missing.length > 0) {
  console.error('Missing reference PNGs in public/screenshots/:');
  missing.forEach((f) => console.error('  -', f));
  console.error('\nSee public/screenshots/README.md for required files.');
  process.exit(1);
}

console.log('All reference screenshots present:');
required.forEach((f) => console.log('  ✓', f));
console.log('\nRun visual regression: npm run test:ui:visual');
