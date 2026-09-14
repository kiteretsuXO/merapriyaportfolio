import React, { useState, useEffect } from 'react';
import './Navbar.css';
import { portfolioData } from '../data/portfolioData';
import brandLogo from '../../flav dark.png';

export default function Navbar({ onOpenContact }) {
  const [scrolled, setScrolled] = useState(false);
  const { personalInfo } = portfolioData;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <header className={`faisal-header${scrolled ? ' scrolled' : ''}`}>
      <div className="faisal-header-inner">
        {/* Logo */}
        <a
          href="#top"
          onClick={(e) => { e.preventDefault(); scrollToTop(); }}
          className="faisal-logo"
        >
          <span className="logo-mark">
            <img src={brandLogo} alt="52do" className="brand-logo-image" />
          </span>
          <span className="logo-type">
            <strong>{personalInfo.name}</strong>
            <small>{personalInfo.role}</small>
          </span>
        </a>

        {/* Nav Links */}
        <nav className="faisal-nav" aria-label="Primary navigation">
          <span className="nav-index">Index / 04</span>
          <a href="#work" className="nav-link">Work</a>
          <a href="#about" className="nav-link">About</a>
          <button className="nav-cta-btn" onClick={onOpenContact}>
            Get in touch ↗
          </button>
        </nav>
      </div>
    </header>
  );
}
