# Migration Plan: Framework-Agnostic Schedule Timeline (Monorepo)

**Date:** 2026-05-23  
**Author:** Diego Rivera  
**Status:** In progress — core extraction & React wrapper implemented

---

## Problem

`@demmarl/schedule-timeline` is React-only. Using it in an Astro project requires pulling in React (~40KB gzipped) just for a timeline component. The goal is a vanilla JS core that works anywhere — Astro, plain HTML, Vue, Svelte — while keeping the existing React package working for current users, all from a single source of truth.

---

## Goals

- Framework-agnostic vanilla JS core with zero React dependency
- Web Component (`<schedule-timeline>`) + plain JS function (`renderTimeline()`) for maximum DX flexibility
- React package becomes a thin wrapper over the core — no duplicated rendering logic
- CSS custom properties for theming — no Tailwind or UnoCSS required
- ICS utilities in core as a separate entry point (pure logic, no framework)
- Full backward compatibility for existing `@demmarl/schedule-timeline` users
- Single monorepo managed with pnpm workspaces

---

## Architecture

```
packages/core   →  vanilla JS renderer + Web Component + ICS utils
packages/react  →  thin React wrapper over core (backward compatible)
```

```
schedule-timeline/           ← repo root
├── pnpm-workspace.yaml
├── package.json             ← root workspace (no src, scripts only)
├── PLAN.md
└── packages/
    ├── core/                ← NEW: @demmarl/schedule-timeline-core
    │   ├── src/
    │   │   ├── types.ts          ← shared types (Event, Activity, DaySchedule, etc.)
    │   │   ├── renderer.ts       ← DOM rendering logic (renderTimeline fn)
    │   │   ├── web-component.ts  ← <schedule-timeline> custom element
    │   │   ├── eventUtils.ts     ← moved from current src/utils/eventUtils.ts
    │   │   ├── ics.ts            ← moved from current src/utils/icsUtils.ts
    │   │   └── index.ts          ← exports renderTimeline + ScheduleTimelineElement
    │   ├── package.json
    │   ├── tsconfig.json
    │   └── rollup.config.js      ← two outputs: index + ics entry point
    └── react/               ← REFACTORED: @demmarl/schedule-timeline
        ├── src/
        │   ├── ScheduleTimeline.tsx  ← thin wrapper over core renderTimeline
        │   └── index.ts             ← same public API as today
        ├── package.json             ← peer dep on core (workspace:*)
        ├── tsconfig.json
        └── rollup.config.js
```

## Progress Update

- **Completed (committed):**
  - feat(core): add shared timeline source — `9c7cfc6`
  - feat(react): delegate rendering to core — `32825e7`
  - chore(react): align exports with core — `8936490`
  - feat(core): add web component entry — `43405dc`

- **What was done:** core package created and populated with shared `types`, `eventUtils`, `ics`, and a vanilla DOM `renderTimeline`; React `ScheduleTimeline` was converted to a thin wrapper that mounts the core renderer and bridges custom React renderers; a web component wrapper and separate entry were added and smoke-tested under jsdom.

- **Remaining / Next:**
  - Finalize docs and package `exports`/publishing metadata (Task 7)
  - Decide versioning for `@demmarl/schedule-timeline-core` and web-component auto-register behavior
  - Sweep remaining tests and examples to remove Tailwind class reliance where appropriate


---

## Styling Strategy

Replace Tailwind class strings with **inline styles + CSS custom properties**.

Users can override any color by setting CSS variables on the container or globally:

```css
/* defaults (set by the library) */
--st-color-registration: rgba(147, 197, 253, 0.6);
--st-color-opening:      rgba(244, 114, 182, 0.6);
--st-color-break:        rgba(191, 219, 254, 0.6);
--st-color-contest:      rgba(249, 168, 212, 0.6);
--st-color-default:      rgba(243, 244, 246, 0.6);
/* ... etc */
```

```css
/* user override example */
schedule-timeline {
  --st-color-contest: #ff6b6b;
}
```

---

## Public API — Core (`@demmarl/schedule-timeline-core`)

### Plain JS function

```ts
import { renderTimeline } from '@demmarl/schedule-timeline-core';

const instance = renderTimeline(document.getElementById('timeline'), {
  events: [...],
  config: { startHour: 8, endHour: 20 },
  onEventClick: (event) => console.log(event),
});

instance.update({ events: newEvents }); // re-render with new data
instance.destroy();                      // clean up DOM + listeners
```

### Web Component

```html
<script type="module" src="node_modules/@demmarl/schedule-timeline-core/dist/index.js"></script>

<schedule-timeline
  events='[{"title":"Opening","startTime":"09:00","endTime":"10:00","date":"2026-06-01","type":"opening"}]'
  config='{"startHour":8,"endHour":20}'
></schedule-timeline>
```

Or via JS:

```js
const el = document.querySelector('schedule-timeline');
el.setEvents(events);   // method API (avoids JSON serialization for large datasets)
el.setConfig(config);
```

### ICS utilities (separate entry point)

```ts
import { eventsToICS, icsToEvents, downloadICS, loadICSFile } from '@demmarl/schedule-timeline-core/ics';
```

---

## Public API — React (`@demmarl/schedule-timeline`)

Unchanged from today. Existing code requires zero migration:

```tsx
import { ScheduleTimeline, Event } from '@demmarl/schedule-timeline';

<ScheduleTimeline events={events} onEventClick={handleClick} />
```

Internally, `ScheduleTimeline` will use `useRef` + `useEffect` to delegate rendering to `renderTimeline` from core.

---

## Task Breakdown

### Task 1 — Set up pnpm monorepo workspace

