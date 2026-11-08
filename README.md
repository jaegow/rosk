# rosk

A small, opinionated React starter kit. It ships a typed token theme, a compound-component design system, typed routes and copy, and a test setup that covers node, jsdom and a real browser. Use it as the starting point for a single-page app.

## Stack

- React 19 with the React Compiler (Babel preset through `@rolldown/plugin-babel`)
- Vite 8, TypeScript 7 (strict, `noUncheckedIndexedAccess`, `verbatimModuleSyntax`)
- Tailwind CSS 4, with tokens in `src/style/theme.css` and `cn()` (clsx plus tailwind-merge)
- radix-ui primitives
- react-router 8 (data router, library mode)
- TanStack Query 5
- react-hook-form and zod
- i18next and react-i18next, read through `useCopy()`
- oxlint, with React Compiler rules, stylistic rules and import sorting
- Vitest 5 with three projects: `unit-node`, `unit` (jsdom) and `browser` (Playwright Chromium, headless)

## Getting started

```sh
nvm use
npm install
npx playwright install chromium
npm run dev
```

With no `VITE_API_URL` set, `npm run dev` runs in mock mode: every service answers from an in-memory store, so the example list works with no backend. Put `VITE_API_URL=https://api.example.test` in a `.env.local` to send the same calls to a real server instead. Mock mode is development only: tests and production builds always use the HTTP services, and the build leaves the mock code out.

## Commands

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the Vite dev server |
| `npm run build` | Typecheck every project, then build to `dist/` |
| `npm run preview` | Serve the production build |
| `npm run check` | Lint and typecheck |
| `npm run lint` / `npm run lint.fix` | Lint only, or lint and auto-fix |
| `npm run lint.types` | Typecheck only |
| `npm run test:unit` | The `unit-node` and `unit` projects |
| `npm run test:browser` | The `browser` project |
| `npm run test:all` | Every project |
| `npm run check:skill-trees` | Lint every skill and its decision tree |
| `npm run validate` | `check`, `check:skill-trees` and `test:all` |

`scripts/check.js` takes `--fix`, `--no-lint`, `--no-types`, `--changed`, `--base <ref>` and file paths, which scope the linter. `scripts/test.js` takes `--no-unit`, `--no-browser`, `--changed` and `--base <ref>`. Every other argument goes to Vitest, for example `npm run test:all -- src/style -t contrast`. `--changed` compares against `origin/master` and falls back to `master` if that ref is missing. A suite that no given path can reach is skipped. Run either script with `--help` to list its options.

## Layout

```
index.html
public/                 static assets
scripts/                check and test runners, plus their tested helpers in scripts/lib
src/
  index.tsx             entry point
  design-system/        the barrel that re-exports every design-system member
  style/                theme.css (the only token source), cn, contrast, useThemeMode
  testing/              setup files and renderWithProviders helpers
  feature/
    app/                App, providers, router, query client, error boundary, not found
    route/              sitemap.ts (the one place routes are named), useRoute and the leave guard
    service/            request(), ServiceError, the service-error handler and mock mode
    example/            the Items slice: the pattern to copy for a new feature
    copy/               useCopy and the CopyKey type
    i18n/               i18next config and en.json
    context/            createStableContext
    home/               Home.page.tsx
    gallery/            Gallery.page.tsx
    <kebab-name>/       one folder per feature or component
```

## Routes

| Path | View |
| --- | --- |
| `/` | Home, linking to the gallery and the example slice |
| `/items` | The example Items list and its record modal |
| `/gallery` | The component gallery index |
| `/gallery/tokens` | Every token in `theme.css`, rendered |
| `/gallery/:entry` | One gallery entry with all its examples |

Routes are named once in `src/feature/route/sitemap.ts` and mounted in `src/feature/app/App.router.tsx`; each page is a lazy `*.page.tsx` module.

## The gallery

Every design-system member has a `<Name>.gallery.tsx` beside it that exports a named `gallery` object: a title, a group (`primitives`, `composites`, `form` or `patterns`) and its examples. The gallery page finds them with `import.meta.glob`, so a new entry needs no registration, and a unit test fails if a design-system folder has no entry. A `Page` rendered inside an entry renders a plain `div` and takes its heading level from the card around it, so the gallery keeps one `<main>` and one `<h1>`.

## The example slice

`src/feature/example/` is one working feature, end to end. Copy it, rename `Item`, and replace the fields.

| File | What it holds |
| --- | --- |
| `item.type.ts` | The record (`Item`), the payload (`ItemInput`), the form model and the `ItemService` contract |
| `item.service.ts` | The service entries, keyed `VERB.Resource` (`'GET.Items'`, `'PUT.Item'`), each one call through `request()` |
| `item.mock.ts` | An in-memory service with the same contract, used in mock mode and by tests |
| `item.util.ts` | Pure helpers: sort, URL params, the record-to-model and model-to-payload mappers, the status-to-chip map |
| `useItem.ts` | The domain hook: `useItem.query.useGetItems()`, `useItem.mutate.usePutItem({ onSuccess, onError })`, `useItem.sync.useSeedItem()` |
| `useItemStatusLabel.ts` | The status copy, as a lookup of literal `t()` calls |
| `Items.page.tsx` | The routed page: a `Page` gate, a sortable `Table`, and one detail `Modal` for create, edit and delete |

