#!/usr/bin/env node
/**
 * CI entrypoint: behavior tests always; visual regression when reference PNGs exist.
 */
import { execSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { join } from 'node:path';

const resultsDir = '.maestro/results';
const referenceDir = join('public/screenshots');
const requiredReferences = ['index.png', 'summary.png', 'packing.png'];

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

const hasReferences = requiredReferences.every((file) => existsSync(join(referenceDir, file)));

if (hasReferences) {
  runMaestro('visual regression', 'maestro-visual-junit.xml', join(resultsDir, 'visual-debug'), [
    '.maestro/flows/visual-regression.yaml',
  ]);
} else {
  console.log('\nSkipping visual regression — reference PNGs missing in public/screenshots/.');
  console.log('Add index.png, summary.png, packing.png — see public/screenshots/README.md\n');
}
