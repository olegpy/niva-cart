/**
 * Public demo APIs return messy image URLs (junk hosts, SVG defaults, dead CDNs).
 * Normalize once before `next/image`
 */

const FALLBACK_IMAGE = 'https://placehold.co/600x400.png';

const RASTER_EXT = /\.(png|jpe?g|gif|webp|avif)$/i;

const BLOCKED_HOSTS = new Set([
  'test.url',
  'example.com',
  'example.org',
  'localhost',
]);

/** Safe string + http(s) only + block obvious junk; invalid → fallback */
function sanitizeUserImageUrl(url: string): string {
  const trimmed = String(url).trim();
  if (!trimmed) return FALLBACK_IMAGE;
  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return FALLBACK_IMAGE;
    }
    if (BLOCKED_HOSTS.has(parsed.hostname.toLowerCase())) {
      return FALLBACK_IMAGE;
    }
    return trimmed;
  } catch {
    return FALLBACK_IMAGE;
  }
}

/** placeimg.com often fails server-side fetches → `/_next/image` 400 */
function replaceDeadPlaceholderCdn(url: string): string {
  try {
    if (new URL(url).hostname.toLowerCase() === 'placeimg.com') {
      return 'https://placehold.co/640x480.png';
    }
    return url;
  } catch {
    return url;
  }
}

/** Bare placehold path serves SVG; Next image optimizer rejects remote SVG → use `.png` */
function appendPlaceholdPngIfNeeded(url: string): string {
  try {
    const parsed = new URL(url);
    if (parsed.hostname !== 'placehold.co' || RASTER_EXT.test(parsed.pathname)) {
      return url;
    }
    parsed.pathname = `${parsed.pathname}.png`;
    return parsed.toString();
  } catch {
    return url;
  }
}

function toNextImageSafeUrl(url: string): string {
  return appendPlaceholdPngIfNeeded(
    replaceDeadPlaceholderCdn(sanitizeUserImageUrl(url))
  );
}

/** Use on API `images` arrays before rendering with `next/image`. */
export function normalizeProductImagesFromApi(raw: unknown): string[] {
  const list = Array.isArray(raw) ? raw : [];
  const urls = list.map((u) => toNextImageSafeUrl(String(u)));
  return urls.length > 0 ? urls : [FALLBACK_IMAGE];
}
