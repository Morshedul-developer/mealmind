@AGENTS.md

# MealMind AI — Frontend

Frontend for MealMind, an AI-assisted recipe app. Users browse/search recipes,
generate new recipes from ingredients via AI, chat with an AI recipe
assistant, and manage their own recipes.

## Tech stack

- Next.js (App Router, TypeScript)
- Tailwind CSS
- TanStack Query for server state / data fetching
- Axios for HTTP requests
- Better Auth (React client) for authentication (email/password + Google OAuth)
- Recharts for any charts/graphs

## Backend

Separate Express backend, set via `BACKEND_ORIGIN` (default
`http://localhost:5000`; production defaults to the deployed Render URL if
unset). The frontend and backend live on different domains in production
(Vercel + Render), so the browser never calls the backend directly — that
would make the session cookie third-party, which Chrome Incognito already
blocks. Instead, `next.config.ts` rewrites `/api/:path*` to
`${BACKEND_ORIGIN}/api/:path*`, and browser-side code (`src/lib/api.ts`,
`src/lib/auth-client.ts`, `src/lib/chat-api.ts`) calls the relative `/api/*`
path so requests are same-origin from the browser's perspective. Server-side
code (Server Components) calls `BACKEND_ORIGIN` directly, since a relative
URL can't resolve there and there's no browser cookie jar to protect.

All API responses follow:

```ts
{ success: boolean, data?: T, error?: string }
```

### Endpoints

- Auth: mounted at `/api/auth/*` (Better Auth — email/password + Google OAuth)
- `GET /api/recipes` — query: `search`, `cuisineType`, `dietType`, `sort`, `page`, `limit`
- `GET /api/recipes/:id`
- `GET /api/recipes/mine` (protected)
- `POST /api/recipes` (protected)
- `DELETE /api/recipes/:id` (protected)
- `POST /api/ai/generate-recipe` (protected) — body: `{ ingredients[], cuisineType, dietType, length }`
- `POST /api/ai/chat` (protected) — body: `{ message, conversationId?, recipeId? }`
- `POST /api/ai/chat/stream` (protected, SSE)

Auth uses Better Auth's session cookie — all requests to the backend must be
made with credentials included (`withCredentials: true` on the shared axios
instance).

## Folder structure

```
src/
  app/                 App Router routes, layout.tsx, providers.tsx
  components/
    ui/                Generic, design-system-level UI primitives
    recipe/             Recipe-specific components (cards, forms, lists...)
    layout/             App shell components (header, nav, footer...)
  hooks/               Shared React hooks
  types/               Shared TypeScript types (recipe.ts, etc.)
  lib/
    api.ts             Shared axios instance (baseURL + withCredentials)
    auth-client.ts      Better Auth React client (signIn, signUp, signOut, useSession)
```

## Design system

All pages and components must stay visually consistent with this design
system — it was established in the Stitch design mockups and should not be
deviated from without an explicit design update.

### Colors

| Role       | Name      | Hex       |
| ---------- | --------- | --------- |
| Primary    | Terracotta | `#E8623C` |
| Secondary  | Olive     | `#3E5C3E` |
| Background | Cream     | `#FFF8F0` |
| Text       | Charcoal  | `#22201D` |

### Typography

- Headings: **Fraunces**
- Body: **Inter**

### Spacing & shape

- Base spacing grid: **8px**
- Card border-radius: **16px**
- Card padding: **24px**
