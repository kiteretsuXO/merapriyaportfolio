import React from 'react';
import './AboutSection.css';
import { portfolioData } from '../data/portfolioData';

export default function AboutSection() {
  const { personalInfo } = portfolioData;

  return (
    <section id="about" className="framer-about-section">
      <div className="about-portrait-wrapper">
        <img 
          src={personalInfo.aboutPortrait} 
          alt={personalInfo.name} 
          className="about-portrait-img"
        />
      </div>
    </section>
  );
}
