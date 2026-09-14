import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import './ContactModal.css';
import confetti from 'canvas-confetti';
import { portfolioData } from '../data/portfolioData';

export default function ContactModal({ isOpen, onClose }) {
  const [copied, setCopied] = useState(false);
  const [messageSubmitted, setMessageSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const email = portfolioData.personalInfo.contactEmail;

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessageSubmitted(true);
    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.6 }
    });
    setTimeout(() => {
      setMessageSubmitted(false);
      setFormData({ name: '', email: '', message: '' });
      onClose();
    }, 2200);
  };

  return createPortal(
    <div className="contact-backdrop" onClick={onClose}>
      <div className="contact-modal-simple" onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button className="contact-simple-close" onClick={onClose} aria-label="Close modal">
          ✕
        </button>

        {/* Header */}
        <div className="contact-simple-header">
          <span className="contact-simple-badge">GET IN TOUCH</span>
          <h2 className="contact-simple-title">Let's work together.</h2>
          <p className="contact-simple-desc">
            Have a project in mind or just want to say hi? Drop an email directly or leave a note below.
          </p>

          {/* Quick email row */}
          <div className="contact-simple-email-row">
            <a href={`mailto:${email}`} className="contact-simple-email-link">
              {email}
            </a>
            <button 
              type="button" 
              className={`contact-simple-copy-btn${copied ? ' copied' : ''}`}
              onClick={handleCopyEmail}
            >
              {copied ? 'Copied! ✓' : 'Copy'}
            </button>
          </div>
        </div>

        {/* Message Form or Success State */}
        {messageSubmitted ? (
          <div className="contact-simple-success">
            <span className="success-emoji">✨</span>
            <h3>Message sent!</h3>
            <p>Thanks for reaching out. I'll get back to you soon.</p>
          </div>
        ) : (
          <form className="contact-simple-form" onSubmit={handleSubmit}>
            <div className="contact-form-grid">
              <input
                type="text"
                required
                placeholder="Your name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
              <input
                type="email"
                required
                placeholder="Your email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <textarea
              required
              rows="4"
              placeholder="Tell me about your project or inquiry..."
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            ></textarea>

            <button type="submit" className="contact-simple-submit">
              <span>Send message</span>
              <span className="submit-arrow">↗</span>
            </button>
          </form>
        )}

        {/* Social Links Footer */}
        <div className="contact-simple-footer">
          <span className="footer-label">Elsewhere</span>
          <div className="footer-links">
            <a href={portfolioData.personalInfo.socialLinks.linkedin} target="_blank" rel="noreferrer">
              LinkedIn ↗
            </a>
            <a href={portfolioData.personalInfo.socialLinks.behance} target="_blank" rel="noreferrer">
              Behance ↗
            </a>
            <a href={portfolioData.personalInfo.socialLinks.resume} target="_blank" rel="noreferrer">
              Resume ↗
            </a>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
