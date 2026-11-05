import React from 'react';
import { PlayCircle } from 'lucide-react';
import { getEmbedVideoUrl } from '../utils/helpers';

export default function VideoPlayer({ videoUrl, title = 'Blog Video' }) {
  if (!videoUrl) return null;

  const embedUrl = getEmbedVideoUrl(videoUrl);
  if (!embedUrl) return null;

  const isDirectFile = embedUrl.endsWith('.mp4') || embedUrl.endsWith('.webm') || embedUrl.endsWith('.ogg');

  return (
    <div className="video-player-section">
      <div className="video-section-header">
        <PlayCircle size={18} className="video-icon" />
        <h4 className="video-section-title">Accompanying Media & Video</h4>
      </div>
      <div className="video-responsive-wrapper">
        {isDirectFile ? (
          <video
            controls
            src={embedUrl}
            className="video-player-element"
            preload="metadata"
          >
            Your browser does not support the video tag.
          </video>
        ) : (
          <iframe
            src={embedUrl}
            title={title}
            className="video-player-element"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        )}
      </div>
    </div>
  );
}

