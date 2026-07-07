# UI Consistency Report — 2026-07-07

## Summary

| Check | Result |
|-------|--------|
| Behavior flows (Maestro) | **Skipped** — no emulator/Maestro run in this session |
| Screenshot comparison | **Skipped** — baseline PNGs not captured yet |
| Static style audit | **Complete** — 9 issues found |
| Fixes applied | **0** — awaiting your approval |

**Issues found:** 7 actionable + 2 documented exceptions  
**Recommended quick wins:** UI-001, UI-002, UI-003 (typography only, low risk)

---

## Behavior test results

| Flow | Result | Notes |
|------|--------|-------|
| `mock-demo-to-summary.yaml` | skipped | Requires Android emulator + Maestro |
| `summary-to-packing.yaml` | skipped | Requires Android emulator + Maestro |
| `packing-navigation.yaml` | skipped | Requires Android emulator + Maestro |
| `retake-photos.yaml` | skipped | Requires Android emulator + Maestro |

To run later:

```bash
export EXPO_PUBLIC_USE_MOCK=true
npm run android          # Terminal 1
npm run test:ui:behavior # Terminal 2
```

---

## Screenshot comparison

| Screen | Baseline | Result | Threshold | Diff |
|--------|----------|--------|-----------|------|
| Camera home | `01-camera-home.png` | skipped | 98% | Baseline missing |
| Summary | `02-summary.png` | skipped | 98% | Baseline missing |
| Packing | `03-packing.png` | skipped | 90% | Baseline missing |

Baseline check output:

```
Missing baseline PNGs: 01-camera-home.png, 02-summary.png, 03-packing.png
```

To capture baselines (once emulator is ready):

```bash
npm run test:ui:baseline
git add .maestro/screenshots/baseline/*.png
```

---

## Issues

### UI-001 — Packing screen title too small

- **Severity:** high
- **Source:** static
- **Screen:** Packing (`app/packing.tsx`)
- **Observed:** `fontSize: 24`, `fontWeight: '800'`
- **Expected:** Screen title 28 / 800 / `colors.text` (matches Camera & Summary)
- **Status:** open
- **Suggested fix:** Change `styles.title.fontSize` from `24` → `28`

---

### UI-002 — Summary subtitle wrong size

- **Severity:** medium
- **Source:** static
- **Screen:** Summary (`components/summary/SummaryDashboard.tsx`)
- **Observed:** `styles.subtitle.fontSize: 15`
- **Expected:** Screen subtitle 14 / default weight / `colors.textSecondary`
- **Status:** open
- **Suggested fix:** Change subtitle `fontSize` from `15` → `14`

Reference — Camera subtitle (correct):

```73:75:app/index.tsx
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
```

---

### UI-003 — Summary secondary button label too large

- **Severity:** medium
- **Source:** static
- **Screen:** Summary (`components/summary/SummaryDashboard.tsx`)
- **Observed:** `styles.secondaryButtonText.fontSize: 15`
- **Expected:** Secondary button label 14 / 600 / `colors.textSecondary`
- **Status:** open
- **Suggested fix:** Change `secondaryButtonText.fontSize` from `15` → `14`

Reference — Camera demo button (correct):

```113:116:app/index.tsx
  demoButtonText: {
    color: colors.textSecondary,
    fontSize: 14,
    fontWeight: '600',
```

---

### UI-005 — Packing canvas horizontal margin inconsistent

- **Severity:** low
- **Source:** static
- **Screen:** Packing (`app/packing.tsx`)
- **Observed:** `canvasWrap.marginHorizontal: spacing.md` (16px)
- **Expected:** `spacing.lg` (24px) — matches Camera `cameraWrap`
- **Status:** open
- **Suggested fix:** Change `marginHorizontal` from `spacing.md` → `spacing.lg`

---

### UI-006 — Packing missing bottom safe area

- **Severity:** low
- **Source:** static
- **Screen:** Packing (`app/packing.tsx`)
- **Observed:** `SafeAreaView edges={['top']}`
- **Expected:** `edges={['top', 'bottom']}` — matches Camera & Summary
- **Status:** open
- **Suggested fix:** Add `'bottom'` to edges array
- **Note:** May shift slider layout slightly; verify on device after fix

