export function monetiseExternal(url: string) {
  const id = process.env.SKIMLINKS_SITE_ID;
  if (!id) return url; // no monetisation configured
  // Skimlinks Link API style deep link
  return `https://go.skimresources.com/?id=${id}&xs=1&url=${encodeURIComponent(url)}`;
}
