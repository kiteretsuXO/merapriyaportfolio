import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  Phone, 
  Mail, 
  Copy,
  Check,
  Zap,
  Trophy,
  Monitor,
  GraduationCap
} from 'lucide-react';

/* ─── Animated counter for stats ─── */
function AnimatedStat({ value, label, delay = 0 }) {
  return (
    <motion.div
      className="stat-box"
      initial={{ opacity: 0, y: 24, scale: 0.9 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ delay, type: 'spring', stiffness: 200, damping: 18 }}
      whileHover={{ y: -6, scale: 1.04 }}
    >
      <span className="stat-value">{value}</span>
      <span className="stat-label">{label}</span>
    </motion.div>
  );
}

/* ─── Tool badge with bounce-in ─── */
function ToolBadge({ icon, name, delay = 0 }) {
  return (
    <motion.span
      className="software-badge"
      initial={{ opacity: 0, scale: 0.6, y: 12 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true, margin: '-20px' }}
      transition={{ delay, type: 'spring', stiffness: 260, damping: 16 }}
      whileHover={{ y: -4, scale: 1.06, boxShadow: '0 8px 20px rgba(0,0,0,0.08)' }}
      whileTap={{ scale: 0.95 }}
    >
      {icon}
      {name}
    </motion.span>
  );
}

/* ─── Spotlight story card ─── */
function StoryCard({ story, index }) {
  const icons = {
    hackathon: <Zap size={22} />,
    ibgroup: <Monitor size={22} />,
    spatial: <Trophy size={22} />,
    cossart: <GraduationCap size={22} />,
  };

  return (
    <motion.div
      className="spotlight-card"
      initial={{ opacity: 0, y: 30, rotateZ: index % 2 === 0 ? -1 : 1 }}
      whileInView={{ opacity: 1, y: 0, rotateZ: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ delay: index * 0.1, type: 'spring', stiffness: 160, damping: 18 }}
      whileHover={{ y: -8, boxShadow: '0 20px 50px rgba(0,0,0,0.08)' }}
    >
      <div className="spotlight-card-top">
        <span className="spotlight-tag" style={{ '--tag-color': story.badgeColor }}>
          {story.tag}
        </span>
        <span className="spotlight-period">{story.period}</span>
      </div>
      <div className="spotlight-title-row">
        <div className="story-icon-wrapper" style={{ '--icon-color': story.badgeColor }}>
          {icons[story.id] || <Zap size={22} />}
        </div>
        <div>
          <h4 className="spotlight-title">{story.title}</h4>
        </div>
      </div>
      <p className="spotlight-summary">{story.summary}</p>
      <div className="spotlight-footer">
        <span className="spotlight-metric-pill">{story.metric}</span>
      </div>
    </motion.div>
  );
}

/* ─── Draggable portrait sticker ─── */
function DraggableSticker({ children, className, rotate = 0, constraintsRef }) {
  return (
    <motion.div
      drag
      dragConstraints={constraintsRef}
      dragElastic={0.15}
      dragMomentum={true}
      whileHover={{ scale: 1.12 }}
      whileTap={{ scale: 1.2 }}
      whileDrag={{ scale: 1.2, zIndex: 200 }}
      initial={{ opacity: 0, scale: 0, rotate: rotate - 15 }}
      whileInView={{ opacity: 1, scale: 1, rotate }}
      viewport={{ once: true }}
      transition={{ type: 'spring', stiffness: 180, damping: 14 }}
      className={`about-sticker ${className || ''}`}
      title="Drag me!"
    >
      {children}
    </motion.div>
  );
}

