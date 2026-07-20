import { useSyncExternalStore } from "react";

const emptySubscribe = () => () => {};

// For values that only exist client-side (e.g. gating a component that
// depends on a client-only hook like useSession, to avoid a hydration
// mismatch): true after mount, false during SSR and on the client's first
// render — so the first client render always matches the server's.
export function useIsClient() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
}
