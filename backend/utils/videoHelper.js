/**
 * Detect video platform from URL
 * @param {string} url - Video URL
 * @returns {object} { platform, videoId, embedUrl }
 */
function detectVideoPlatform(url) {
  if (!url) return { platform: 'unknown', videoId: null, embedUrl: null };

  const urlLower = url.toLowerCase();

  // YouTube detection
  if (urlLower.includes('youtube.com') || urlLower.includes('youtu.be')) {
    const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/ ]{11})/;
    const match = url.match(youtubeRegex);
    if (match && match[1]) {
      return {
        platform: 'youtube',
        videoId: match[1],
        embedUrl: `https://www.youtube.com/embed/${match[1]}`
      };
    }
  }

  // Vimeo detection
  if (urlLower.includes('vimeo.com')) {
    const vimeoRegex = /vimeo\.com\/(\d+)/;
    const match = url.match(vimeoRegex);
    if (match && match[1]) {
      return {
        platform: 'vimeo',
        videoId: match[1],
        embedUrl: `https://player.vimeo.com/video/${match[1]}`
      };
    }
  }

  // AWS S3 detection
  if (urlLower.includes('s3.amazonaws.com') || urlLower.includes('s3-') || urlLower.match(/\.s3\./)) {
    return {
      platform: 's3',
      videoId: null,
      embedUrl: url // Use direct URL for S3
    };
  }

  // Cloudflare Stream detection
  if (urlLower.includes('cloudflarestream.com') || urlLower.includes('videodelivery.net')) {
    return {
      platform: 'cloudflare',
      videoId: null,
      embedUrl: url
    };
  }

  // Wistia detection
  if (urlLower.includes('wistia.com')) {
    return {
      platform: 'wistia',
      videoId: null,
      embedUrl: url
    };
  }

  // Dailymotion detection
  if (urlLower.includes('dailymotion.com')) {
    const dailymotionRegex = /dailymotion\.com\/video\/([a-zA-Z0-9]+)/;
    const match = url.match(dailymotionRegex);
    if (match && match[1]) {
      return {
        platform: 'dailymotion',
        videoId: match[1],
        embedUrl: `https://www.dailymotion.com/embed/video/${match[1]}`
      };
    }
  }

  // Default: custom/unknown platform
  // Check if it's a direct video file
  const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov', '.avi'];
  const hasVideoExtension = videoExtensions.some(ext => urlLower.includes(ext));

  return {
    platform: hasVideoExtension ? 'direct' : 'custom',
    videoId: null,
    embedUrl: url
  };
}

/**
 * Validate video URL
 * @param {string} url - Video URL to validate
 * @returns {boolean}
 */
function isValidVideoUrl(url) {
  if (!url || typeof url !== 'string') return false;

  try {
    const urlObj = new URL(url);
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
  } catch (e) {
    return false;
  }
}

/**
 * Get video thumbnail URL (platform-specific)
 * @param {string} url - Video URL
 * @param {string} platform - Video platform
 * @param {string} videoId - Video ID
 * @returns {string|null} Thumbnail URL
 */
function getVideoThumbnail(url, platform, videoId) {
  if (platform === 'youtube' && videoId) {
    return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
  }

  if (platform === 'vimeo' && videoId) {
    // Vimeo requires API call for thumbnails, return placeholder
    return null;
  }

  // For other platforms, return null (use default thumbnail)
  return null;
}

/**
 * Extract video duration from URL (if available)
 * @param {string} url - Video URL
 * @returns {number|null} Duration in seconds
 */
function extractVideoDuration(url) {
  // This would typically require API calls to video platforms
  // For now, return null and let users manually input duration
  return null;
}

module.exports = {
  detectVideoPlatform,
  isValidVideoUrl,
  getVideoThumbnail,
  extractVideoDuration
};
