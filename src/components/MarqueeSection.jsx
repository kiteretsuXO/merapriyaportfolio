import React, { useRef, useState, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import './MarqueeSection.css';

const topBarItems = [
  "User Research",
  "Wireframing",
  "Information Architecture",
  "Interaction Design"
];

const bottomBarItems = [
  "Problem Solving",
  "Communication",
  "Adaptability",
  "Attention to Detail"
];

// Combine items with stars to create initial chips for physics explosion
const INITIAL_CHIPS = [
  ...topBarItems.flatMap((text, i) => [
    { id: `top-word-${i}`, text, type: 'word', row: 0 },
    { id: `top-star-${i}`, text: '✦', type: 'star', row: 0 }
  ]),
  ...bottomBarItems.flatMap((text, i) => [
    { id: `bot-word-${i}`, text, type: 'word', row: 1 },
    { id: `bot-star-${i}`, text: '✦', type: 'star', row: 1 }
  ])
];

const ARENA_HEIGHT = 175;

export default function MarqueeSection() {
  const topSegment = [...topBarItems, ...topBarItems];
  const topTrack = [...topSegment, ...topSegment, ...topSegment];

  const bottomSegment = [...bottomBarItems, ...bottomBarItems];
  const bottomTrack = [...bottomSegment, ...bottomSegment, ...bottomSegment];

  const wrapperRef = useRef(null);

  // States: 'normal' | 'pulling' | 'exploded' | 'restoring'
  const [mode, setMode] = useState('normal');
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0, dist: 0 });
  const [hovered, setHovered] = useState(false);

  // Slingshot drag tracking
  const isPointerDown = useRef(false);
  const startPos = useRef({ x: 0, y: 0 });
  const currentOffset = useRef({ x: 0, y: 0 });
  const lastPos = useRef({ x: 0, y: 0 });
  const lastTime = useRef(0);
  const pointerVelocity = useRef({ vx: 0, vy: 0 });

  // Normal spring recoil loop (when not exploded)
  const springPull = useRef({ x: 0, y: 0, vx: 0, vy: 0 });
  const [normalSpring, setNormalSpring] = useState({ x: 0, y: 0, skew: 0 });

  // Airborne physics chips
  const chipsRef = useRef([]);
  const [chipsState, setChipsState] = useState([]);
  const activeChipDrag = useRef(null);

  const physicsRaf = useRef(null);
  const normalRaf = useRef(null);

  // Normal elastic pull & snap-back spring loop
  useEffect(() => {
    const normalLoop = () => {
      if (mode === 'normal' || mode === 'pulling') {
        if (!isPointerDown.current) {
          // Spring recoil back to (0, 0)
          const k = 0.088;
          const damp = 0.8;
          springPull.current.vx += -k * springPull.current.x;
          springPull.current.vx *= damp;
          springPull.current.x += springPull.current.vx;

          springPull.current.vy += -k * springPull.current.y;
          springPull.current.vy *= damp;
          springPull.current.y += springPull.current.vy;

          if (
            Math.abs(springPull.current.x) < 0.05 &&
            Math.abs(springPull.current.vx) < 0.05 &&
            Math.abs(springPull.current.y) < 0.05 &&
            Math.abs(springPull.current.vy) < 0.05
          ) {
            springPull.current.x = 0;
            springPull.current.vx = 0;
            springPull.current.y = 0;
            springPull.current.vy = 0;
          }
        }

        const skew = Math.max(-8, Math.min(8, springPull.current.vx * -0.2));
        setNormalSpring({
          x: springPull.current.x,
          y: springPull.current.y,
          skew
        });
      }
      normalRaf.current = requestAnimationFrame(normalLoop);
    };

    normalRaf.current = requestAnimationFrame(normalLoop);
    return () => cancelAnimationFrame(normalRaf.current);
  }, [mode]);

  // Detonate / Explode chips into the air
  const explode = useCallback((releaseVx, releaseVy, dragX, dragY) => {
    if (!wrapperRef.current) return;
    const rect = wrapperRef.current.getBoundingClientRect();
    const arenaW = rect.width;
    const arenaH = ARENA_HEIGHT;

    // Slingshot recoil impulse: opposite direction + upward fling
    const recoilForceX = -dragX * 0.12 + (releaseVx * 5);
    const recoilForceY = -dragY * 0.12 + (releaseVy * 5) - 5;

    const initialChips = INITIAL_CHIPS.map((item, idx) => {
      const totalChips = INITIAL_CHIPS.length;
      // Spread across the middle of the arena
      const slotX = (arenaW / (totalChips + 1)) * (idx + 1) + (Math.random() - 0.5) * 30;
      const slotY = item.row === 0 ? 60 : 110;

      // Radial scatter + slingshot impulse
      const spreadAngle = (idx / totalChips) * Math.PI * 2;
      const scatterSpeed = 2.5 + Math.random() * 4;
      const vx = recoilForceX * 0.5 + Math.cos(spreadAngle) * scatterSpeed;
      const vy = recoilForceY * 0.6 - Math.abs(Math.sin(spreadAngle)) * (scatterSpeed * 1.2) - (Math.random() * 3);

      return {
        id: item.id,
        text: item.text,
        type: item.type,
        row: item.row,
        x: Math.max(70, Math.min(arenaW - 100, slotX)),
        y: Math.max(50, Math.min(arenaH - 55, slotY)),
        vx,
        vy,
        rot: (Math.random() - 0.5) * 20,
        vrot: (Math.random() - 0.5) * 6,
        targetX: slotX,
        targetY: item.row === 0 ? 50 : 100,
        isGrabbed: false
      };
    });

    chipsRef.current = initialChips;
    setChipsState(initialChips);
    setMode('exploded');

    // Celebratory confetti puff
    try {
      confetti({
        particleCount: 30,
        spread: 80,
        origin: { y: 0.36 },
        colors: ['#ff8d6d', '#2ec4b6', '#ffd166', '#ffffff']
      });
    } catch {
      // ignore
    }
  }, []);

  // Physics animation loop for airborne exploded words
  useEffect(() => {
    if (mode !== 'exploded' && mode !== 'restoring') return;

    let lastFrame = performance.now();

    const physicsStep = (now) => {
      const dt = Math.min(2.0, (now - lastFrame) / 16.666);
      lastFrame = now;

      if (!wrapperRef.current) {
        physicsRaf.current = requestAnimationFrame(physicsStep);
        return;
      }

      const rect = wrapperRef.current.getBoundingClientRect();
      const arenaW = rect.width;
      const arenaH = ARENA_HEIGHT;
      const gravity = 0.12; // gentle floaty gravity
      const airFriction = 0.99;
      const bounceDamp = 0.65;

      let allRestored = true;

      const updated = chipsRef.current.map((chip, idx) => {
        if (mode === 'restoring') {
          // Smooth homing suction back to original slot
          const dx = chip.targetX - chip.x;
          const dy = chip.targetY - chip.y;
          const dist = Math.hypot(dx, dy);

          const springK = 0.13;
          const damp = 0.78;
          let nvx = (chip.vx + dx * springK) * damp;
          let nvy = (chip.vy + dy * springK) * damp;
          let nx = chip.x + nvx;
          let ny = chip.y + nvy;
          let nrot = chip.rot * 0.85;

          if (dist > 3 || Math.abs(chip.rot) > 1) {
            allRestored = false;
          }

          return {
            ...chip,
            x: nx,
            y: ny,
            vx: nvx,
            vy: nvy,
            rot: nrot,
            vrot: 0
          };
        }

        // Active grabbed chip by user pointer
        if (activeChipDrag.current && activeChipDrag.current.id === chip.id) {
          return chip;
        }

        // Floating physics with soft levitation cushion near bottom
        let vx = chip.vx * airFriction;
        let vy = chip.vy * airFriction + (gravity * dt);

        // Gentle levitation lift so chips float and don't sink out of view
        const bottomZone = arenaH - 55;
        if (chip.y > bottomZone) {
          const cushionFactor = (chip.y - bottomZone) / 55;
          vy -= (gravity * 1.8 * cushionFactor) * dt;
        }

        let x = chip.x + vx * dt;
        let y = chip.y + vy * dt;
        let rot = chip.rot + chip.vrot * dt;
        let vrot = chip.vrot * 0.985;

        // Accurate bounding box calculation accounting for rotation to eliminate clipping!
        const w = chip.type === 'star' ? 28 : 140;
        const h = 28;
        const rad = Math.abs((rot * Math.PI) / 180);
        const effectiveHalfH = Math.abs(Math.cos(rad)) * (h / 2) + Math.abs(Math.sin(rad)) * (w / 2);
        const effectiveHalfW = Math.abs(Math.cos(rad)) * (w / 2) + Math.abs(Math.sin(rad)) * (h / 2);

        // Bottom bounce
        const maxBottom = arenaH - effectiveHalfH - 10;
        if (y >= maxBottom) {
          y = maxBottom;
          vy = -Math.abs(vy) * bounceDamp;
          vx *= 0.92;
          vrot *= 0.75;
          rot *= 0.9; // rotate back towards horizontal
        }

        // Top ceiling bounce (beneath top HUD banner at ~44px)
        const minTop = 46 + effectiveHalfH;
        if (y <= minTop) {
          y = minTop;
          vy = Math.abs(vy) * bounceDamp;
        }

        // Right bounce
        const maxRight = arenaW - effectiveHalfW - 14;
        if (x >= maxRight) {
          x = maxRight;
          vx = -Math.abs(vx) * bounceDamp;
        }

        // Left bounce
        const minLeft = effectiveHalfW + 14;
        if (x <= minLeft) {
          x = minLeft;
          vx = Math.abs(vx) * bounceDamp;
        }

        return {
          ...chip,
          x,
          y,
          vx,
          vy,
          rot,
          vrot
        };
      });

      chipsRef.current = updated;
      setChipsState(updated);

      if (mode === 'restoring' && allRestored) {
        setMode('normal');
        springPull.current = { x: 0, y: 0, vx: 0, vy: 0 };
        try {
          confetti({
            particleCount: 22,
            spread: 60,
            origin: { y: 0.35 },
            colors: ['#2ec4b6', '#ffffff', '#ff8d6d']
          });
        } catch {
          // ignore
        }
        return;
      }

      physicsRaf.current = requestAnimationFrame(physicsStep);
    };

    physicsRaf.current = requestAnimationFrame(physicsStep);
    return () => cancelAnimationFrame(physicsRaf.current);
  }, [mode]);

  // Main pointer down handler (for slingshot stretch)
  const onMainPointerDown = (e) => {
    if (mode === 'exploded' || mode === 'restoring') return;
    if (e.target.closest('.airborne-chip') || e.target.closest('.restore-marquee-btn')) return;

    isPointerDown.current = true;
    startPos.current = { x: e.clientX, y: e.clientY };
    lastPos.current = { x: e.clientX, y: e.clientY };
    lastTime.current = performance.now();
    currentOffset.current = { x: 0, y: 0 };
    pointerVelocity.current = { vx: 0, vy: 0 };

    setMode('pulling');
    setDragOffset({ x: 0, y: 0, dist: 0 });

    try {
      wrapperRef.current?.setPointerCapture?.(e.pointerId);
    } catch {
      // ignore
    }
  };

  // Main pointer move (stretching the slingshot in 2D)
  const onMainPointerMove = (e) => {
    if (!isPointerDown.current) {
      if (mode === 'normal') {
        const sweep = e.movementX || 0;
        if (Math.abs(sweep) > 0.4) {
          springPull.current.vx += sweep * 0.08;
        }
      }
      return;
    }

    const now = performance.now();
    const dt = Math.max(1, now - lastTime.current);
    const dx = e.clientX - startPos.current.x;
    const dy = e.clientY - startPos.current.y;
    const dist = Math.hypot(dx, dy);

    // Elastic damping resistance curve
    const elasticFactor = 1 / (1 + dist * 0.0035);
    const pullX = dx * elasticFactor;
    const pullY = dy * elasticFactor;

    currentOffset.current = { x: pullX, y: pullY };
    springPull.current.x = pullX;
    springPull.current.y = pullY;

    pointerVelocity.current = {
      vx: (e.clientX - lastPos.current.x) / dt,
      vy: (e.clientY - lastPos.current.y) / dt
    };

    lastPos.current = { x: e.clientX, y: e.clientY };
    lastTime.current = now;

    setDragOffset({ x: pullX, y: pullY, dist });
  };

  // Main pointer up (release slingshot: check for snap/detonate)
  const onMainPointerUp = (e) => {
    if (!isPointerDown.current) return;
    isPointerDown.current = false;

    try {
      wrapperRef.current?.releasePointerCapture?.(e.pointerId);
    } catch {
      // ignore
    }

    const dist = dragOffset.dist;
    const speed = Math.hypot(pointerVelocity.current.vx, pointerVelocity.current.vy);

    // Detonate if pulled far enough (> 90px) OR flung fast (> 0.75px/ms)
    if (dist >= 90 || speed > 0.75) {
      explode(
        pointerVelocity.current.vx,
        pointerVelocity.current.vy,
        currentOffset.current.x,
        currentOffset.current.y
      );
    } else {
      // Snap back to normal with stored release momentum
      springPull.current.vx = pointerVelocity.current.vx * 8;
      springPull.current.vy = pointerVelocity.current.vy * 8;
      setMode('normal');
      setDragOffset({ x: 0, y: 0, dist: 0 });
    }
  };

  // Interactive handling for dragging individual airborne words when exploded
  const onChipPointerDown = (chip, e) => {
    e.stopPropagation();
    try {
      e.target.setPointerCapture?.(e.pointerId);
    } catch {
      // ignore
    }

    activeChipDrag.current = {
      id: chip.id,
      startX: e.clientX,
      startY: e.clientY,
      origX: chip.x,
      origY: chip.y,
      lastX: e.clientX,
      lastY: e.clientY,
      vx: 0,
      vy: 0,
      lastTime: performance.now(),
      pointerId: e.pointerId
    };

    chipsRef.current = chipsRef.current.map((c) =>
      c.id === chip.id ? { ...c, isGrabbed: true, vx: 0, vy: 0 } : c
    );
    setChipsState(chipsRef.current);
  };

  const onChipPointerMove = (e) => {
    if (!activeChipDrag.current) return;
    e.stopPropagation();

    const now = performance.now();
    const dt = Math.max(1, now - activeChipDrag.current.lastTime);
    const deltaX = e.clientX - activeChipDrag.current.startX;
    const deltaY = e.clientY - activeChipDrag.current.startY;

    const newX = activeChipDrag.current.origX + deltaX;
    const newY = activeChipDrag.current.origY + deltaY;

    activeChipDrag.current.vx = (e.clientX - activeChipDrag.current.lastX) / dt;
    activeChipDrag.current.vy = (e.clientY - activeChipDrag.current.lastY) / dt;
    activeChipDrag.current.lastX = e.clientX;
    activeChipDrag.current.lastY = e.clientY;
    activeChipDrag.current.lastTime = now;

    chipsRef.current = chipsRef.current.map((c) =>
      c.id === activeChipDrag.current.id
        ? { ...c, x: newX, y: newY, isGrabbed: true }
        : c
    );
    setChipsState(chipsRef.current);
  };

  const onChipPointerUp = (e) => {
    if (!activeChipDrag.current) return;
    e.stopPropagation();

    const drag = activeChipDrag.current;
    try {
      e.target.releasePointerCapture?.(drag.pointerId);
    } catch {
      // ignore
    }

    // Toss with release velocity
    const flingVx = Math.max(-20, Math.min(20, drag.vx * 16));
    const flingVy = Math.max(-20, Math.min(20, drag.vy * 16));
    const flingVrot = (drag.vx * 6) + (Math.random() - 0.5) * 8;

    chipsRef.current = chipsRef.current.map((c) =>
      c.id === drag.id
        ? {
            ...c,
            isGrabbed: false,
            vx: flingVx,
            vy: flingVy,
            vrot: flingVrot
          }
        : c
    );
    setChipsState(chipsRef.current);
    activeChipDrag.current = null;
  };

  // Trigger restore / reassembly sequence
  const onRestore = (e) => {
    e.stopPropagation();
    setMode('restoring');
  };

  // Determine tension label
  let pillText = '✦ DRAG ANYWHERE TO SLINGSHOT ✦';
  let pillClass = '';
  if (mode === 'pulling') {
    if (dragOffset.dist < 45) {
      pillText = `🏹 STRETCHING (${Math.round(dragOffset.dist)}px)`;
      pillClass = 'tension-low';
    } else if (dragOffset.dist < 90) {
      pillText = `⚡ PULL HARDER TO SNAP! (${Math.round(dragOffset.dist)}px)`;
      pillClass = 'tension-med';
    } else {
      pillText = `💥 RELEASE TO LAUNCH WORDS! 💥`;
      pillClass = 'tension-high';
    }
  }

  const isPulling = mode === 'pulling';
  const isExploded = mode === 'exploded' || mode === 'restoring';

  return (
    <div
      ref={wrapperRef}
      className={`besharm-marquee-wrapper${isPulling ? ' is-pulling' : ''}${hovered ? ' is-hovered' : ''}${isExploded ? ' is-exploded' : ''}${mode === 'restoring' ? ' is-restoring' : ''}`}
      onPointerDown={onMainPointerDown}
      onPointerMove={onMainPointerMove}
      onPointerUp={onMainPointerUp}
      onPointerCancel={onMainPointerUp}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={(e) => {
        setHovered(false);
        onMainPointerUp(e);
      }}
    >
      {/* Visual SVG Slingshot Tension Chord when dragging */}
      {isPulling && (
        <svg className="slingshot-cord-svg" aria-hidden="true">
          <line
            x1="50%"
            y1="50%"
            x2={`calc(50% + ${dragOffset.x}px)`}
            y2={`calc(50% + ${dragOffset.y}px)`}
            stroke="#ff8d6d"
            strokeWidth={Math.max(2, 6 - dragOffset.dist * 0.03)}
            strokeDasharray={dragOffset.dist > 85 ? "6,4" : "none"}
            strokeLinecap="round"
            opacity={0.85}
          />
          <circle
            cx={`calc(50% + ${dragOffset.x}px)`}
            cy={`calc(50% + ${dragOffset.y}px)`}
            r={Math.min(10, 5 + dragOffset.dist * 0.04)}
            fill="#ffaa91"
            stroke="#ffffff"
            strokeWidth="2"
          />
        </svg>
      )}

      {/* Floating Status & Instruction Badge (Normal & Pulling) */}
      {!isExploded && (
        <div className={`marquee-pull-pill ${pillClass}`}>
          <span className="pill-dot">✦</span>
          <span className="pill-label">{pillText}</span>
          <span className="pill-dot">✦</span>
        </div>
      )}

      {/* Reset & Control Panel (Shown when words are airborne / exploded) */}
      {isExploded && (
        <div className="marquee-chaos-hud">
          <div className="chaos-actions">
            <span className="chaos-hint">
              {mode === 'restoring' ? '⚡ Reassembling...' : 'Grab & fling any word!'}
            </span>
            <button
              type="button"
              className="restore-marquee-btn"
              onClick={onRestore}
              disabled={mode === 'restoring'}
            >
              <span className="restore-btn-icon">↺</span>
              <span className="restore-btn-text">RESTORE MARQUEE</span>
            </button>
          </div>
        </div>
      )}

      {/* Normal Scrolling Rows (shown when not exploded) */}
      {!isExploded && (
        <>
          {/* Row 1 — top bar */}
          <div className="marquee-row marquee-row-forward">
            <div
              className="marquee-pull-layer"
              style={{
                transform: `translate3d(${normalSpring.x}px, ${normalSpring.y * 0.65}px, 0) skewX(${normalSpring.skew}deg)`
              }}
            >
              <div className="marquee-track">
                {topTrack.map((text, index) => (
                  <div key={index} className="marquee-item">
                    <span className="marquee-text">{text}</span>
                    <span className="marquee-star">✦</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Row 2 — bottom bar */}
          <div className="marquee-row marquee-row-reverse">
            <div
              className="marquee-pull-layer"
              style={{
                transform: `translate3d(${normalSpring.x * 0.88}px, ${normalSpring.y * 0.88}px, 0) skewX(${normalSpring.skew}deg)`
              }}
            >
              <div className="marquee-track marquee-track-reverse">
                {bottomTrack.map((text, index) => (
                  <div key={index} className="marquee-item">
                    <span className="marquee-text">{text}</span>
                    <span className="marquee-star">✦</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {/* Airborne Physics Words Playground (rendered when exploded or restoring) */}
      {isExploded && (
        <div className="airborne-physics-arena">
          {chipsState.map((chip) => (
            <div
              key={chip.id}
              className={`airborne-chip ${chip.type === 'star' ? 'chip-star' : 'chip-word'}${chip.isGrabbed ? ' is-grabbed' : ''}`}
              style={{
                transform: `translate3d(${chip.x}px, ${chip.y}px, 0) rotate(${chip.rot}deg)`
              }}
              onPointerDown={(e) => onChipPointerDown(chip, e)}
              onPointerMove={onChipPointerMove}
              onPointerUp={onChipPointerUp}
              onPointerCancel={onChipPointerUp}
            >
              {chip.type === 'word' ? (
                <div className="word-tag-inner">
                  <span className="word-tag-bullet">✦</span>
                  <span className="word-tag-label">{chip.text}</span>
                </div>
              ) : (
                <span className="star-tag-symbol">✦</span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
