export function getYouTubeEmbedUrl(url?: string) {
  if (!url) {
    return null;
  }

  try {
    const parsed = new URL(url);

    // youtu.be/ID
    if (parsed.hostname.includes("youtu.be")) {
      return `https://www.youtube.com/embed${parsed.pathname}`;
    }

    // youtube.com/watch?v=ID
    const videoId = parsed.searchParams.get("v");
    if (videoId) {
      return `https://www.youtube.com/embed/${videoId}`;
    }

    if (parsed.pathname.startsWith("/embed/")) {
      return url;
    }

    return null;
  } catch {
    return null;
  }
}
