import React, { useState, useRef, useEffect } from 'react';
import './ProjectsSection.css';
import { portfolioData } from '../data/portfolioData';
import useInView from '../hooks/useInView';

export default function ProjectsSection({ onSelectProject }) {
  const { projects } = portfolioData;
  const [hoveredId, setHoveredId] = useState(null);
  const [previewPos, setPreviewPos] = useState({ x: 0, y: 0 });
  const [previewTilt, setPreviewTilt] = useState(0);
  const [previewVisible, setPreviewVisible] = useState(false);

  const sectionRef = useRef(null);
  const rafRef = useRef(null);
  const target = useRef({ x: 0, y: 0 });
  const current = useRef({ x: 0, y: 0 });
  const tiltRef = useRef(0);

  const [headerRef, headerInView] = useInView({ threshold: 0.2 });

  // Smooth lerp loop with dynamic momentum tilt for immersive cursor-following
  useEffect(() => {
    const lerp = (a, b, t) => a + (b - a) * t;
    const tick = () => {
      current.current.x = lerp(current.current.x, target.current.x, 0.13);
      current.current.y = lerp(current.current.y, target.current.y, 0.13);

      // Natural momentum tilt based on horizontal velocity
      const vx = target.current.x - current.current.x;
      const targetTilt = Math.max(-9, Math.min(9, vx * 0.14));
      tiltRef.current = lerp(tiltRef.current, targetTilt, 0.1);

      setPreviewPos({ x: current.current.x, y: current.current.y });
      setPreviewTilt(tiltRef.current);

      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  const handleMouseMove = (e) => {
    const rect = sectionRef.current?.getBoundingClientRect();
    if (!rect) return;
    target.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const handleRowEnter = (projectId, e) => {
    setHoveredId(projectId);
    setPreviewVisible(true);
    const rect = sectionRef.current?.getBoundingClientRect();
    if (rect) {
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      target.current = { x, y };
      current.current = { x, y };
      tiltRef.current = 0;
      setPreviewPos({ x, y });
      setPreviewTilt(0);
    }
  };

  const handleRowLeave = () => {
    setHoveredId(null);
    setPreviewVisible(false);
  };

  const hoveredProject = projects.find((p) => p.id === hoveredId);

  return (
    <section
      id="work"
      className="faisal-projects-section"
      ref={sectionRef}
      onMouseMove={handleMouseMove}
    >
      <div className="projects-section-inner">

        {/* Section Header */}
        <div
          ref={headerRef}
          className={`projects-header${headerInView ? ' revealed' : ''}`}
        >
          <span className="projects-label">Selected Work</span>
          <span className="projects-count">({String(projects.length).padStart(2, '0')})</span>
        </div>

        {/* Projects List */}
        <div className="projects-list">
          {projects.map((project, idx) => (
            <ProjectRow
              key={project.id}
              project={project}
              idx={idx}
              onSelect={() => onSelectProject(project)}
              onMouseEnter={(e) => handleRowEnter(project.id, e)}
              onMouseLeave={handleRowLeave}
            />
          ))}

          {/* Bottom Divider */}
          <div className="row-divider" />
        </div>
      </div>

      {/* Floating preview — renders the handwritten project name PNG with dynamic jiggle & momentum */}
      {hoveredProject && (
        <div
          className={`floating-preview${previewVisible ? ' visible' : ''}`}
          style={{
            left: `${previewPos.x}px`,
            top: `${previewPos.y}px`,
            '--tilt': `${previewTilt.toFixed(2)}deg`,
          }}
        >
          <div className="floating-preview-card">
            <img
              src={hoveredProject.hoverImage || hoveredProject.normalImage}
              alt={`${hoveredProject.title} handwritten preview`}
              className="floating-preview-img"
            />
          </div>
        </div>
      )}
    </section>
  );
}

function ProjectRow({ project, idx, onSelect, onMouseEnter, onMouseLeave }) {
  const [rowRef, inView] = useInView({ threshold: 0.1 });

  return (
    <div
      ref={rowRef}
      className={`project-row${inView ? ' revealed' : ''}`}
      style={{ '--row-delay': `${idx * 0.08}s` }}
      onClick={onSelect}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {/* Top Divider */}
      <div className="row-divider" />

      <div className="row-content">
        {/* Left: Number + Title Info */}
        <div className="row-left">
          <span className="row-number">{project.number || String(idx + 1).padStart(2, '0')}</span>
          <div className="row-title-group">
            <h3 className="row-title">{project.title}</h3>
            <p className="row-subtitle">{project.subtitle}</p>
          </div>
        </div>

        {/* Center: Tags */}
        <div className="row-tags">
          {(project.tags || []).map((tag) => (
            <span key={tag} className="row-tag">{tag}</span>
          ))}
        </div>

        {/* Right: Image Thumbnail + CTA */}
        <div className="row-right">
          <div className="row-thumb">
            <img
              src={project.normalImage}
              alt={project.title}
              className="row-thumb-img"
            />
          </div>
          <span className="row-cta">View ↗</span>
        </div>
      </div>
    </div>
  );
}