---

### UI-007 — Hardcoded hex instead of theme tokens

- **Severity:** low
- **Source:** static
- **Screen:** Multiple
- **Observed:**

  | File | Hardcoded | Theme equivalent |
  |------|-----------|------------------|
  | `app/packing.tsx` | `#E2E8F0` (canvas bg) | `colors.border` |
  | `app/index.tsx` | `#FFFFFF` (button text, spinner) | `colors.surface` |
  | `SummaryDashboard.tsx` | `#FFFFFF` (primary button text) | `colors.surface` |

- **Expected:** Use semantic tokens from `constants/theme.ts`
- **Status:** open
- **Suggested fix:** Replace token-equivalent hex values; leave camera overlay `#000`/`#FFFFFF` as exceptions (UI-009)

---

### UI-008 — Truck card uses undeclared highlight colors

- **Severity:** low
- **Source:** static
- **Screen:** Summary (`components/summary/SummaryDashboard.tsx`)
- **Observed:** `backgroundColor: '#EFF6FF'`, `borderColor: '#BFDBFE'`
- **Expected:** Either add `colors.truckHighlight` / `colors.truckHighlightBorder` to theme, or use existing tokens
- **Status:** open
- **Suggested fix:** Requires your decision — special accent vs new theme tokens

---

### UI-009 — Camera overlay styling (intentional exception)

- **Severity:** info
- **Source:** static
- **Screen:** Camera (`MultiPhotoCamera.tsx`, `app/index.tsx`)
- **Observed:** White-on-black overlay, `#000` camera background
- **Expected:** Documented exception — standard camera UX pattern
- **Status:** wontfix
- **Suggested fix:** None

---

### UI-003D — 3D wireframe colors (out of scope)

- **Severity:** info
- **Source:** static
- **Screen:** `TruckContainer.tsx`, `PackingBox.tsx`
- **Observed:** Slate/wireframe palette hardcoded for Three.js
- **Expected:** Acceptable — separate from 2D UI system
- **Status:** wontfix
- **Suggested fix:** None

---

## Screen-by-screen typography snapshot

| Element | Camera | Summary | Packing | Baseline |
|---------|--------|---------|---------|----------|
| Screen title | 28 ✓ | 28 ✓ | **24 ✗** | 28 |
| Screen subtitle | 14 ✓ | **15 ✗** | 14 ✓ | 14 |
| Primary button | 16/700 ✓ | 16/700 ✓ | — | 16/700 |
| Secondary button | 14/600 ✓ | **15/600 ✗** | — | 14/600 |
| SafeArea edges | top+bottom ✓ | top+bottom ✓ | **top only ✗** | top+bottom |
| Content margin (canvas) | lg ✓ | lg ✓ | **md ✗** | lg |

---

## Recommended fixes (awaiting your approval)

| Priority | ID | Effort | Risk |
|----------|-----|--------|------|
| 1 | UI-001 | 1 line | Very low |
| 2 | UI-002 | 1 line | Very low |
| 3 | UI-003 | 1 line | Very low |
| 4 | UI-005 | 1 line | Low |
| 5 | UI-006 | 1 line | Low — verify slider on device |
| 6 | UI-007 | ~5 lines | Low |
| 7 | UI-008 | Needs decision | Medium — new tokens vs keep accent |

**Suggested batch for "fix all safe":** UI-001, UI-002, UI-003, UI-005, UI-007 (token swaps only)

---

## Baseline updates

None applied in this run (report-only).

---

## Recommended follow-ups

1. Capture screenshot baselines on Android emulator (`npm run test:ui:baseline`)
2. Run full `npm run test:ui` to validate behavior + pixels after any fixes
3. Decide on UI-008: keep truck card blues as-is, or add theme tokens

---

> **Which issues should I fix?**  
> Reply with issue IDs (e.g. `UI-001, UI-002, UI-003`) or **`fix all safe`**.
