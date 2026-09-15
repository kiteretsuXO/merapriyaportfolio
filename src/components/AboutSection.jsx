import React, { useState } from 'react';
import './AboutSection.css';
import { portfolioData } from '../data/portfolioData';
import useInView from '../hooks/useInView';
import { 
  FigmaLogo, 
  FramerLogo, 
  AdobeLogo, 
  ChatGPTLogo, 
  ClaudeLogo, 
  GeminiLogo 
} from './TechLogos';

import { 
  ArrowUpRight, 
  Sparkles, 
  Phone, 
  Mail, 
  MapPin, 
  Copy,
  Check
} from 'lucide-react';

export default function AboutSection({ onOpenContact }) {
  const { personalInfo, aboutDetails } = portfolioData;
  
  const [headerRef, headerInView] = useInView({ threshold: 0.1 });
  const [heroGridRef, heroGridInView] = useInView({ threshold: 0.1 });

  const [copiedEmail, setCopiedEmail] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(personalInfo.contactEmail);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  return (
    <section id="about" className="framer-about-section">
      <div className="about-container">

        {/* Section Header */}
        <div ref={headerRef} className={`about-header-wrapper ${headerInView ? 'revealed' : ''}`}>
          <div className="about-badge-tag">
            <span className="badge-dot"></span>
            <span>{aboutDetails?.badge || '02 / PROFILE & ARCHIVE'}</span>
          </div>
          <h2 className="about-headline t-heading">
            {aboutDetails?.headline || 'Transforming ambiguous problems into pixel-accurate, human interfaces.'}
          </h2>
        </div>

        {/* Hero Bio Grid */}
        <div ref={heroGridRef} className={`about-bio-grid ${heroGridInView ? 'revealed' : ''}`}>
          
          {/* Left Portrait & Details Card */}
          <div className="about-portrait-card">
            <div className="portrait-image-wrapper shadow-soft">
              <img 
                src={personalInfo.aboutPortrait || personalInfo.mugshot || '/IMG.jpg'} 
                alt={personalInfo.name} 
                className="about-portrait-img"
              />
              
              {/* removed location and education badges per request */}
            </div>

            {/* Quick Contact Chips */}
            <div className="portrait-contact-chips">
              <a href={`mailto:${personalInfo.contactEmail}`} className="chip-link">
                <Mail size={14} />
                <span>{personalInfo.contactEmail}</span>
              </a>
              <a href={`tel:${personalInfo.phone}`} className="chip-link">
                <Phone size={14} />
                <span>{personalInfo.phone}</span>
              </a>
            </div>
          </div>

          {/* Right Narrative & Metrics */}
          <div className="about-bio-content">
            {/* sub-badge removed per request */}

            <h3 className="bio-greeting">
              Communication Designer specializing in <span className="highlight-text">UI/UX & Interactive Systems</span>.
            </h3>

            <div className="bio-paragraphs">
              {(aboutDetails?.bioParagraphs || [personalInfo.description]).map((para, i) => (
                <p key={i} className="t-body bio-p">
                  {para}
                </p>
              ))}
            </div>

            {/* Core Stack Badge Strip with Official Software Vector Logos */}
            <div className="software-logo-strip">
              <span className="strip-title">Core Stack:</span>
              <div className="strip-badges">
                <span className="software-badge"><FigmaLogo size={18} /> Figma</span>
                <span className="software-badge"><FramerLogo size={18} /> Framer</span>
                <span className="software-badge"><AdobeLogo size={18} /> Adobe CC</span>
                <span className="software-badge"><ChatGPTLogo size={18} /> ChatGPT</span>
                <span className="software-badge"><ClaudeLogo size={18} /> Claude</span>
                <span className="software-badge"><GeminiLogo size={18} /> Gemini</span>
              </div>
            </div>

            {/* Metrics Counter Bar */}
            <div className="about-stats-row">
              {(aboutDetails?.stats || []).map((stat, idx) => (
                <div key={idx} className="stat-box">
                  <span className="stat-value">{stat.value}</span>
                  <span className="stat-label">{stat.label}</span>
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="about-bio-actions">
              <button className="about-btn-primary" onClick={onOpenContact}>
                <span>Get in Touch</span>
                <ArrowUpRight size={18} />
              </button>
              
              <button className="about-btn-secondary" onClick={handleCopyEmail}>
                {copiedEmail ? <Check size={16} color="#10b981" /> : <Copy size={16} />}
                <span>{copiedEmail ? 'Email Copied!' : 'Copy Email'}</span>
              </button>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
