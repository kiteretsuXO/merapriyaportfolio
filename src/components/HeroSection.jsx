import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MousePointer2, Sparkles, Grid, ArrowDown, Plus } from 'lucide-react';
import './HeroSection.css';
import { portfolioData } from '../data/portfolioData';

const ROTATING_ROLES = [
  'Product Interfaces',
  'Design Systems',
  'Complex Flows',
  'Spatial Narratives',
];

const STICKER_PRESETS = [
  { text: 'APPROVED ✦', bg: '#10b981', color: '#ffffff', rotate: -8 },
  { text: 'WIP ⚡', bg: '#f59e0b', color: '#ffffff', rotate: 12 },
  { text: 'FIGMA NERD ✦', bg: '#8b5cf6', color: '#ffffff', rotate: -15 },
  { text: '100% INTENTIONAL ✨', bg: '#ff4a21', color: '#ffffff', rotate: 6 },
  { text: 'COFFEE FIRST ☕', bg: '#3c4b54', color: '#d8f3b9', rotate: -10 },
  { text: 'PIXEL ACCURATE 🎯', bg: '#215b59', color: '#e4f1f5', rotate: 14 },
];

export default function HeroSection() {
  const { personalInfo } = portfolioData;
  const nameParts = personalInfo.name.split(' ');
  const firstName = nameParts[0] || 'Kalash';
  const lastName = nameParts.slice(1).join(' ') || 'Bawankar';

  const heroRef = useRef(null);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [scrollY, setScrollY] = useState(0);
  const [mounted, setMounted] = useState(false);

  // Live IST Clock
  const [currentTime, setCurrentTime] = useState('');

  // Rotating Role Index
  const [roleIndex, setRoleIndex] = useState(0);

  // Figma Dot Grid Toggle
  const [isGridActive, setIsGridActive] = useState(false);

  // Dynamic User-Dropped Stickers
  const [spawnedStickers, setSpawnedStickers] = useState([]);

  // Active Tool Mode in Toolbar
  const [activeTool, setActiveTool] = useState('select'); // 'select' | 'sticker' | 'grid'

  // Clock Ticker (Nagpur / Asia/Kolkata)
  useEffect(() => {
    const updateTime = () => {
      try {
        const timeStr = new Intl.DateTimeFormat('en-IN', {
          timeZone: 'Asia/Kolkata',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true,
        }).format(new Date());
        setCurrentTime(timeStr);
      } catch (e) {
        setCurrentTime('04:00 PM IST');
      }
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Role Flipper Interval
  useEffect(() => {
    const interval = setInterval(() => {
      setRoleIndex((prev) => (prev + 1) % ROTATING_ROLES.length);
    }, 3200);
    return () => clearInterval(interval);
  }, []);

  // Entrance animation trigger
  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 80);
    return () => clearTimeout(timer);
  }, []);

  // Mouse parallax
  useEffect(() => {
    const handleMove = (e) => {
      const rect = heroRef.current?.getBoundingClientRect();
      if (!rect) return;
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      setMouse({
        x: (e.clientX - rect.left - cx) / cx,
        y: (e.clientY - rect.top - cy) / cy,
      });
    };
    const el = heroRef.current;
    el?.addEventListener('mousemove', handleMove);
    return () => el?.removeEventListener('mousemove', handleMove);
  }, []);

  // Scroll parallax
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Drop a new sticker onto canvas
  const handleDropSticker = () => {
    const preset = STICKER_PRESETS[Math.floor(Math.random() * STICKER_PRESETS.length)];
    const randomOffset = (Math.random() - 0.5) * 200;
    const newSticker = {
      id: Date.now() + Math.random(),
      text: preset.text,
      bg: preset.bg,
      color: preset.color,
      rotate: preset.rotate + (Math.random() - 0.5) * 10,
      initialX: randomOffset,
      initialY: (Math.random() - 0.5) * 80,
    };
    setSpawnedStickers((prev) => [...prev, newSticker]);
  };

  // Scroll to work
  const handleScrollToWork = () => {
    const el = document.getElementById('work');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section 
      id="top" 
      className={`prasha-hero ${isGridActive ? 'has-canvas-grid' : ''}`} 
      ref={heroRef}
    >
      {/* Canvas Grid Background Overlay */}
      {isGridActive && <div className="canvas-grid-overlay" aria-hidden="true" />}

      <div className="prasha-hero-inner">
        {/* ─── Top Status Beacon & Live Clock Pill ─── */}
        <motion.div
          className="hero-status-pill"
          initial={{ opacity: 0, y: -16, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="status-ping-wrap">
            <span className="status-ping-radar" />
            <span className="status-ping-dot" />
            <span className="status-title">OPEN FOR ROLES</span>
          </div>
          <span className="status-separator">/</span>
          <div className="status-location-wrap">
            <span className="status-loc">NAGPUR, IN</span>
            <span className="status-time">{currentTime || '04:00 PM IST'}</span>
          </div>
        </motion.div>

        {/* Interactive Draggable Background Stickers */}
        <motion.div
          drag
          dragConstraints={heroRef}
          dragElastic={0.12}
          dragMomentum={true}
          whileHover={{ scale: 1.08, rotate: -6 }}
          whileTap={{ scale: 1.15, cursor: 'grabbing' }}
          whileDrag={{ scale: 1.15, zIndex: 100 }}
          initial={{ rotate: -10 }}
          className="shape shape-pencil"
          title="Drag me!"
        >
          <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M40 180 Q 20 100 80 80 T 140 80 T 180 20" stroke="#bde1e6" strokeWidth="25" strokeLinecap="round" fill="none" />
            <rect x="155" y="0" width="35" height="25" rx="10" transform="rotate(40 165 5)" fill="#fac4d8" />
            <polygon points="25,180 55,180 40,200" fill="#ff8d6d" />
            <polygon points="35,193 45,193 40,200" fill="#3c4b54" />
          </svg>
        </motion.div>

        <motion.div
          drag
          dragConstraints={heroRef}
          dragElastic={0.12}
          dragMomentum={true}
          whileHover={{ scale: 1.1, rotate: 12 }}
          whileTap={{ scale: 1.18, cursor: 'grabbing' }}
          whileDrag={{ scale: 1.18, zIndex: 100 }}
          className="shape shape-cross"
          title="Drag me!"
        >
          <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="50" r="50" fill="#ff8d6d" />
            <path d="M35 40H65V60H35V40Z" fill="white" />
            <path d="M40 35V65H60V35H40Z" fill="white" />
          </svg>
        </motion.div>

        <motion.div
          drag
          dragConstraints={heroRef}
          dragElastic={0.12}
          dragMomentum={true}
          whileHover={{ scale: 1.08, rotate: 22 }}
          whileTap={{ scale: 1.16, cursor: 'grabbing' }}
          whileDrag={{ scale: 1.16, zIndex: 100 }}
          initial={{ rotate: 15 }}
          className="shape shape-star"
          title="Drag me!"
        >
          <svg viewBox="0 0 150 150" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M75 10L90 45H130L100 70L110 105L75 85L40 105L50 70L20 45H60L75 10Z" fill="#ff8d6d" stroke="#ff8d6d" strokeWidth="20" strokeLinejoin="round" />
            <path d="M75 25L85 50H115L90 70L100 95L75 80L50 95L60 70L35 50H65L75 25Z" fill="#fac4d8" stroke="#fac4d8" strokeWidth="15" strokeLinejoin="round" />
            <path d="M75 40L80 55H100L85 70L90 85L75 75L60 85L65 70L50 55H70L75 40Z" fill="#bde1e6" stroke="#bde1e6" strokeWidth="10" strokeLinejoin="round" />
            <path d="M75 55L78 62H85L80 68L82 75L75 71L68 75L70 68L65 62H72L75 55Z" fill="white" stroke="white" strokeWidth="5" strokeLinejoin="round" />
          </svg>
        </motion.div>

        {/* User-Dropped Dynamic Stickers */}
        {spawnedStickers.map((sticker) => (
          <motion.div
            key={sticker.id}
            drag
            dragConstraints={heroRef}
            dragElastic={0.15}
            dragMomentum={true}
            initial={{ scale: 0, x: sticker.initialX, y: sticker.initialY, rotate: sticker.rotate - 10 }}
            animate={{ scale: 1, rotate: sticker.rotate }}
            whileHover={{ scale: 1.14, zIndex: 120 }}
            whileTap={{ scale: 1.25, cursor: 'grabbing' }}
            whileDrag={{ scale: 1.25, zIndex: 150 }}
            transition={{ type: 'spring', stiffness: 280, damping: 18 }}
            className="spawned-sticker"
            style={{ backgroundColor: sticker.bg, color: sticker.color }}
            title="Drag me!"
          >
            <span>{sticker.text}</span>
          </motion.div>
        ))}

        {/* Text Blocks — subtle mouse movement */}
        <div
          className="prasha-title-container"
          style={{ transform: `translate(${mouse.x * 6}px, ${mouse.y * 6}px)` }}
        >
          <div className={`prasha-block block-first${mounted ? ' revealed' : ''}`}>
            <h1 className="t-display">{firstName}</h1>
          </div>
          <div className={`prasha-block block-last${mounted ? ' revealed' : ''}`}>
            <h1 className="t-display">{lastName}</h1>
          </div>
        </div>

        {/* Description & Dynamic Focus Flipper */}
        <div className={`prasha-desc${mounted ? ' revealed' : ''}`}>
          <p className="t-body">
            I start with the <span className="italic-problem">problem</span>, not the pixels.
          </p>

          <div className="hero-role-flipper-row">
            <span className="flipper-prefix">Designing</span>
            <div className="flipper-pill-viewport">
              <AnimatePresence mode="wait">
                <motion.span
                  key={roleIndex}
                  className="flipper-active-role"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                >
                  {ROTATING_ROLES[roleIndex]}
                </motion.span>
              </AnimatePresence>
            </div>
            <span className="flipper-suffix">with friction-free intent.</span>
          </div>
        </div>

        {/* ─── Floating Figma Canvas Toolbar ─── */}
        <motion.div
          className="figma-hero-toolbar"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, type: 'spring', stiffness: 220, damping: 20 }}
        >
          {/* Tool: Select */}
          <button
            className={`toolbar-btn ${activeTool === 'select' ? 'is-active' : ''}`}
            onClick={() => setActiveTool('select')}
            title="Selection Tool [V]"
          >
            <MousePointer2 size={15} />
            <span className="tool-label">Select</span>
          </button>

          {/* Tool: Drop Sticker */}
          <button
            className="toolbar-btn primary-action"
            onClick={handleDropSticker}
            title="Drop an interactive sticker onto the canvas!"
          >
            <Plus size={15} />
            <span className="tool-label">Drop Sticker</span>
          </button>

          {/* Tool: Toggle Canvas Grid */}
          <button
            className={`toolbar-btn ${isGridActive ? 'is-active' : ''}`}
            onClick={() => setIsGridActive(!isGridActive)}
            title="Toggle Figma Dot Grid [#]"
          >
            <Grid size={15} />
            <span className="tool-label">Grid</span>
          </button>

          <div className="toolbar-divider" />

          {/* Tool: Explore Work Scroll */}
          <button
            className="toolbar-btn scroll-action"
            onClick={handleScrollToWork}
            title="Scroll to Selected Work"
          >
            <span className="tool-label">Work</span>
            <ArrowDown size={14} />
          </button>
        </motion.div>
      </div>

      {/* Bottom part (Blue section) */}
      <div
        className="prasha-hero-bottom"
        style={{ transform: `translateY(${scrollY * 0.04}px)` }}
      >
        <div className="prasha-photo-container shadow-soft">
          <img src={personalInfo.aboutPortrait || personalInfo.mugshot} alt={personalInfo.name} />

          <div className="metadata-card">
            <span className="t-meta">UI/UX DESIGNER</span>
            <span className="t-meta">BASED IN NGP, IN</span>
            <span className="t-meta">04 CASE STUDIES</span>
            <span className="t-meta">DESIGN SYSTEMS</span>
          </div>
        </div>
        <div className="prasha-bottom-text">
          <motion.div
            drag
            dragConstraints={heroRef}
            dragElastic={0.12}
            dragMomentum={true}
            whileHover={{ scale: 1.12, rotate: -6 }}
            whileTap={{ scale: 1.2, cursor: 'grabbing' }}
            whileDrag={{ scale: 1.2, zIndex: 100 }}
            className="shape shape-glasses"
            title="Drag me onto the photo!"
          >
            <svg viewBox="0 0 100 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15 20C15 10 25 5 35 5C45 5 55 10 55 20C55 30 45 35 35 35C25 35 15 30 15 20Z" fill="#1a4f4d" stroke="#ff8d6d" strokeWidth="4" />
              <path d="M55 20C55 10 65 5 75 5C85 5 95 10 95 20C95 30 85 35 75 35C65 35 55 30 55 20Z" fill="#1a4f4d" stroke="#ff8d6d" strokeWidth="4" />
              <path d="M45 20H65" stroke="#ff8d6d" strokeWidth="4" />
              <path d="M15 20L0 12" stroke="#ff8d6d" strokeWidth="4" />
              <path d="M95 20L110 12" stroke="#ff8d6d" strokeWidth="4" />
            </svg>
          </motion.div>
          <h2 className="t-heading">I think deeply about problems, then design clear digital experiences.</h2>
        </div>
      </div>
    </section>
  );
}
