import React, { useState, useCallback, useEffect, useRef } from 'react';
import { musicTracks } from '../data/musicData';
import './MusicPage.css';

export default function MusicPage() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const audioRef = useRef(null);
  const dragStartX = useRef(0);
  const dragCurrentX = useRef(0);
  const carouselRef = useRef(null);
  const hasDragged = useRef(false);

  const total = musicTracks.length;
  const SWIPE_THRESHOLD = 50;

  const activeTrack = musicTracks[activeIndex];

  // ── Switch Track & Auto-play if already playing ──
  const goToTrack = useCallback((index) => {
    const next = ((index % total) + total) % total;
    setActiveIndex(next);
    setDragOffset(0);

    if (audioRef.current) {
      audioRef.current.src = musicTracks[next].audioSrc;
      audioRef.current.currentTime = 0;
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => {
          // Deferred until user interaction
        });
    }
  }, [total]);

  const goPrev = useCallback(() => goToTrack(activeIndex - 1), [activeIndex, goToTrack]);
  const goNext = useCallback(() => goToTrack(activeIndex + 1), [activeIndex, goToTrack]);

  // Initial track source setup
  useEffect(() => {
    if (audioRef.current && activeTrack.audioSrc) {
      audioRef.current.src = activeTrack.audioSrc;
    }
  }, [activeTrack.audioSrc]);

  // ── Toggle Play / Pause Directly Through Disc / Cover ──
  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch((err) => console.log('Playback error:', err));
    }
  };

  // ── Keyboard Controls (Left/Right to switch, Space to play/pause) ──
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'ArrowLeft') goPrev();
      if (e.key === 'ArrowRight') goNext();
      if (e.key === ' ') {
        e.preventDefault();
        togglePlay();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [goPrev, goNext, isPlaying]);

  // ── Realtime Draggable Slide Gesture ──
  const handleDragStart = useCallback((clientX) => {
    setIsDragging(true);
    dragStartX.current = clientX;
    dragCurrentX.current = clientX;
    hasDragged.current = false;
  }, []);

  const handleDragMove = useCallback((clientX) => {
    if (!isDragging) return;
    dragCurrentX.current = clientX;
    const diff = clientX - dragStartX.current;
    if (Math.abs(diff) > 5) hasDragged.current = true;
    setDragOffset(diff);
  }, [isDragging]);

  const handleDragEnd = useCallback(() => {
    if (!isDragging) return;
    setIsDragging(false);
    const diff = dragCurrentX.current - dragStartX.current;

    if (Math.abs(diff) > SWIPE_THRESHOLD) {
      if (diff < 0) goNext();
      else goPrev();
    } else {
      setDragOffset(0);
    }
  }, [isDragging, goNext, goPrev]);

  const onMouseDown = (e) => {
    e.preventDefault();
    handleDragStart(e.clientX);
  };
  const onTouchStart = (e) => handleDragStart(e.touches[0].clientX);
  const onTouchMove = (e) => handleDragMove(e.touches[0].clientX);
  const onTouchEnd = () => handleDragEnd();

  useEffect(() => {
    if (!isDragging) return;
    const onMove = (e) => handleDragMove(e.clientX);
    const onUp = () => handleDragEnd();
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
  }, [isDragging, handleDragMove, handleDragEnd]);

  // Offset distance calculation for circular carousel
  const getCardOffset = (idx) => {
    let diff = idx - activeIndex;
    if (diff > total / 2) diff -= total;
    if (diff < -total / 2) diff += total;
    return diff;
  };

  return (
    <main className="music-page">
      {/* HTML5 Audio Player */}
      <audio
        ref={audioRef}
        loop
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />

      {/* Dynamic Ambient Color Aura (Spreads across full page) */}
      <div
        className="ambient-aura"
        style={{
          background: `radial-gradient(ellipse 95% 85% at 50% 45%, ${activeTrack.accentColor}45 0%, ${activeTrack.accentColor}20 40%, rgba(14, 14, 14, 0) 75%)`,
        }}
      />
      <div
        className="ambient-aura-secondary"
        style={{
          background: `radial-gradient(circle at 50% 60%, ${activeTrack.accentColor}25 0%, transparent 60%)`,
        }}
      />

      {/* Hero Header */}
      <section className="music-hero">
        <span className="music-hero-badge">Experimental Playground</span>
        <h1 className="music-hero-title">
          <span>junk</span> drawer
        </h1>
        <p className="music-hero-sub">
          A curated selection of tracks that live in my head rent-free.
          Click the vinyl or album cover to play. Drag to switch.
        </p>
      </section>

      {/* 3D Cover Flow Carousel */}
      <section
        className={`music-carousel-stage ${isDragging ? 'is-dragging' : ''}`}
        ref={carouselRef}
        onMouseDown={onMouseDown}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <div className="music-carousel-center-container">
          {musicTracks.map((track, idx) => {
            const offset = getCardOffset(idx);
            const isActive = offset === 0;
            const absOffset = Math.abs(offset);

            if (absOffset > 2) return null; // Render 5 visible cards around active

            // Dynamic 3D transform calculations
            const posX = offset * 280 + dragOffset;
            const rotY = offset * -22;
            const scale = isActive ? 1 : offset === -1 || offset === 1 ? 0.78 : 0.55;
            const opacity = isActive ? 1 : offset === -1 || offset === 1 ? 0.45 : 0.15;
            const zIndex = 10 - absOffset;

            return (
              <div
                key={track.id}
                className={`album-card-item ${isActive ? 'active' : ''}`}
                style={{
                  transform: `translate(calc(-50% + ${posX}px), 0) scale(${scale}) rotateY(${rotY}deg)`,
                  opacity: opacity,
                  zIndex: zIndex,
                  transition: isDragging ? 'none' : 'transform 0.55s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.55s ease',
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  if (hasDragged.current) return;
                  if (offset === -1) goPrev();
                  if (offset === 1) goNext();
                  if (isActive) togglePlay();
                }}
              >
                {/* Spinning Vinyl Disc — Click to Play/Pause */}
                <div
                  className={`vinyl-disc ${isActive ? 'active-disc' : ''} ${isPlaying ? 'spinning' : ''}`}
                  onClick={(e) => {
                    if (isActive) {
                      e.stopPropagation();
                      togglePlay();
                    }
                  }}
                >
                  <div className="vinyl-ring ring-1" />
                  <div className="vinyl-ring ring-2" />
                  <div className="vinyl-ring ring-3" />
                  <div
                    className="vinyl-center-label"
                    style={{ backgroundImage: `url(${track.coverUrl})` }}
                  />
                </div>

                {/* Album Artwork Container — Click to Play/Pause */}
                <div className="album-artwork-container">
                  <img
                    className="album-artwork"
                    src={track.coverUrl}
                    alt={`${track.title} by ${track.artist}`}
                    loading="lazy"
                    draggable="false"
                  />
                  {isActive && (
                    <div className="play-pulse-overlay">
                      <div className="play-pulse-icon">
                        {isPlaying ? (
                          <svg viewBox="0 0 24 24" fill="currentColor">
                            <rect x="6" y="4" width="4" height="16" rx="1" />
                            <rect x="14" y="4" width="4" height="16" rx="1" />
                          </svg>
                        ) : (
                          <svg viewBox="0 0 24 24" fill="currentColor">
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Track Details */}
                <div className="track-info">
                  <div className="track-title-row">
                    <span className="track-title">{track.title}</span>
                    {isActive && isPlaying && (
                      <div className="soundwave-equalizer">
                        <span className="bar bar-1" style={{ background: track.accentColor }} />
                        <span className="bar bar-2" style={{ background: track.accentColor }} />
                        <span className="bar bar-3" style={{ background: track.accentColor }} />
                        <span className="bar bar-4" style={{ background: track.accentColor }} />
                      </div>
                    )}
                  </div>
                  <div className="track-artist">{track.artist}</div>
                  <div className="track-meta">{track.album} · {track.year}</div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
}
