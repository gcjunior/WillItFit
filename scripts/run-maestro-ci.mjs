#!/usr/bin/env node
/**
 * CI entrypoint: behavior tests always; visual regression only when baselines exist.
 */
import { execSync } from 'node:child_process';
import { existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const resultsDir = '.maestro/results';
const baselineDir = join('.maestro/screenshots/baseline');
const requiredBaselines = ['01-camera-home.png', '02-summary.png', '03-packing.png'];

function runMaestro(label, junitFile, debugDir, flows) {
  console.log(`\n--- Maestro: ${label} ---\n`);
  execSync(
    [
      'maestro test',
      '--format junit',
      `--output ${join(resultsDir, junitFile)}`,
      `--debug-output ${debugDir}`,
      ...flows,
    ].join(' '),
    { stdio: 'inherit', env: { ...process.env, MAESTRO_CLI_NO_ANALYTICS: '1' } },
  );
}

const behaviorFlows = [
  '.maestro/flows/mock-demo-to-summary.yaml',
  '.maestro/flows/summary-to-packing.yaml',
  '.maestro/flows/packing-navigation.yaml',
  '.maestro/flows/retake-photos.yaml',
];

execSync(`mkdir -p ${resultsDir}`, { stdio: 'inherit' });

runMaestro('behavior', 'maestro-behavior-junit.xml', join(resultsDir, 'behavior-debug'), behaviorFlows);

const hasBaselines =
  existsSync(baselineDir) &&
  requiredBaselines.every((file) => existsSync(join(baselineDir, file)));

if (hasBaselines) {
  runMaestro('visual regression', 'maestro-visual-junit.xml', join(resultsDir, 'visual-debug'), [
    '.maestro/flows/visual-regression.yaml',
  ]);
} else {
  console.log('\nSkipping visual regression — baseline PNGs not committed yet.');
  console.log('Capture locally: npm run test:ui:baseline (iOS Simulator), then commit PNGs.\n');
}
