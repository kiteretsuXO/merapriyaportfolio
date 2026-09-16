import React, { useEffect, useState, useRef } from 'react';
import './CustomCursor.css';

export default function CustomCursor() {
  const [hoverSpec, setHoverSpec] = useState(null); // { label: string, width: number, height: number }
  const [isClicking, setIsClicking] = useState(false);
  const [isInputMode, setIsInputMode] = useState(false);
  const [inspectBox, setInspectBox] = useState(null);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  const cursorRef = useRef(null);
  const coordsRef = useRef(null);

  useEffect(() => {
    // Disable on touch devices or screens without fine cursor
    if (window.matchMedia('(pointer: coarse)').matches) {
      setIsTouchDevice(true);
      return;
    }

    const cursorEl = cursorRef.current;
    const coordsEl = coordsRef.current;

    let hasShown = false;

    // Direct synchronous GPU transform for 0ms lag 1:1 hardware mouse tracking
    const handleMouseMove = (e) => {
      const clientX = e.clientX;
      const clientY = e.clientY;

      if (cursorEl) {
        cursorEl.style.transform = `translate3d(${clientX}px, ${clientY}px, 0)`;
        if (!hasShown) {
          cursorEl.style.opacity = '1';
          hasShown = true;
        }
      }

      // Direct DOM update for live coordinates (no React state re-render loop)
      if (coordsEl) {
        coordsEl.textContent = `X: ${Math.round(clientX)} Y: ${Math.round(clientY)}`;
      }
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    const handleMouseLeave = () => {
      if (cursorEl) cursorEl.style.opacity = '0';
      hasShown = false;
      setHoverSpec(null);
      setInspectBox(null);
    };

    const handleMouseEnter = () => {
      if (cursorEl) cursorEl.style.opacity = '1';
      hasShown = true;
    };

    const handleMouseOver = (e) => {
      const target = e.target;
      if (!target || !target.closest) return;

      // Text input mode
      if (target.closest('input, textarea, [contenteditable="true"]')) {
        setIsInputMode(true);
        setHoverSpec(null);
        setInspectBox(null);
        return;
      }
      setIsInputMode(false);

      // Check for prominent interactive elements to inspect
      const inspectEl = target.closest(
        '.project-card, .about-sticker, button, a, .software-badge, .spotlight-card, .stat-box, .nav-link, .hero-status-pill, .vinyl-stage'
      );

      if (inspectEl) {
        const rect = inspectEl.getBoundingClientRect();
        let label = inspectEl.tagName.toLowerCase();

        if (inspectEl.classList.contains('project-card')) label = 'CARD';
        else if (inspectEl.classList.contains('about-sticker')) label = 'STICKER';
        else if (inspectEl.classList.contains('software-badge')) label = 'TOOL';
        else if (inspectEl.classList.contains('spotlight-card')) label = 'STORY';
        else if (inspectEl.classList.contains('stat-box')) label = 'STAT';
        else if (inspectEl.classList.contains('nav-link')) label = 'NAV';
        else if (label === 'button') label = 'BTN';
        else if (label === 'a') label = 'LINK';

        setHoverSpec({
          label: label.toUpperCase(),
          width: Math.round(rect.width),
          height: Math.round(rect.height),
        });

        setInspectBox({
          top: rect.top,
          left: rect.left,
          width: rect.width,
          height: rect.height,
        });
      } else {
        setHoverSpec(null);
        setInspectBox(null);
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mouseover', handleMouseOver);

    document.body.classList.add('figma-cursor-enabled');

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseover', handleMouseOver);
      document.body.classList.remove('figma-cursor-enabled');
    };
  }, []);

  if (isTouchDevice) return null;

  return (
    <>
      {/* Figma Selection / Hover Bounding Outline on Element */}
      {inspectBox && !isInputMode && (
        <div
          className="figma-inspect-bounding-box"
          style={{
            top: `${inspectBox.top}px`,
            left: `${inspectBox.left}px`,
            width: `${inspectBox.width}px`,
            height: `${inspectBox.height}px`,
          }}
        >
          <span className="figma-dimension-badge top-left">
            {hoverSpec?.width} × {hoverSpec?.height}
          </span>
        </div>
      )}

      {/* Instant 1:1 Figma Pointer Cursor */}
      <div
        ref={cursorRef}
        className={`figma-cursor-container ${isClicking ? 'is-clicking' : ''} ${
          isInputMode ? 'is-input-mode' : ''
        }`}
        aria-hidden="true"
      >
        {/* Figma Designer Arrow Pointer (SVG) */}
        <div className="figma-arrow-wrapper">
          <svg
            className="figma-arrow-svg"
            width="22"
            height="22"
            viewBox="0 0 22 22"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0.5 0.5V18.5L5.5 13.5H13.5L0.5 0.5Z"
              fill="#FF4A21"
              stroke="#FFFFFF"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        {/* Multiplayer Designer Badge & HUD */}
        <div className="figma-tag-cluster">
          {/* Main User Tag Pill */}
          <div className="figma-name-tag">
            <span className="figma-tag-text">Kalash</span>
            <span className="figma-tag-tool">{isClicking ? 'EDIT' : 'FIGMA'}</span>
          </div>

          {/* Coordinate Readout HUD */}
          <div className="figma-coords-tag">
            <span ref={coordsRef} className="coord-val">
              X: 0 Y: 0
            </span>
          </div>

          {/* Element Inspection Tag (appears on hover) */}
          {hoverSpec && !isInputMode && (
            <div className="figma-spec-pill">
              <span className="spec-label">{hoverSpec.label}</span>
              <span className="spec-dims">
                {hoverSpec.width} × {hoverSpec.height}
              </span>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
