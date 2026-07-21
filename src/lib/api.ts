import axios from "axios";

// Every call site already includes the `/api/...` prefix in its path (e.g.
// `api.get("/api/recipes/mine")`), so baseURL itself must NOT also add
// `/api` — that would double it up into `/api/api/...`.
//
// In the browser, baseURL is left empty so requests resolve relative to the
// current page (e.g. "/api/recipes"), going through Next.js's same-origin
// /api rewrite (see next.config.ts) so the session cookie is first-party.
// There's no browser cookie jar to protect on the server, and a relative
// baseURL can't resolve there anyway, so server-side requests (e.g. the
// Recipe Details Server Component) call the backend origin directly.
// Keep this default in sync with the one in next.config.ts.
const backendOrigin =
  process.env.BACKEND_ORIGIN ?? "https://mealmind-backend-aw95.onrender.com";

export const api = axios.create({
  baseURL: typeof window === "undefined" ? backendOrigin : "",
  withCredentials: true,
});
