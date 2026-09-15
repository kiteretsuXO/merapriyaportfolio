import React from 'react';
import './ProjectsSection.css';
import { portfolioData } from '../data/portfolioData';
import useInView from '../hooks/useInView';

export default function ProjectsSection() {
  const { projects } = portfolioData;
  const [headerRef, headerInView] = useInView({ threshold: 0.2 });

  return (
    <section id="work" className="projects-section">
      <div className="projects-inner">

        <div ref={headerRef} className={`projects-header${headerInView ? ' revealed' : ''}`}>
          <span className="projects-label">Selected Work</span>
          <span className="projects-count">({String(projects.length).padStart(2, '0')})</span>
        </div>

        <div className="projects-grid">
          {projects.map((project, idx) => (
            <ProjectCard key={project.id} project={project} idx={idx} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ProjectCard({ project, idx }) {
  const [cardRef, inView] = useInView({ threshold: 0.1 });
  const isEven = idx % 2 === 0;

  return (
    <div
      ref={cardRef}
      className={`project-card${inView ? ' revealed' : ''}${isEven ? ' card-even' : ' card-odd'}`}
      style={{ '--card-delay': `${idx * 0.1}s` }}
    >
      {/* Image */}
      <div className="card-image-wrap">
        <img src={project.normalImage} alt={project.title} className="card-image" />
      </div>

      {/* Content */}
      <div className="card-body">
        <div className="card-tags">
          {(project.tags || []).map((tag) => (
            <span key={tag} className="card-tag">{tag}</span>
          ))}
        </div>

        <div className="card-title-wrap">
          <h3 className="card-title">{project.title}</h3>
          <p className="card-subtitle">{project.subtitle}</p>
        </div>

        {project.description && (
          <p className="card-description">{project.description}</p>
        )}

        <a
          href={project.link}
          target="_blank"
          rel="noopener noreferrer"
          className="card-cta"
        >
          <span>View on Behance</span>
          <span className="card-cta-arrow">↗</span>
        </a>
      </div>
    </div>
  );
}
