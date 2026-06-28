# AGENTS.md

This file defines repository-specific guidance for coding agents working in `Beethoven-Web`.

## Project Summary

- Stack: `Vue 3` + `Vite` + `TypeScript` + `Pinia` + `Vue Router` + `Ant Design Vue` + `SCSS`.
- App type: music web client with playback UI, playlist/search flows, auth, and a small `/manage` admin area.
- Build output: `build/`.
- Audio playback: `xgplayer` (version ^3.0.24).
- Real-time communication: WebSocket via a custom `Connection` class wrapping `PromisedWebSockets`.
- HTTP: `axios` with auth header injection in request interceptor.
- Lightweight event bus: `mitt` via `src/util/eventBus.ts`.
- SVG icons: `vite-plugin-svg-icons`, source SVGs in `public/assets/icons/`, registered globally in `main.ts`.
- Backend API port: `45678` (default). Base URL read from `VITE_BASE_API` env var; WebSocket URL from `VITE_WS_API`.

## Runbook

- Install: `npm install`
- Dev server: `npm run dev`
- Type check: `npm run type-check`
- Production build: `npm run build`
- Preview build: `npm run preview`

Always run `npm run build` after non-trivial UI or state changes unless the user explicitly says not to.

## Known Environment Issues

- `.env` has **two conflicting `VITE_BASE_API` entries** — an uncommented local one (`http://127.0.0.1:45678`) followed
  by an uncommented remote one (`https://music.kxcpp.top/api`). Vite reads the last definition, so the remote URL wins.
  If you need local development, comment the remote line or use separate `.env.development` / `.env.production` files.
- `VITE_WS_API` is missing in the current `.env` (commented out). The `init.ts` WebSocket init will fail if
  `VITE_WS_API` is absent at runtime. Add `VITE_WS_API=ws://127.0.0.1:45678` for local dev.

## Repository Layout

- `src/main.ts`: app bootstrap, Pinia, router, SVG icon registration, app initialization.
- `src/router/index.ts`: route table. Main app uses `/:type?/:id?`; admin routes live under `/manage`.
- `src/store/`: Pinia stores. Global playback/search/window state is in `global.ts`.
  - `global.ts` exports 4 stores: `useGlobalStore`, `useAccountStore`, `useRouteStore`, `useMusicStore`.
  - `useGlobalStore` holds playback state (`music`, `media`, `player`), search key, mobile flag, window width,
    `canPlay`, `videoId`.
  - `useAccountStore` holds login account info (id, username, avatar, token).
  - `useRouteStore` holds the current route `type` and `id`.
  - `useMusicStore` holds video ref (legacy, rarely used).
  - `store.ts` creates and exports the Pinia instance; `componentState.ts` exports a reactive `componentState` object
    (not a store) for middle-area view switching.
- `src/api/`: HTTP wrappers grouped by domain (`music`, `playlist`, `setting`, etc.).
  - `music.ts` — upload, search, info, manage list, delete, update.
  - `playlist.ts` — CRUD, add/remove music, get playlist music, home playlist.
  - `album.ts` — manage list, add album.
  - `video.ts` — info, manage list.
  - `auth.ts` — OAuth2 info, OAuth2 login, logout.
  - `setting.ts` — get/update setting (user preferences).
  - `account.ts` — get account info (by id or by token).
  - `appConfig.ts` — app config (default cover, sharding size) and music config.
- `src/util/request.ts`: shared Axios instance, auth header injection, global API error handling.
  - API response shape: `{ code: number, msg: string, data: any }`. code=200 = success; code=401 redirects to `/auth`;
    400/500 shown via Ant Design notification.
  - Default timeout: 30 s. Upload overrides to 5 hours.
- `src/views/`: feature surfaces.
  - `views/player/Player.vue` — main audio player, xgplayer integration, desktop + mobile layouts, keyboard shortcuts
    (Space/Enter for play-pause, Left/Right arrows for seek +/-15s).
  - `views/middle/Middle.vue` — scrollable content area with pull-to-refresh on mobile; renders `PlayListGroup`,
    `SearchResult`, `PlayListInfo`, or `VideoPlayer` based on `componentState.currentMiddleComponent`.
  - `views/header/Header.vue` — top bar with search.
  - `views/left/Left.vue` — sidebar with playlist list.
  - `views/auth/Auth.vue` — OAuth2 login page.
  - `views/manage/` — admin area: `Dashboard`, `MusicManage`, `Storage`, `System`, `AlbumManage`, `VideoManage`.
- `src/components/`: reusable UI components such as `Button`, `InputText`, `Progress`, `IconButton`.
  - `SvgIcon.vue` — inline SVG icon component using `vite-plugin-svg-icons`.
  - `Progress.vue` — custom progress bar used in both desktop and mobile players.
  - `UploadImage.vue` — image/file upload with preview.
  - `Loading.vue` — loading spinner.
  - `Search.vue` — search input.
