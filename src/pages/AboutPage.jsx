import React from 'react';
import { Link } from 'react-router-dom';
import AboutSection from '../components/AboutSection';
import { ArrowLeft, Sparkles } from 'lucide-react';
import './AboutPage.css';

export default function AboutPage({ onOpenContact }) {
  return (
    <div className="about-page-view">
      {/* Top Banner Header */}
      <div className="about-page-header">
        <div className="about-header-inner">
          <Link to="/" className="back-home-link">
            <ArrowLeft size={16} />
            <span>Back to Home</span>
          </Link>
          
          <div className="about-page-tagline">
            <Sparkles size={16} className="sparkle-icon" />
            <span>Full Profile & Narrative</span>
          </div>
        </div>
      </div>

      {/* Main About Component */}
      <main className="about-page-main">
        <AboutSection onOpenContact={onOpenContact} />
      </main>
    </div>
  );
}
