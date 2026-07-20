// Hosts configured in next.config.ts's images.remotePatterns. Recipe photos
// can be arbitrary user-supplied URLs (via the Add Recipe form), which can't
// go through next/image unless their host is allowlisted there — so this is
// used to decide next/image vs. a plain <img> fallback per-image, rather
// than letting an unconfigured host crash the whole page.
const OPTIMIZED_IMAGE_HOSTS = new Set([
  "images.unsplash.com",
  "lh3.googleusercontent.com",
  "placehold.co",
]);

export function isOptimizableImageUrl(url: string): boolean {
  try {
    return OPTIMIZED_IMAGE_HOSTS.has(new URL(url).hostname);
  } catch {
    return false;
  }
}
