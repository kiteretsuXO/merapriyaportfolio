import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import './ProjectModal.css';

export default function ProjectModal({ project, onClose }) {
  useEffect(() => {
    if (!project) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [project, onClose]);

  if (!project) return null;

  const tagColorPalette = [
    { bg: '#d8f3b9', color: '#1a4f4d' }, // lime
    { bg: '#bde1e6', color: '#1a4f4d' }, // soft cyan
    { bg: '#fac4d8', color: '#1a4f4d' }, // blush pink
    { bg: '#fcedd0', color: '#1a4f4d' }, // warm peach
  ];

  // Use the project artwork in the card; floatingImage is the decorative hover label.
  const heroImage = project.normalImage || project.hoverImage || project.floatingImage;

  return createPortal(
    <div className="case-study-backdrop" onClick={onClose}>
      <div className="case-study-modal" onClick={(e) => e.stopPropagation()}>
        {/* Floating Close Pill Button */}
        <button className="case-study-close-btn" onClick={onClose} aria-label="Close modal">
          ✕
        </button>

        {/* Showcase Hero Image */}
        <div className="case-study-hero-container">
          <div className="case-study-hero-inner">
            <img 
              src={heroImage} 
              alt={project.title} 
              className="case-study-hero-img" 
            />
            {/* Playful Sticker Badge */}
            <div className="case-study-sticker-badge">
              <span className="sticker-star">✦</span>
              <span>{project.tapeLabel || 'CASE STUDY'}</span>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="case-study-content">
          {/* Header Row: Project Number & Tags */}
          <div className="case-study-meta-row">
            <div className="case-study-num-pill">
              <span>PROJECT {project.number || '01'}</span>
            </div>
            <div className="case-study-tags">
              {(project.tags || []).map((tag, idx) => {
                const scheme = tagColorPalette[idx % tagColorPalette.length];
                return (
                  <span 
                    key={idx} 
                    className="case-study-tag-item"
                    style={{ backgroundColor: scheme.bg, color: scheme.color }}
                  >
                    {tag}
                  </span>
                );
              })}
            </div>
          </div>

          {/* Title & Subtitle */}
          <div className="case-study-title-block">
            <h2 className="case-study-title">{project.title}</h2>
            <p className="case-study-subtitle">{project.subtitle}</p>
          </div>

          {/* Editorial Specs Bar */}
          <div className="case-study-specs-bar">
            <div className="spec-item">
              <span className="spec-label">ROLE</span>
              <span className="spec-value">UI/UX & Product</span>
            </div>
            <div className="spec-item">
              <span className="spec-label">TIMELINE</span>
              <span className="spec-value">2025 – 2026</span>
            </div>
            <div className="spec-item">
              <span className="spec-label">CATEGORY</span>
              <span className="spec-value">{project.tags?.[0] || 'Design System'}</span>
            </div>
            <div className="spec-item">
              <span className="spec-label">DELIVERABLES</span>
              <span className="spec-value">Prototype & Case Study</span>
            </div>
          </div>

          {/* Dashed Editorial Divider */}
          <div className="case-study-divider"></div>

          {/* Overview & Story */}
          <div className="case-study-description">
            <div className="description-header">
              <span className="description-sparkle">✦</span>
              <h3>Overview & Problem Statement</h3>
            </div>
            <p>{project.description}</p>
          </div>

          {/* Actions Bar */}
          <div className="case-study-actions-bar">
            {project.link ? (
              <a 
                href={project.link} 
                target="_blank" 
                rel="noreferrer" 
                className="case-study-behance-btn"
              >
                <span>View Full Case Study on Behance</span>
                <span className="btn-arrow">↗</span>
              </a>
            ) : <div />}

          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
