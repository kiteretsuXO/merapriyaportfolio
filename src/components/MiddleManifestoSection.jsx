import React, { useEffect, useRef, useState } from 'react';
import './MiddleManifestoSection.css';

// Splits the statement into word spans, each animated individually
function AnimatedStatement({ text, inView }) {
  // Parse the text to handle the <italic> word "problem"
  // Format: "I start with the [problem], not the pixels."
  const parts = text.split(/(problem)/i);

  let wordIndex = 0;
  const nodes = parts.map((part, pi) => {
    if (part.toLowerCase() === 'problem') {
      const delay = wordIndex++ * 0.055;
      return (
        <span
          key={pi}
          className={`word-span italic-problem${inView ? ' word-in' : ''}`}
          style={{ '--word-delay': `${delay}s` }}
        >
          {part}
        </span>
      );
    }
    // Split regular text into words
    return part.split(/(\s+)/).map((chunk, ci) => {
      if (/^\s+$/.test(chunk)) return <span key={`${pi}-${ci}`}>&nbsp;</span>;
      if (!chunk) return null;
      const delay = wordIndex++ * 0.055;
      return (
        <span
          key={`${pi}-${ci}`}
          className={`word-span${inView ? ' word-in' : ''}`}
          style={{ '--word-delay': `${delay}s` }}
        >
          {chunk}
        </span>
      );
    });
  });

  return <>{nodes}</>;
}

export default function MiddleManifestoSection() {
  const sectionRef = useRef(null);
  const [inView, setInView] = useState(false);
  const [imgInView, setImgInView] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          setImgInView(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.unobserve(el);
  }, []);

  return (
    <section className="middle-manifesto-section" ref={sectionRef}>
      <div className="manifesto-inner-container">
        {/* Left Photo with Doodles */}
        <div className={`manifesto-photo-wrapper${imgInView ? ' img-revealed' : ''}`}>
          {/* Top-Left Doodle Sketch */}
          <svg className="doodle-icon top-left-doodle" viewBox="0 0 100 100">
            <path d="M30,20 C40,20 40,35 30,35 C20,35 20,20 30,20 Z M30,35 C40,35 40,50 30,50 C20,50 20,35 30,35 Z M30,50 C40,50 40,65 30,65 C20,65 20,50 30,50 Z M50,20 C60,20 60,35 50,35 C40,35 40,20 50,20 Z M50,35 C60,35 60,50 50,50 C40,50 40,35 50,35 Z" fill="none" stroke="#000000" strokeWidth="4" strokeLinecap="round" />
          </svg>

          {/* Photo Frame */}
          <div className="manifesto-img-box">
            <img
              src="https://framerusercontent.com/images/0UTFceEqsxUyprwmiLNZf5HL0M.png?width=908&height=1070"
              alt="Kalash Bawankar Portrait"
              className="manifesto-portrait-img"
            />
          </div>

          {/* Bottom-Right Doodle Sketch */}
          <svg className="doodle-icon bottom-right-doodle" viewBox="0 0 100 100">
            <path d="M25,75 L35,45 L70,10 L85,25 L50,60 Z M70,10 L85,25 M25,75 L15,85 L35,80 Z" fill="none" stroke="#000000" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        {/* Right Statement Text */}
        <div className="manifesto-text-wrapper">
          <h2 className="manifesto-statement">
            <AnimatedStatement
              text="I start with the problem, not the pixels."
              inView={inView}
            />
          </h2>
        </div>
      </div>
    </section>
  );
}