**Objective:** Convert the repo root into a pnpm workspace.

**Steps:**
1. Add `pnpm-workspace.yaml` at root pointing to `packages/*`
2. Move current `src/`, `rollup.config.js`, `tsconfig.json`, `package.json` into `packages/react/`
3. Scaffold `packages/core/` with its own `package.json` (`@demmarl/schedule-timeline-core`), `tsconfig.json`, `rollup.config.js`
4. Update root `package.json` to workspace-level scripts only

**Done when:** `pnpm install` from root resolves both workspaces; `pnpm --filter @demmarl/schedule-timeline build` still produces a working dist and passes existing tests.

---

### Task 2 — Extract shared types into core

**Objective:** Single source of truth for `Event`, `Activity`, `DaySchedule`, `TimelineConfig`, `ColorTheme`, `TimeMarker`.

**Steps:**
1. Copy `src/types.ts` to `packages/core/src/types.ts`
2. In `packages/react`, replace local type imports with `@demmarl/schedule-timeline-core`
3. Add `"@demmarl/schedule-timeline-core": "workspace:*"` to react's dependencies

**Done when:** React package tests pass with no type errors; types are importable from core.

---

### Task 3 — Build the vanilla DOM renderer in core

**Objective:** Implement `renderTimeline(container, props): TimelineInstance` — pure DOM, no framework.

**Steps:**
1. Port layout logic from `ScheduleTimeline.tsx` to `packages/core/src/renderer.ts`:
   - `timeToMinutes()`, `getDuration()`, pixel math
   - Time markers column
   - Day columns + activity blocks
2. Replace Tailwind classes with inline styles + CSS custom properties
3. Move `eventUtils.ts` to core unchanged
4. Return `{ update(props), destroy() }` from `renderTimeline`

**Done when:** Unit tests (jsdom) verify correct number of day columns, activity blocks, and time markers are rendered for a given events array.

---

### Task 4 — Add ICS utilities to core as a separate entry point

**Objective:** `icsUtils.ts` available from `@demmarl/schedule-timeline-core/ics` with no breaking changes.

**Steps:**
1. Copy `src/utils/icsUtils.ts` to `packages/core/src/ics.ts` (no logic changes needed)
2. Add second Rollup entry in core's config: `src/ics.ts → dist/ics.js`
3. Add `"exports"` field in core's `package.json`:
   ```json
   {
     "exports": {
       ".":     { "import": "./dist/index.esm.js", "require": "./dist/index.js" },
       "./ics": { "import": "./dist/ics.esm.js",   "require": "./dist/ics.js"   }
     }
   }
   ```

**Done when:** `import { icsToEvents } from '@demmarl/schedule-timeline-core/ics'` works; existing ICS round-trip tests pass.

---

### Task 5 — Build the Web Component wrapper

**Objective:** `<schedule-timeline>` custom element usable in any HTML/Astro page with zero JS setup.

**Steps:**
1. In `packages/core/src/web-component.ts`, define a class extending `HTMLElement`
2. `observedAttributes`: `events`, `config` (JSON strings)
3. `connectedCallback`: parse attributes, call `renderTimeline(this, props)`, store instance
4. `attributeChangedCallback`: call `instance.update(newProps)`
5. `disconnectedCallback`: call `instance.destroy()`
6. Expose `setEvents(events)` and `setConfig(config)` methods for JS usage (avoids JSON serialization)
7. `customElements.define('schedule-timeline', ScheduleTimelineElement)`

**Done when:** jsdom test verifies the custom element renders activity blocks when `events` attribute is set; plain HTML demo file works in browser.

---

### Task 6 — Refactor React package to wrap core

**Objective:** `ScheduleTimeline.tsx` delegates all rendering to core — no duplicated logic.

**Steps:**
1. Replace rendering JSX in `ScheduleTimeline.tsx` with:
   ```tsx
   const containerRef = useRef<HTMLDivElement>(null);
   const instanceRef = useRef<TimelineInstance | null>(null);

   useEffect(() => {
     instanceRef.current = renderTimeline(containerRef.current!, props);
     return () => instanceRef.current?.destroy();
   }, []);

   useEffect(() => {
     instanceRef.current?.update(props);
   }, [events, schedule, config, colorTheme]);

   return <div ref={containerRef} className={className} />;
   ```
2. Keep all existing props and their types identical

**Done when:** All existing React tests pass unchanged; visual output is identical to before.

---

### Task 7 — Wire up exports, docs, and publish config

**Objective:** Both packages are publishable independently; README covers all usage patterns.

**Steps:**
1. Finalize `package.json` for both packages (name, version, exports, peerDependencies)
2. Add Astro usage section to README:
   - Web Component approach (no framework)
   - Plain JS `renderTimeline` approach
   - React island approach (existing)
3. Add `pnpm -r build` and `pnpm -r test` scripts to root
4. Verify `pnpm publish` dry-run for both packages

**Done when:** Both packages build, test, and publish cleanly; Astro smoke test page renders a timeline with no React dependency.

---

## Migration Notes for Existing Users

No action required. `@demmarl/schedule-timeline` keeps the same package name, version scheme, and API. The only internal change is that rendering is delegated to core — invisible to consumers.

If users want the vanilla core directly:

```bash
pnpm add @demmarl/schedule-timeline-core
```

---

## Open Questions

- Should `@demmarl/schedule-timeline-core` be `1.0.0` (new package) or mirror the React package version (`1.2.0`)?
- Should the Web Component auto-register on import, or require explicit `register()` call (better for tree-shaking)?
- CSS custom property prefix: `--st-` (schedule-timeline) — confirm or change?
