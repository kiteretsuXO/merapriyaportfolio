import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { musicTracks } from '../data/musicData';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  VolumeX, 
  ExternalLink,
  Disc,
  Radio,
  Sliders,
  Sparkles
} from 'lucide-react';
import './MusicPage.css';

export default function MusicPage() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [rpm, setRpm] = useState(33); // 33 or 45
  const [volume, setVolume] = useState(0.85);
  const [isMuted, setIsMuted] = useState(false);

  const audioRef = useRef(null);
  const progressBarRef = useRef(null);

  const activeTrack = musicTracks[activeIndex];
  const total = musicTracks.length;

  // Format time (seconds -> mm:ss)
  const formatTime = (secs) => {
    if (isNaN(secs) || secs === 0) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // Switch to specific track
  const goToTrack = useCallback((index) => {
    const next = ((index % total) + total) % total;
    setActiveIndex(next);
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

  // Toggle Play/Pause
  const togglePlay = useCallback(() => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch((err) => console.log('Audio playback prevented:', err));
    }
  }, [isPlaying]);

  // Keyboard Shortcuts (Space: Play/Pause, Arrows: Next/Prev)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      if (e.key === ' ') {
        e.preventDefault();
        togglePlay();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        goNext();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        goPrev();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [togglePlay, goNext, goPrev]);

  // Handle Audio events
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.src = activeTrack.audioSrc;
    audio.volume = isMuted ? 0 : volume;

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
  }, [activeTrack, goNext, volume, isMuted]);

  // Seek on timeline
  const handleSeek = (e) => {
    if (!audioRef.current || !progressBarRef.current) return;
    const rect = progressBarRef.current.getBoundingClientRect();
    const pos = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const newTime = pos * (duration || 1);
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  // Toggle Volume / Mute
  const toggleMute = () => {
    if (!audioRef.current) return;
    if (isMuted) {
      audioRef.current.volume = volume;
      setIsMuted(false);
    } else {
      audioRef.current.volume = 0;
      setIsMuted(true);
    }
  };

  return (
    <div className="fun-page-view">
      <audio ref={audioRef} preload="metadata" />

      <div className="fun-page-container">
        {/* ═══════ Page Header ═══════ */}
        <header className="fun-header">
          <div className="fun-badge-tag">
            <span className="badge-pulse" />
            <span>03 / AUDIO PLAYGROUND · 33⅓ RPM</span>
          </div>
          <h1 className="fun-title">The Sound of Flow State</h1>
          <p className="fun-subtitle">
            A physical archive of records looping in my headphones during wireframing, high-speed UI
            sprints, and late-night projection mapping experiments. Drop a record onto the deck.
          </p>
        </header>

        {/* ═══════ Hi-Fi Turntable Workstation Console ═══════ */}
        <div className="turntable-console">
          <div className="console-chassis">
            
            {/* Top Brushed Faceplate Header */}
            <div className="chassis-header-strip">
              <div className="chassis-brand">
                <Radio size={14} className="brand-icon" />
                <span className="brand-name">KALASH HI-FI · MODEL-26</span>
              </div>
              <div className="chassis-specs">
                <span className="spec-indicator active">DIRECT DRIVE</span>
                <span className="spec-separator">/</span>
                <span className="spec-indicator">QUARTZ LOCK</span>
                <span className="spec-separator">/</span>
                <span className="spec-indicator">STEREO PHONO</span>
              </div>
            </div>

            <div className="console-main-deck">
              {/* ── Left: The Turntable Deck & Tonearm ── */}
              <div className="turntable-platter-area">
                <div className="platter-well">
                  {/* Heavy Cast Aluminum Platter */}
                  <div className="aluminum-platter">
                    {/* The Vinyl Disc Record */}
                    <div
                      className={`vinyl-record ${isPlaying ? 'spinning' : ''}`}
                      style={{
                        animationDuration: rpm === 45 ? '1.8s' : '2.4s',
                      }}
                      onClick={togglePlay}
                      title={isPlaying ? 'Click to pause vinyl' : 'Click to spin vinyl'}
                    >
                      {/* Vinyl Groove Rings */}
                      <div className="record-sheen" />
                      <div className="groove-layer groove-1" />
                      <div className="groove-layer groove-2" />
                      <div className="groove-layer groove-3" />
                      <div className="groove-layer groove-4" />

                      {/* Center Record Paper Label */}
                      <div className="record-center-label">
                        <img
                          src={activeTrack.coverUrl}
                          alt={activeTrack.title}
                          className="center-label-art"
                        />
                        <div className="center-spindle-hole" />
                      </div>
                    </div>
                  </div>

                  {/* Mechanical Tonearm Assembly */}
                  <div className={`tonearm-assembly ${isPlaying ? 'tonearm-on-record' : 'tonearm-at-rest'}`}>
                    <div className="tonearm-gimbal-base">
                      <div className="counterweight" />
                    </div>
                    <div className="tonearm-wand">
                      <div className="cartridge-headshell">
                        <div className="stylus-needle" />
                      </div>
                    </div>
                  </div>

                  {/* Pitch / Speed Toggle Switch */}
                  <div className="deck-speed-toggle">
                    <button
                      className={`speed-btn ${rpm === 33 ? 'active' : ''}`}
                      onClick={() => setRpm(33)}
                    >
                      33 RPM
                    </button>
                    <button
                      className={`speed-btn ${rpm === 45 ? 'active' : ''}`}
                      onClick={() => setRpm(45)}
                    >
                      45 RPM
                    </button>
                  </div>
                </div>
              </div>

              {/* ── Right: Now Playing Deck, Controls & Notes ── */}
              <div className="turntable-info-panel">
                
                {/* Record Sleeve & Track Meta */}
                <div className="now-playing-header">
                  <div className="sleeve-artwork-wrapper">
                    <img
                      src={activeTrack.coverUrl}
                      alt={activeTrack.title}
                      className="sleeve-cover-img"
                    />
                    <div className="sleeve-spine-label">SIDE A · STEREO</div>
                  </div>

                  <div className="track-identity">
                    <span className="track-genre-chip" style={{ '--chip-accent': activeTrack.accentColor }}>
                      {activeTrack.vibe}
                    </span>
                    <h2 className="now-playing-title">{activeTrack.title}</h2>
                    <p className="now-playing-artist">{activeTrack.artist}</p>
                    <p className="now-playing-album">{activeTrack.album} · {activeTrack.year}</p>
                  </div>
                </div>

                {/* Designer Liner Note (Authentic Human Context) */}
                <div className="designer-liner-note">
                  <div className="liner-note-header">
                    <Sparkles size={13} className="liner-icon" />
                    <span>DESIGNER LINER NOTE</span>
                  </div>
                  <p className="liner-note-quote">“{activeTrack.note}”</p>
                </div>

                {/* Analog VU Level Meters */}
                <div className="analog-vu-strip">
                  <div className="vu-meter-channel">
                    <span className="vu-label">L</span>
                    <div className="vu-led-track">
                      {[...Array(12)].map((_, i) => (
                        <span
                          key={i}
                          className={`vu-segment ${isPlaying && i < 8 + (i % 3) ? 'active' : ''} ${
                            i >= 9 ? 'overload' : ''
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="vu-meter-channel">
                    <span className="vu-label">R</span>
                    <div className="vu-led-track">
                      {[...Array(12)].map((_, i) => (
                        <span
                          key={i}
                          className={`vu-segment ${isPlaying && i < 7 + ((i + 1) % 4) ? 'active' : ''} ${
                            i >= 9 ? 'overload' : ''
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Timeline Scrubber */}
                <div className="playback-scrubber-area">
                  <div
                    className="scrubber-bar-track"
                    ref={progressBarRef}
                    onClick={handleSeek}
                  >
                    <div
                      className="scrubber-progress-fill"
                      style={{
                        width: `${duration ? (currentTime / duration) * 100 : 0}%`,
                      }}
                    />
                  </div>
                  <div className="scrubber-timestamps">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(duration)}</span>
                  </div>
                </div>

                {/* Mechanical Hardware Controls */}
                <div className="hardware-controls-row">
                  <div className="transport-buttons">
                    <button
                      className="ctrl-btn secondary"
                      onClick={goPrev}
                      title="Previous Track (Left Arrow)"
                    >
                      <SkipBack size={18} />
                    </button>

                    <button
                      className={`ctrl-btn play-main ${isPlaying ? 'playing' : ''}`}
                      onClick={togglePlay}
                      title="Play / Pause (Spacebar)"
                    >
                      {isPlaying ? <Pause size={22} /> : <Play size={22} className="play-icon-offset" />}
                    </button>

                    <button
                      className="ctrl-btn secondary"
                      onClick={goNext}
                      title="Next Track (Right Arrow)"
                    >
                      <SkipForward size={18} />
                    </button>
                  </div>

                  <div className="deck-aux-controls">
                    {/* Volume Mute */}
                    <button
                      className="ctrl-btn aux-btn"
                      onClick={toggleMute}
                      title={isMuted ? 'Unmute' : 'Mute'}
                    >
                      {isMuted ? <VolumeX size={17} /> : <Volume2 size={17} />}
                    </button>

                    {/* External Spotify Link */}
                    <a
                      href={activeTrack.spotifyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ctrl-btn aux-btn spotify-link"
                      title="Listen on Spotify"
                    >
                      <ExternalLink size={16} />
                      <span className="spotify-label">Spotify</span>
                    </a>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>

        {/* ═══════ The Record Crate (Flippable Vinyl Rack) ═══════ */}
        <section className="record-crate-section">
          <div className="crate-header">
            <div className="crate-title-row">
              <Disc size={18} className="crate-icon" />
              <h3 className="crate-title">Flip the Vinyl Crate</h3>
            </div>
            <span className="crate-count">6 RECORDS IN ROTATION</span>
          </div>

          <div className="crate-grid">
            {musicTracks.map((track, idx) => {
              const isCurrent = idx === activeIndex;

              return (
                <motion.div
                  key={track.id}
                  className={`crate-record-card ${isCurrent ? 'is-on-deck' : ''}`}
                  onClick={() => goToTrack(idx)}
                  whileHover={{ y: -8, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                >
                  <div className="crate-cover-wrap">
                    <img
                      src={track.coverUrl}
                      alt={track.title}
                      className="crate-cover-img"
                    />
                    {isCurrent && (
                      <div className="on-deck-badge">
                        <span className="deck-dot" />
                        <span>ON DECK</span>
                      </div>
                    )}
                    <div className="crate-record-sheen" />
                  </div>

                  <div className="crate-info">
                    <div className="crate-track-num">SIDE 0{idx + 1}</div>
                    <h4 className="crate-track-title">{track.title}</h4>
                    <p className="crate-track-artist">{track.artist}</p>
                    <span className="crate-track-vibe">{track.vibe}</span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>

      </div>
    </div>
  );
}