- `src/style/`: global SCSS (`variables.scss`, `base.scss`, `index.scss`, `main.scss`).
  - Theme: light, blue-led with glassy surfaces, soft gradients, backdrop-filter blur.
  - CSS variables in `variables.scss`: `--surface-color`, `--surface-border`, `--brand-primary`, `--text-primary`, etc.
- `public/assets/icons`: SVG icon source folder consumed by `vite-plugin-svg-icons`.
- `src/lib/`:
  - `init.ts` — async app init: fetches app config + establishes WebSocket connection in parallel.
  - `network/Connection.ts` — WebSocket client implementation.
  - `Logger.ts`, `AsyncQueue.ts`, `PendingState.ts`, `PromisedWebSockets.ts` — async networking utilities.
- `src/util/`:
  - `eventBus.ts` — mitt event bus instance.
  - `time.ts` — time formatting (`durationFormater`).
  - `schedulers.ts` — throttle/debounce utilities.
  - `localStorage.ts` — typed local storage wrapper.
  - `notifications.ts` — notification helpers.
  - `setupServiceWorker.ts` — service worker registration.
  - `windowEnvironment.ts` — window/environment detection.
- `src/types/global.ts` — shared TypeScript interfaces and enums (`MusicItemType`, `SettingType`, `ApiResponse`,
  `ComponentType`, etc.).
- `src/lib/beethoven.ts` / `src/lib/index.ts` — WebSocket message protocol definitions.

## Architectural Notes

- The main playback UI is in `src/views/player/Player.vue`. Keep desktop and mobile variants behaviorally aligned.
  - Desktop player: full-width bottom bar with cover art, progress bar, control buttons, volume slider, video button,
    play mode, queue.
  - Mobile player: collapsible bottom bar; tapping opens a full-screen expanded player (slide-up transition) with larger
    cover, full controls, and Ant Design drawer for device/volume.
- Search state, current media id, mobile mode, and playback-related flags are shared through `useGlobalStore()`.
- The app relies on `mitt` via `src/util/eventBus.ts` for lightweight cross-view events such as playlist refresh.
- API responses are expected to have a `code` field. `src/util/request.ts` already enforces success semantics and
  redirects `401` to `/auth`.
- WebSocket connection established at startup via `init.ts` -> `Connection.connect()`. Server push events handled
  through `beethoven.ts` protocol.
- Player watches `globalStore.global.media.musicId` to load a track. On change, it fetches music info, sets xgplayer
  src, and auto-plays if `global.canPlay` is true.
- Sharded audio streaming (MediaSource API) is implemented but currently commented out. Audio loads via full URL
  directly.
- Keyboard shortcuts in Player: Space/Enter = play/pause, Left/Right Arrow = seek +/-15s.

## Change Guidelines

- Prefer updating existing components and patterns over introducing new abstractions.
- Keep edits local to the relevant feature. Do not refactor unrelated views while touching UI.
- When changing API-facing code, reuse the existing `src/api/*` wrapper pattern instead of issuing raw Axios calls from
  views.
- When changing shared state, extend existing Pinia stores before adding new global channels.
- If a new icon is needed, add an SVG under `public/assets/icons` and use the existing `SvgIcon` pipeline.
- If modifying the player layout, verify both desktop bottom bar and mobile collapsed + expanded states.
- When introducing new API endpoints, mirror the existing controller endpoint path and register the call in an existing
  or new `src/api/*.ts` file.
- The `.env` file is user-local with API endpoint overrides; do not overwrite or normalize it unless explicitly
  requested.

## UI and Styling Rules

- Preserve the current visual direction: light, blue-led theme with glassy surfaces and soft gradients.
- Prefer existing CSS variables in `src/style/variables.scss` over hard-coded colors.
- Reuse shared surface tokens such as `--surface-color`, `--surface-border`, `--surface-shadow`, `--brand-primary`.
- Keep mobile layout quality in scope for every UI change. This app has explicit mobile player/search/sidebar behavior.
  - Mobile threshold: `window.innerWidth <= 800`.
  - Pull-to-refresh in `Middle.vue`, collapsible bottom player, full-screen expanded player.
- For list pickers and modal selections, favor full-row touch targets over tiny controls.
- Avoid introducing green as a primary accent unless the change is explicitly about success state.

## Verification Expectations

- For UI-only changes: run `npm run build`.
- For state or routing changes: run `npm run build` and inspect the affected route/component logic.
- If you modify layout around the bottom player, verify both:
    - desktop bottom player spacing
    - mobile collapsed player and mobile expanded player
- For API changes: verify the request URL, method, params/data shape, and response structure match the backend
  controller.

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
