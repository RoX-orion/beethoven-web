# AGENTS.md

This file defines repository-specific guidance for coding agents working in `Beethoven-Web`.

## Project Summary

- Stack: `Vue 3` + `Vite` + `TypeScript` + `Pinia` + `Vue Router` + `Ant Design Vue` + `SCSS`.
- App type: music web client with playback UI, playlist/search flows, auth, and a small `/manage` admin area.
- Build output: `build/`.

## Runbook

- Install: `npm install`
- Dev server: `npm run dev`
- Type check: `npm run type-check`
- Production build: `npm run build`
- Preview build: `npm run preview`

Always run `npm run build` after non-trivial UI or state changes unless the user explicitly says not to.

## Repository Layout

- `src/main.ts`: app bootstrap, Pinia, router, SVG icon registration, app initialization.
- `src/router/index.ts`: route table. Main app uses `/:type?/:id?`; admin routes live under `/manage`.
- `src/store/`: Pinia stores. Global playback/search/window state is in `global.ts`.
- `src/api/`: HTTP wrappers grouped by domain (`music`, `playlist`, `setting`, etc.).
- `src/util/request.ts`: shared Axios instance, auth header injection, global API error handling.
- `src/views/`: feature surfaces.
- `src/components/`: reusable UI components such as `Button`, `InputText`, `Progress`, `IconButton`.
- `src/style/`: global SCSS (`variables.scss`, `base.scss`, `index.scss`, `main.scss`).
- `public/assets/icons`: SVG icon source folder consumed by `vite-plugin-svg-icons`.

## Architectural Notes

- The main playback UI is in `src/views/player/Player.vue`. Keep desktop and mobile variants behaviorally aligned.
- Search state, current media id, mobile mode, and playback-related flags are shared through `useGlobalStore()`.
- The app relies on `mitt` via `src/util/eventBus.ts` for lightweight cross-view events such as playlist refresh.
- API responses are expected to have a `code` field. `src/util/request.ts` already enforces success semantics and
  redirects `401` to `/auth`.

## Change Guidelines

- Prefer updating existing components and patterns over introducing new abstractions.
- Keep edits local to the relevant feature. Do not refactor unrelated views while touching UI.
- When changing API-facing code, reuse the existing `src/api/*` wrapper pattern instead of issuing raw Axios calls from
  views.
- When changing shared state, extend existing Pinia stores before adding new global channels.
- If a new icon is needed, add an SVG under `public/assets/icons` and use the existing `SvgIcon` pipeline.

## UI and Styling Rules

- Preserve the current visual direction: light, blue-led theme with glassy surfaces and soft gradients.
- Prefer existing CSS variables in `src/style/variables.scss` over hard-coded colors.
- Reuse shared surface tokens such as `--surface-color`, `--surface-border`, `--surface-shadow`, `--brand-primary`.
- Keep mobile layout quality in scope for every UI change. This app has explicit mobile player/search/sidebar behavior.
- For list pickers and modal selections, favor full-row touch targets over tiny controls.
- Avoid introducing green as a primary accent unless the change is explicitly about success state.

## Verification Expectations

- For UI-only changes: run `npm run build`.
- For state or routing changes: run `npm run build` and inspect the affected route/component logic.
- If you modify layout around the bottom player, verify both:
    - desktop bottom player spacing
    - mobile collapsed player and mobile expanded player

## Known Local State

- `.env` may contain user-local API endpoint changes. Do not overwrite or normalize it unless requested.
- Temporary files may exist in the worktree. Do not include unrelated generated files in changes.

## Good First Read Targets

- `src/views/Home.vue`
- `src/views/player/Player.vue`
- `src/views/middle/SearchResult.vue`
- `src/views/middle/PlayListInfo.vue`
- `src/style/variables.scss`
- `src/style/base.scss`
