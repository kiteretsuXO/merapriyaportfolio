import React from 'react';
import HeroSection from '../components/HeroSection';
import MarqueeSection from '../components/MarqueeSection';
import ProjectsSection from '../components/ProjectsSection';

export default function HomePage({ onSelectProject }) {
  return (
    <div className="home-page-container">
      <HeroSection />
      <MarqueeSection />
      <main>
        <ProjectsSection onSelectProject={onSelectProject} />
      </main>
    </div>
  );
}