export default function AboutSection({ onOpenContact }) {
  const { personalInfo, aboutDetails } = portfolioData;
  const sectionRef = useRef(null);
  
  const [headerRef, headerInView] = useInView({ threshold: 0.1 });
  const [heroGridRef, heroGridInView] = useInView({ threshold: 0.1 });
  const [storiesRef, storiesInView] = useInView({ threshold: 0.05 });

  const [copiedEmail, setCopiedEmail] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(personalInfo.contactEmail);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const tools = [
    { icon: <FigmaLogo size={18} />, name: 'Figma' },
    { icon: <FramerLogo size={18} />, name: 'Framer' },
    { icon: <AdobeLogo size={18} />, name: 'Adobe CC' },
    { icon: <ChatGPTLogo size={18} />, name: 'ChatGPT' },
    { icon: <ClaudeLogo size={18} />, name: 'Claude' },
    { icon: <GeminiLogo size={18} />, name: 'Gemini' },
  ];

  return (
    <section id="about" className="framer-about-section" ref={sectionRef}>
      <div className="about-container">

        {/* ═══════ Section Header ═══════ */}
        <motion.div
          ref={headerRef}
          className="about-header-wrapper"
          initial={{ opacity: 0, y: 40 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <h2 className="about-headline t-heading">
            {aboutDetails?.headline || 'Transforming ambiguous problems into pixel-accurate, human interfaces.'}
          </h2>
        </motion.div>

        {/* ═══════ Hero Bio Grid ═══════ */}
        <motion.div
          ref={heroGridRef}
          className="about-bio-grid"
          initial={{ opacity: 0, y: 40 }}
          animate={heroGridInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
        >
          
          {/* ── Left Portrait Card ── */}
          <div className="about-portrait-card">
            <motion.div
              className="portrait-image-wrapper shadow-soft"
              whileHover={{ scale: 1.01 }}
              transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            >
              <img 
                src={personalInfo.aboutPortrait || personalInfo.mugshot || '/IMG.jpg'} 
                alt={personalInfo.name} 
                className="about-portrait-img"
              />
              
              {/* Draggable stickers around the portrait */}
              <DraggableSticker className="sticker-pos-tl" rotate={-12} constraintsRef={sectionRef}>
                <svg width="56" height="56" viewBox="0 0 100 100" fill="none">
                  <path d="M50 5L55 40L90 25L60 50L95 60L58 58L75 95L50 62L25 95L42 58L5 60L40 50L10 25L45 40Z"
                    fill="#d8f3b9" stroke="#1a4f4d" strokeWidth="2" strokeLinejoin="round" />
                </svg>
              </DraggableSticker>
              
              <DraggableSticker className="sticker-pos-br" rotate={8} constraintsRef={sectionRef}>
                <svg width="48" height="48" viewBox="0 0 100 100" fill="none">
                  <circle cx="50" cy="50" r="42" fill="#fac4d8" stroke="#ff8d6d" strokeWidth="3" />
                  <circle cx="35" cy="40" r="5" fill="#1a4f4d" />
                  <circle cx="65" cy="40" r="5" fill="#1a4f4d" />
                  <path d="M30 60C35 72 65 72 70 60" stroke="#1a4f4d" strokeWidth="3.5" strokeLinecap="round" fill="none" />
                </svg>
              </DraggableSticker>
            </motion.div>

            {/* Quick Contact Chips */}
            <div className="portrait-contact-chips">
              <motion.a
                href={`mailto:${personalInfo.contactEmail}`}
                className="chip-link"
                whileHover={{ x: 6, borderColor: 'rgba(0,0,0,0.2)' }}
              >
                <Mail size={14} />
                <span>{personalInfo.contactEmail}</span>
              </motion.a>
              <motion.a
                href={`tel:${personalInfo.phone}`}
                className="chip-link"
                whileHover={{ x: 6, borderColor: 'rgba(0,0,0,0.2)' }}
              >
                <Phone size={14} />
                <span>{personalInfo.phone}</span>
              </motion.a>
            </div>
          </div>

          {/* ── Right Bio Content ── */}
          <div className="about-bio-content">
            <motion.h3
              className="bio-greeting"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15 }}
            >
              Communication Designer specializing in <span className="highlight-text">UI/UX & Interactive Systems</span>.
            </motion.h3>

            <div className="bio-paragraphs">
              {(aboutDetails?.bioParagraphs || [personalInfo.description]).map((para, i) => (
                <motion.p
                  key={i}
                  className="t-body bio-p"
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + i * 0.1 }}
                >
                  {para}
                </motion.p>
              ))}
            </div>

            {/* Core Stack — animated badges */}
            <motion.div
              className="software-logo-strip"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <span className="strip-title">Core Stack:</span>
              <div className="strip-badges">
                {tools.map((tool, i) => (
                  <ToolBadge key={tool.name} icon={tool.icon} name={tool.name} delay={0.35 + i * 0.06} />
                ))}
              </div>
            </motion.div>

            {/* Stats Row — animated counters */}
            <div className="about-stats-row">
              {(aboutDetails?.stats || []).map((stat, idx) => (
                <AnimatedStat key={idx} value={stat.value} label={stat.label} delay={idx * 0.08} />
              ))}
            </div>

            {/* Action Buttons */}
            <div className="about-bio-actions">
              <motion.button
                className="about-btn-primary"
                onClick={onOpenContact}
                whileHover={{ y: -3, backgroundColor: '#ff4a21' }}
                whileTap={{ scale: 0.96 }}
              >
                <span>Get in Touch</span>
                <ArrowUpRight size={18} />
              </motion.button>
              
              <motion.button
                className="about-btn-secondary"
                onClick={handleCopyEmail}
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.96 }}
              >
                {copiedEmail ? <Check size={16} color="#10b981" /> : <Copy size={16} />}
                <span>{copiedEmail ? 'Email Copied!' : 'Copy Email'}</span>
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* ═══════ Spotlight Stories ═══════ */}
        {aboutDetails?.spotlightStories?.length > 0 && (
          <div ref={storiesRef}>
            <motion.div
              className="stories-header"
              initial={{ opacity: 0, y: 24 }}
              animate={storiesInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
            >
              <div className="about-badge-tag">
                <span className="badge-dot" />
                <span>03 / HIGHLIGHTS</span>
              </div>
              <h2 className="about-headline t-heading stories-headline">
                Things I've shipped & stories worth telling.
              </h2>
            </motion.div>

            <div className="spotlight-grid">
              {aboutDetails.spotlightStories.map((story, index) => (
                <StoryCard key={story.id} story={story} index={index} />
              ))}
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
