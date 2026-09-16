import React, { useState, useEffect, useRef, useCallback } from 'react';
import { musicTracks } from '../data/musicData';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  VolumeX, 
  ExternalLink,
  Sparkles
} from 'lucide-react';
import './MusicPage.css';

export default function MusicPage() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);

  const audioRef = useRef(null);
  const dragStartX = useRef(0);
  const dragCurrentX = useRef(0);
  const carouselRef = useRef(null);
  const hasDragged = useRef(false);
  const progressBarRef = useRef(null);

  const total = musicTracks.length;
  const SWIPE_THRESHOLD = 45;
  const activeTrack = musicTracks[activeIndex];

  // Format time (seconds -> mm:ss)
  const formatTime = (secs) => {
    if (isNaN(secs) || secs === 0) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // Switch Track
  const goToTrack = useCallback((index) => {
    const next = ((index % total) + total) % total;
    setActiveIndex(next);
    setDragOffset(0);
    setCurrentTime(0);

    if (audioRef.current) {
      audioRef.current.src = musicTracks[next].audioSrc;
      audioRef.current.currentTime = 0;
      if (isPlaying) {
        audioRef.current.play().catch(() => {});
      }
    }
  }, [total, isPlaying]);

  const goPrev = useCallback(() => goToTrack(activeIndex - 1), [activeIndex, goToTrack]);
  const goNext = useCallback(() => goToTrack(activeIndex + 1), [activeIndex, goToTrack]);

  // Toggle Play / Pause
  const togglePlay = useCallback(() => {
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
  }, [isPlaying]);

  // Keyboard Navigation
  useEffect(() => {
    const handleKey = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        goPrev();
      }
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        goNext();
      }
      if (e.key === ' ') {
        e.preventDefault();
        togglePlay();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [goPrev, goNext, togglePlay]);

  // Audio lifecycle
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.src = activeTrack.audioSrc;
    audio.volume = isMuted ? 0 : 0.85;

    const onTimeUpdate = () => setCurrentTime(audio.currentTime);
    const onLoadedMetadata = () => setDuration(audio.duration || 0);
    const onEnded = () => goNext();

    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('loadedmetadata', onLoadedMetadata);
    audio.addEventListener('ended', onEnded);

    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
      audio.removeEventListener('ended', onEnded);
    };
  }, [activeTrack, goNext, isMuted]);

  // Seek on scrubber
  const handleSeek = (e) => {
    if (!audioRef.current || !progressBarRef.current) return;
    const rect = progressBarRef.current.getBoundingClientRect();
    const pos = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const newTime = pos * (duration || 1);
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  // Drag handlers for smooth cover flow swipe
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

  // Circular offset logic
  const getCardOffset = (idx) => {
    let diff = idx - activeIndex;
    if (diff > total / 2) diff -= total;
    if (diff < -total / 2) diff += total;
    return diff;
  };

  return (
    <main className="junk-drawer-page">
      <audio ref={audioRef} preload="metadata" />

      {/* Cinematic Studio Backdrop with Soft Atmospheric Illumination */}
      <div 
        className="studio-ambient-light"
        style={{
          background: `radial-gradient(ellipse 70% 50% at 50% 40%, ${activeTrack.accentColor}28 0%, rgba(10, 10, 14, 0) 70%)`
        }}
      />
      <div className="studio-subtle-grid" />

      {/* Hero Header */}
      <header className="junk-drawer-header">
        <div className="junk-badge">
          <span className="junk-badge-dot" />
          <span>HEAVY ROTATION · 33⅓ RPM</span>
        </div>
        <h1 className="junk-drawer-title">
          junk drawer
        </h1>
        <p className="junk-drawer-subtitle">
          The records looping in my headphones during wireframing, high-speed UI hackathons, and
          late-night projection mapping experiments. Click the vinyl to play.
        </p>
      </header>

      {/* 3D Gatefold Cover Flow Carousel */}
      <section
        className={`coverflow-stage ${isDragging ? 'is-dragging' : ''}`}
        ref={carouselRef}
        onMouseDown={onMouseDown}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        data-cursor="drag"
      >
        <div className="coverflow-center-track">
          {musicTracks.map((track, idx) => {
            const offset = getCardOffset(idx);
            const isActive = offset === 0;
            const absOffset = Math.abs(offset);

            if (absOffset > 2) return null; // Render 5 visible items

            // 3D placement math
            const posX = offset * 260 + dragOffset;
            const rotY = offset * -26;
            const scale = isActive ? 1 : absOffset === 1 ? 0.78 : 0.58;
            const opacity = isActive ? 1 : absOffset === 1 ? 0.55 : 0.25;
            const zIndex = 10 - absOffset;

            return (
              <div
                key={track.id}
                className={`coverflow-item ${isActive ? 'is-active' : ''}`}
                style={{
                  transform: `translate(calc(-50% + ${posX}px), 0) scale(${scale}) rotateY(${rotY}deg)`,
                  opacity: opacity,
                  zIndex: zIndex,
                  transition: isDragging
                    ? 'none'
                    : 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.4s ease',
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  if (hasDragged.current) return;
                  if (offset === -1) goPrev();
                  else if (offset === 1) goNext();
                  else if (isActive) togglePlay();
                }}
              >
                {/* Vinyl Record Disc (Slides out of active sleeve) */}
                <div 
                  className={`gatefold-vinyl-disc ${isActive ? 'disc-slid-out' : ''} ${isActive && isPlaying ? 'is-spinning' : ''}`}
                  title={isActive ? (isPlaying ? 'Click to Pause' : 'Click to Play') : 'Switch track'}
                >
                  <div className="vinyl-sheen-highlight" />
                  <div className="vinyl-micro-groove g1" />
                  <div className="vinyl-micro-groove g2" />
                  <div className="vinyl-micro-groove g3" />
                  <div className="vinyl-micro-groove g4" />
                  <div className="vinyl-center-art">
                    <img src={track.coverUrl} alt="" className="vinyl-art-img" />
                    <div className="vinyl-spindle" />
                  </div>
                </div>

                {/* Album Jacket Sleeve with tactile paper edge */}
                <div className="album-jacket-sleeve">
                  <img
                    src={track.coverUrl}
                    alt={`${track.title} by ${track.artist}`}
                    className="jacket-art"
                    draggable="false"
                  />
                  <div className="jacket-specular-sheen" />
                  <div className="jacket-spine-border" />
                  
                  {/* Floating Play Indicator when active */}
                  {isActive && (
                    <div className="jacket-play-badge">
                      {isPlaying ? (
                        <Pause size={18} className="badge-icon" />
                      ) : (
                        <Play size={18} className="badge-icon offset-icon" />
                      )}
                    </div>
                  )}
                </div>

                {/* Studio Floor Reflection */}
                <div className="jacket-floor-reflection">
                  <img
                    src={track.coverUrl}
                    alt=""
                    className="reflection-art"
                    draggable="false"
                  />
                  <div className="reflection-fade-mask" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Modern Floating Player HUD */}
      <footer className="player-hud-container">
        <div className="player-hud-chassis">
          
          {/* Left: Track Information & Designer Liner Note */}
          <div className="hud-track-meta">
            <div className="hud-title-row">
              <span className="hud-title">{activeTrack.title}</span>
              <span className="hud-vibe-pill" style={{ '--vibe-color': activeTrack.accentColor }}>
                {activeTrack.vibe}
              </span>
            </div>
            <p className="hud-artist">{activeTrack.artist} · <span className="hud-album">{activeTrack.album} ({activeTrack.year})</span></p>
            {activeTrack.note && (
              <p className="hud-designer-note">
                <Sparkles size={11} className="note-sparkle" />
                <span>{activeTrack.note}</span>
              </p>
            )}
          </div>

          {/* Center: Playback Controls & Scrubber */}
          <div className="hud-center-controls">
            <div className="hud-buttons-row">
              <button 
                className="hud-btn skip" 
                onClick={goPrev} 
                title="Previous Track (Left Arrow)"
              >
                <SkipBack size={16} />
              </button>

              <button 
                className={`hud-btn play-pause ${isPlaying ? 'is-playing' : ''}`}
                onClick={togglePlay}
                title="Play/Pause (Space)"
              >
                {isPlaying ? <Pause size={20} /> : <Play size={20} className="play-offset" />}
              </button>

              <button 
                className="hud-btn skip" 
                onClick={goNext} 
                title="Next Track (Right Arrow)"
              >
                <SkipForward size={16} />
              </button>
            </div>

            {/* Scrubber Progress Bar */}
            <div className="hud-scrubber-row">
              <span className="time-val">{formatTime(currentTime)}</span>
              <div 
                className="hud-scrubber-track" 
                ref={progressBarRef}
                onClick={handleSeek}
              >
                <div 
                  className="hud-scrubber-fill"
                  style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
                />
              </div>
              <span className="time-val">{formatTime(duration)}</span>
            </div>
          </div>

          {/* Right: Soundwave Equalizer, Mute & External Link */}
          <div className="hud-aux-panel">
            {/* Pulsing Visualizer Equalizer */}
            <div className={`hud-soundwave ${isPlaying ? 'is-active' : ''}`}>
              <span className="eq-bar eq-1" />
              <span className="eq-bar eq-2" />
              <span className="eq-bar eq-3" />
              <span className="eq-bar eq-4" />
              <span className="eq-bar eq-5" />
            </div>

            {/* Mute Button */}
            <button 
              className="hud-aux-btn"
              onClick={() => setIsMuted(!isMuted)}
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
            </button>

            {/* Spotify Link */}
            <a 
              href={activeTrack.spotifyUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="hud-aux-btn spotify"
              title="Open in Spotify"
            >
              <ExternalLink size={15} />
              <span>Spotify</span>
            </a>
          </div>

        </div>

        {/* Keyboard Controls Hint */}
        <div className="hud-keyboard-hints">
          <span><kbd>←</kbd> PREV</span>
          <span><kbd>SPACE</kbd> {isPlaying ? 'PAUSE' : 'PLAY'}</span>
          <span><kbd>→</kbd> NEXT</span>
        </div>
      </footer>

    </main>
  );
}
