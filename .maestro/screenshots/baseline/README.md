# Visual regression baselines

PNG screenshots captured from the Android emulator at a **fixed resolution**. The UI consistency agent compares every run against these files.

## Bootstrap (first time or after intentional UI redesign)

```bash
export EXPO_PUBLIC_USE_MOCK=true
npm run android   # use the same emulator profile every time

maestro test .maestro/flows/visual-capture-baseline.yaml
git add .maestro/screenshots/baseline/*.png
git commit -m "Update UI screenshot baselines"
```

## Compare on each review

```bash
maestro test .maestro/flows/visual-regression.yaml
```

On failure, Maestro writes diff images (e.g. `screenshots/baseline/02-summary_diff.png`) next to the baseline. Inspect diffs before approving baseline updates.

## Screens captured

| File | Screen | Threshold |
|------|--------|-----------|
| `01-camera-home.png` | Camera home (mock CTA visible) | 98% |
| `02-summary.png` | Moving plan summary | 98% |
| `03-packing.png` | Packing tutorial | 90% (3D canvas varies) |

## Rules

- Always use the **same emulator** (model + resolution) for capture and comparison.
- Commit baseline PNGs to git so the next run has a reference.
- Do not commit `../current/` or `../diff/` (gitignored).
