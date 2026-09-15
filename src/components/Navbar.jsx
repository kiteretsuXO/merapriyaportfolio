import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './Navbar.css';
import { portfolioData } from '../data/portfolioData';
const brandLogo = '/flav dark.png';

export default function Navbar({ onOpenContact }) {
  const [scrolled, setScrolled] = useState(false);
  const { personalInfo } = portfolioData;
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleWorkClick = (e) => {
    e.preventDefault();
    if (location.pathname === '/') {
      const el = document.getElementById('work');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/');
      setTimeout(() => {
        const el = document.getElementById('work');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  const handleLogoClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className={`faisal-header${scrolled ? ' scrolled' : ''}`}>
      <div className="faisal-header-inner">
        {/* Logo */}
        <Link
          to="/"
          onClick={handleLogoClick}
          className="faisal-logo"
        >
          <span className="logo-mark">
            <img src={brandLogo} alt="52do" className="brand-logo-image" />
          </span>
          <span className="logo-type">
            <strong>{personalInfo.name}</strong>
            <small>{personalInfo.role}</small>
          </span>
        </Link>

        {/* Nav Links */}
        <nav className="faisal-nav" aria-label="Primary navigation">
          <span className="nav-index">Index / 05</span>
          <a href="#work" onClick={handleWorkClick} className="nav-link">
            Work
          </a>
          <Link 
            to="/about" 
            className={`nav-link${location.pathname === '/about' ? ' active' : ''}`}
          >
            About
          </Link>
          <Link 
            to="/fun" 
            className={`nav-link${location.pathname === '/fun' || location.pathname === '/music' ? ' active' : ''}`}
          >
            Fun
          </Link>
          <button className="nav-cta-btn" onClick={onOpenContact}>
            Get in touch ↗
          </button>
        </nav>
      </div>
    </header>
  );
}
