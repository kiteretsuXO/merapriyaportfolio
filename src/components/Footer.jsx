import React from 'react';
import './Footer.css';
import { portfolioData } from '../data/portfolioData';

export default function Footer({ onOpenContact }) {
  const { personalInfo } = portfolioData;

  return (
    <footer className="framer-footer">
      <div className="footer-container">
        <div className="footer-cta-container">
          <h2 className="t-heading">Have a problem worth solving?</h2>
          <h2 className="t-heading">Let's make something useful.</h2>
        </div>

        <div className="footer-contact-actions">
          <button className="footer-contact-link" onClick={onOpenContact}>
            CONTACT ↗
          </button>
          <a href={`mailto:${personalInfo.contactEmail}`} className="footer-email-text">
            {personalInfo.contactEmail}
          </a>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} {personalInfo.name}. All rights reserved.</span>
        <span>Designed for desktop</span>
      </div>
    </footer>
  );
}
