import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import './CustomCursor.css';

export default function CustomCursor() {
  const [cursorState, setCursorState] = useState('default'); // 'default' | 'pointer' | 'view' | 'drag' | 'copy' | 'input'
  const [cursorText, setCursorText] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  // Direct mouse coordinates for precise center dot
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Smooth spring physics for fluid trailing ring
  const springConfig = { damping: 28, stiffness: 380, mass: 0.45 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  useEffect(() => {
    // Disable on touch devices or screens without fine pointer
    if (window.matchMedia('(pointer: coarse)').matches) {
      setIsTouchDevice(true);
      return;
    }

    const handleMouseMove = (e) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    const handleMouseOver = (e) => {
      const target = e.target;
      if (!target || !target.closest) return;

      // 1. Text inputs & textareas: restore native cursor, hide ring
      if (target.closest('input, textarea, [contenteditable="true"]')) {
        setCursorState('input');
        setCursorText('');
        return;
      }

      // 2. Draggable elements (Stickers on About page, vinyl player on Fun page)
      const dragEl = target.closest('.about-sticker, .disc-carousel-container, .vinyl-stage, [data-cursor="drag"]');
      if (dragEl) {
        setCursorState('drag');
        setCursorText('DRAG ✦');
        return;
      }

      // 3. Project Cards (Work section)
      const projectEl = target.closest('.project-card, .featured-card, [data-cursor="view"]');
      if (projectEl) {
        setCursorState('view');
        setCursorText('VIEW ↗');
        return;
      }

      // 4. Copy actions (Email pill, copy buttons)
      const copyEl = target.closest('.email-copy-pill, .copy-btn, [data-cursor="copy"]');
      if (copyEl) {
        setCursorState('copy');
        setCursorText('COPY');
        return;
      }

      // 5. Interactive links, buttons, nav, chips, social icons
      const interactiveEl = target.closest(
        'a, button, [role="button"], .nav-link, .stat-box, .software-badge, .spotlight-card, .social-pill, .faisal-logo'
      );
      if (interactiveEl) {
        setCursorState('pointer');
        setCursorText('');
        return;
      }

      // Default state
      setCursorState('default');
      setCursorText('');
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mouseover', handleMouseOver);

    document.body.classList.add('custom-cursor-enabled');

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseover', handleMouseOver);
      document.body.classList.remove('custom-cursor-enabled');
    };
  }, [isVisible, mouseX, mouseY]);

  if (isTouchDevice) return null;

  return (
    <div className={`custom-cursor-root ${isVisible ? 'is-visible' : ''}`} aria-hidden="true">
      {/* Outer Fluid Trailing Ring / Lens */}
      <motion.div
        className={`cursor-ring state-${cursorState} ${isClicking ? 'is-clicking' : ''}`}
        style={{
          x: smoothX,
          y: smoothY,
          translateX: '-50%',
          translateY: '-50%',
        }}
      >
        {cursorText && <span className="cursor-label">{cursorText}</span>}
      </motion.div>

      {/* Center Precision Dot */}
      <motion.div
        className={`cursor-dot state-${cursorState} ${isClicking ? 'is-clicking' : ''}`}
        style={{
          x: mouseX,
          y: mouseY,
          translateX: '-50%',
          translateY: '-50%',
        }}
      />
    </div>
  );
}
