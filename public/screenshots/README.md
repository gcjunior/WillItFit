# Reference screenshots for visual regression

One PNG per app screen. Maestro compares the live Simulator UI to these files on every `npm run test:ui:visual` run.

**Compare only** — this folder is not auto-populated by tests. Add or update images manually when the design intentionally changes.

## Required files

| File | Screen | Route | Capture notes |
|------|--------|-------|---------------|
| `index.png` | Camera home | `/` | Mock mode on — **Run Demo (Mock Data)** visible |
| `summary.png` | Moving plan | `/summary` | After running demo analysis |
| `packing.png` | Packing tutorial | `/packing` | Step 1 visible |

Filenames match Expo Router screen names (`app/index.tsx`, `app/summary.tsx`, `app/packing.tsx`).

## Updating references

1. Run the app on iOS Simulator with `EXPO_PUBLIC_USE_MOCK=true`
2. Navigate to each screen
3. Save a screenshot with the filename above into this folder
4. Commit the PNG

Use the **same simulator model and iOS version** as CI (`macos-15` GitHub runner).

## Compare

```bash
export EXPO_PUBLIC_USE_MOCK=true
npm run ios
npm run test:ui:visual
```

On failure, Maestro writes diff images (e.g. `summary_diff.png`) in this folder.
