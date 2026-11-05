// Predefined blog categories as required by specification
export const CATEGORIES = [
  'Technology',
  'Programming',
  'Education',
  'Lifestyle',
  'Travel',
  'Business',
  'Entertainment',
  'Other'
];

// Fallback high-quality placeholder image
export const DEFAULT_FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=1200&auto=format&fit=crop';

// Calculate word count cleanly
export function countWords(text) {
  if (!text || typeof text !== 'string') return 0;
  const trimmed = text.trim();
  if (!trimmed) return 0;
  return trimmed.split(/\s+/).filter(Boolean).length;
}

// Calculate estimated reading time (~200 words per minute)
export function getReadingTime(text) {
  const words = countWords(text);
  const minutes = Math.ceil(words / 200);
  return minutes <= 1 ? '1 min read' : `${minutes} min read`;
}

// Format date nicely (e.g., Nov 5, 2026)
export function formatDate(dateString) {
  if (!dateString) return 'Recent';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  } catch {
    return dateString;
  }
}

// Extract embeddable video URL for YouTube / Vimeo
export function getEmbedVideoUrl(url) {
  if (!url || typeof url !== 'string') return null;
  const trimmed = url.trim();

  // YouTube matchers
  const ytWatchMatch = trimmed.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/);
  if (ytWatchMatch && ytWatchMatch[1]) {
    return `https://www.youtube.com/embed/${ytWatchMatch[1]}`;
  }

  // YouTube Short matchers
  const ytShortMatch = trimmed.match(/youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/);
  if (ytShortMatch && ytShortMatch[1]) {
    return `https://www.youtube.com/embed/${ytShortMatch[1]}`;
  }

  // Vimeo matchers
  const vimeoMatch = trimmed.match(/vimeo\.com\/(\d+)/);
  if (vimeoMatch && vimeoMatch[1]) {
    return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
  }

  // Direct video file (mp4, webm) or standard embed
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed;
  }

  return null;
}

// Category badge color theme mapping
export function getCategoryBadgeClass(category) {
  const normalized = (category || '').toLowerCase();
  switch (normalized) {
    case 'technology':
      return 'badge-tech';
    case 'programming':
      return 'badge-code';
    case 'business':
      return 'badge-business';
    case 'lifestyle':
      return 'badge-lifestyle';
    case 'travel':
      return 'badge-travel';
    case 'education':
      return 'badge-education';
    case 'entertainment':
      return 'badge-entertainment';
    default:
      return 'badge-default';
  }
}

