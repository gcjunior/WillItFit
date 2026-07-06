# UI Design System Baseline — Will It Fit?

This document is the **living source of truth** the UI consistency agent reads and updates. It describes what the app *should* look like, what it *currently* does, and known drift.

Last audited from codebase: 2026-07-06.

## Tokens (`constants/theme.ts`)

| Token | Value | Intended use |
|-------|-------|--------------|
| `colors.background` | `#F5F7FA` | Screen backgrounds |
| `colors.surface` | `#FFFFFF` | Cards, secondary buttons |
| `colors.primary` | `#2563EB` | Primary actions, links |
| `colors.primaryDark` | `#1D4ED8` | Slider thumb, pressed states |
| `colors.text` | `#1E293B` | Headings, body |
| `colors.textSecondary` | `#64748B` | Subtitles, hints |
| `colors.border` | `#E2E8F0` | Card borders, secondary button outlines |
| `spacing.xs–xl` | 4, 8, 16, 24, 32 | All padding/margins |
| `radius.sm–lg` | 8, 12, 16 | Buttons, cards, camera frame |

## Typography rules (canonical — agent should enforce)

| Role | fontSize | fontWeight | color | Used on |
|------|----------|------------|-------|---------|
| Screen title | **28** | 800 | `colors.text` | Camera, Summary, Packing |
| Screen subtitle | **14** | 400 (default) | `colors.textSecondary` | All screens |
| Section title | **17** | 700 | `colors.text` | Summary cards |
| Primary button label | **16** | 700 | `#FFFFFF` | All primary CTAs |
| Secondary button label | **14** | 600 | `colors.textSecondary` | Outline buttons |
| Body / list item | **15** | 400–600 | `colors.text` | Lists, box labels |
| Caption / hint | **12–13** | 400–600 | `colors.textSecondary` | Truck hint, limits |

## Component rules (canonical)

### Primary button
- `backgroundColor: colors.primary`
- `borderRadius: radius.md` (12)
- `paddingVertical: spacing.md` (16)
- Label: 16 / 700 / white
- Disabled: `opacity: 0.5`

### Secondary button
- `backgroundColor: colors.surface`
- `borderWidth: 1`, `borderColor: colors.border`
- `borderRadius: radius.md`
- Label: 14 / 600 / `colors.textSecondary`

### Screen layout
- `SafeAreaView` with `edges={['top', 'bottom']}` on full-screen flows
- Horizontal content padding: `spacing.lg` (24)
- Screen background: `colors.background`

### Cards / sections
- `backgroundColor: colors.surface`
- `borderRadius: radius.md`
- `borderWidth: 1`, `borderColor: colors.border`
- Inner padding: `spacing.md`

---

## Known inconsistencies (agent seed list)

These were found by static audit. Behavior tests should confirm they are visible to users.

| ID | Severity | Location | Issue | Expected |
|----|----------|----------|-------|----------|
| UI-001 | **high** | `app/packing.tsx` | Screen title is 24px | 28px like Camera & Summary |
| UI-002 | **medium** | `app/summary.tsx` → `SummaryDashboard` | Subtitle is 15px | 14px |
| UI-003 | **medium** | `SummaryDashboard` | Secondary button label is 15px | 14px |
| UI-004 | **medium** | `app/index.tsx` | Demo secondary button matches spec; Summary secondary does not | Align Summary to 14px |
| UI-005 | **low** | `app/packing.tsx` | Canvas horizontal margin `spacing.md` (16) | `spacing.lg` (24) like Camera |
| UI-006 | **low** | `app/packing.tsx` | `SafeAreaView` only `edges={['top']}` | `['top','bottom']` for consistency |
| UI-007 | **low** | Multiple files | Hardcoded `#FFFFFF`, `#000`, `#E2E8F0` | Prefer theme tokens where semantic |
| UI-008 | **low** | `SummaryDashboard` truck card | Hardcoded `#EFF6FF` / `#BFDBFE` | Add `colors.truckHighlight` to theme |
| UI-009 | **info** | Camera overlay | White-on-black is intentional (camera UX) | Document as exception |
| UI-003D | **info** | `TruckCanvas` / 3D | Uses slate palette for wireframe | Acceptable; not part of 2D UI system |

## Screen map (behavior test coverage)

```
/ (Camera)  →  /summary  →  /packing
     ↑              │
     └─ Retake Photos┘
```

**Mock path (recommended for agent):** `EXPO_PUBLIC_USE_MOCK=true` → tap **Run Demo (Mock Data)** → full flow without camera/API.

## Accessibility selectors for Maestro

Prefer visible text (already present):

| Screen | Tap target | Visible label |
|--------|------------|---------------|
| Camera (mock) | Demo CTA | `Run Demo (Mock Data)` |
| Camera | Primary CTA | `Analyze Photos` |
| Summary | Primary | `View Packing Tutorial` |
| Summary | Secondary | `Retake Photos` |
| Packing | Back | `← Back` |

Add `testID` only when text alone is ambiguous (e.g. slider thumb). Do not rely on invisible views on iOS (RN 0.85 accessibility quirk).

## Changelog (agent updates this section)

| Date | Change | Source |
|------|--------|--------|
| 2026-07-06 | Initial baseline from static audit | Human + agent bootstrap |