What the page shows:

- The list's sort and the open record live in the URL (`?sort=updatedAt&order=descending&item=item-2`). A row's name is a real link to its record.
- One modal carries every state of a record: create, edit, a delete confirm and a discard confirm. Closing a dirty form asks first. A close during a save closes without asking.
- The form is `useForm` with a zod schema. Save shows its own loading. Success merges the response into the detail cache, invalidates the list, closes the modal and raises a success toast. A failure goes to the shared service-error handler.
- A clean form re-seeds when the record changes under it, and a dirty one warns that it was updated elsewhere.

## Service layer

`src/feature/service/` is shared by every feature.

- `request<T>(path, { method, body, signal })` prefixes `import.meta.env.VITE_API_URL`, sends and reads JSON, and resolves an empty response as `undefined`. A failed response rejects with `ServiceError`, which carries `status` and a parsed `body` (`{ code?, fields? }`). An unreachable server rejects with status `0`. An abort passes through untouched.
- `useServiceError().handle(error, form?)` is the one place a failure is reported. Field-keyed errors (`body.fields`) land on their fields; a code the field message has no copy for shows the generic field error. Any other failure raises an error toast in our own copy, chosen by `serviceErrorOutcome(error)`, and never shows server text.
- `firstRead(query)` turns a query into a `Page` read. A first read that fails shows the page's failed state with Retry. A later refetch that fails keeps the rows on screen.
- A domain hook keys its queries `['VERB.Resource', arg]`. Each `queryFn` and `mutationFn` is an arrow that calls the service entry, so a test can swap the entry after mount. A mutation merges its response into the detail cache and invalidates the list; it never patches the list. Cache work that is not a mutation lives in the `sync` bucket.
- Bucket members are named as hooks (`useGetItems`, not `'GET.Items'`) so the React Compiler recognises each call as a hook.

### Leave guard

`LeaveGuardProvider` (mounted once in the router's root layout) holds the app's one `useBlocker`. Every `Form` registers its dirty state through `useLeaveGuard(form)`, so leaving a page with unsaved edits asks first, and closing the tab triggers the browser's own prompt. `Form.Foot`'s Cancel asks through the same dialog before it reverts a dirty draft. A form inside a `Modal` does not register, because the dialog guards its own close. A successful save that rebases the form can then navigate without being asked.

### Mocking in tests

Tests never mock `fetch` beyond the stub that rejects. They mock service entries through the setup cases in `src/testing/helpers/setup.items.ts`. Each case `vi.spyOn`s one entry, delegates it to a shared in-memory mock, and returns `{ mock, spy }`, so a journey sees its own writes. `request()`'s own test is the only test that stubs `fetch`. The Vitest config sets `restoreMocks`, `unstubGlobals` and `unstubEnvs`, so no test restores a spy, global or env by hand.

## Testing strategy

| File name | Project | Environment | Use it for |
| --- | --- | --- | --- |
| `*.test.unit.ts` | `unit-node` | node | Pure logic, token math, scripts |
| `*.test.unit.tsx`, `use*.test.unit.ts` | `unit` | jsdom | Rendering and hooks with Testing Library |
| `*.test.browser.tsx` | `browser` | Chromium | Real layout, CSS, focus, motion and routing |

The setup files in `src/testing/` load i18n and replace `fetch` with a stub that rejects loudly, so a test can never reach the network by accident. They also clear storage between tests. `setup.unit.ts` adds jest-dom, cleanup and jsdom polyfills (`ResizeObserver`, `scrollTo`, `getAnimations`, `matchMedia`).

To render with the app's providers, use `renderWithProviders(ui, { route, path, queryClient })`. Import it from `@/testing/render.unit` for Testing Library or from `@/testing/render.browser` for vitest-browser-react. Each call wraps the ui in a fresh test QueryClient, a memory data router and i18n, and returns the render result along with `queryClient` and `router`.

## Conventions in short

- Use named exports only, collected in one `export { ... }` block at the end of each file. The exceptions are lazy `*.page.tsx` modules and tool configs, which use default exports.
- Build compound components with `Object.assign(Root, { Part })`. Each part sets `data-slot` from a slot constant and a `displayName`.
- Create contexts with `createStableContext(import.meta.hot, 'Name', defaultValue)`.
- A control the user presses is a CTA in every name.
- Name routes only in `src/feature/route/sitemap.ts`, and navigate with `useRoute()`, never `useNavigate`.
- Keep copy keys flat under `en.json` and read them as literal `t('...')` calls from `const { t } = useCopy()`. A test fails on orphan or missing keys.
- Take ink from the `stress` ladder. Never use a status hue as text. A status surface is `bg-<hue>-tint`, or `bg-<hue> stress-xl-inverse`, with `text-stress` on top.
- Leave memoization to the React Compiler. Do not add `useMemo`, `useCallback` or `memo` for performance.
- Write no code comments. Let names and types carry the intent.

The full rules live in `CLAUDE.md` and in the skills under `.claude/skills/`.
