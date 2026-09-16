import React, { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import './ContactModal.css';
import confetti from 'canvas-confetti';
import { portfolioData } from '../data/portfolioData';

/* ─── Draggable Floating Doodle Stickers ─── */
const FloatingSticker = ({ children, className, delay = 0, x = 0, y = 0, rotate = 0, constraintsRef }) => (
  <motion.div
    drag
    dragConstraints={constraintsRef}
    dragElastic={0.15}
    dragMomentum={true}
    whileHover={{ scale: 1.15 }}
    whileTap={{ scale: 1.25 }}
    whileDrag={{ scale: 1.25, zIndex: 200 }}
    initial={{ opacity: 0, scale: 0, rotate: rotate - 20, x, y }}
    animate={{ opacity: 1, scale: 1, rotate, x, y }}
    transition={{ delay, type: 'spring', stiffness: 120, damping: 14 }}
    className={`contact-floating-sticker ${className || ''}`}
    title="Drag me!"
  >
    {children}
  </motion.div>
);

/* ─── SVG Doodle Definitions ─── */
const SpiralDoodle = () => (
  <svg width="52" height="52" viewBox="0 0 100 100" fill="none">
    <path d="M50 10C70 10 90 30 90 50C90 70 70 90 50 90C30 90 15 75 15 55C15 40 25 25 45 25C60 25 70 35 70 48C70 58 62 65 52 65C44 65 38 59 38 52"
      stroke="#ff8d6d" strokeWidth="4" strokeLinecap="round" fill="none" />
  </svg>
);

const StarBurstDoodle = () => (
  <svg width="48" height="48" viewBox="0 0 100 100" fill="none">
    <path d="M50 5L55 40L90 25L60 50L95 60L58 58L75 95L50 62L25 95L42 58L5 60L40 50L10 25L45 40Z"
      fill="#d8f3b9" stroke="#1a4f4d" strokeWidth="2" strokeLinejoin="round" />
  </svg>
);

const HeartDoodle = () => (
  <svg width="44" height="44" viewBox="0 0 100 100" fill="none">
    <path d="M50 85C50 85 15 60 15 35C15 20 25 10 38 10C45 10 50 15 50 15C50 15 55 10 62 10C75 10 85 20 85 35C85 60 50 85 50 85Z"
      fill="#fac4d8" stroke="#ff8d6d" strokeWidth="3" />
  </svg>
);

const ZigzagDoodle = () => (
  <svg width="60" height="32" viewBox="0 0 120 50" fill="none">
    <path d="M5 40L20 10L35 40L50 10L65 40L80 10L95 40L110 10"
      stroke="#bde1e6" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const SmileDoodle = () => (
  <svg width="46" height="46" viewBox="0 0 100 100" fill="none">
    <circle cx="50" cy="50" r="42" fill="#d8f3b9" stroke="#1a4f4d" strokeWidth="3" />
    <circle cx="35" cy="40" r="5" fill="#1a4f4d" />
    <circle cx="65" cy="40" r="5" fill="#1a4f4d" />
    <path d="M30 60C35 72 65 72 70 60" stroke="#1a4f4d" strokeWidth="3.5" strokeLinecap="round" fill="none" />
  </svg>
);

const ArrowCurlDoodle = () => (
  <svg width="50" height="50" viewBox="0 0 100 100" fill="none">
    <path d="M20 80C20 80 25 30 60 20C75 15 85 25 80 40C75 55 55 50 55 50"
      stroke="#1a4f4d" strokeWidth="3.5" strokeLinecap="round" fill="none" />
    <path d="M48 42L55 50L62 42" stroke="#1a4f4d" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/* ─── Entrance Animation Variants ─── */
const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3, ease: 'easeOut' } },
  exit: { opacity: 0, transition: { duration: 0.2, ease: 'easeIn' } },
};

const modalVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.95, rotateX: 4 },
  visible: {
    opacity: 1, y: 0, scale: 1, rotateX: 0,
    transition: { type: 'spring', stiffness: 260, damping: 24, delay: 0.05 },
  },
  exit: {
    opacity: 0, y: 30, scale: 0.96,
    transition: { duration: 0.2, ease: 'easeIn' },
  },
};

const staggerChildren = {
  visible: { transition: { staggerChildren: 0.07, delayChildren: 0.15 } },
};

const fadeSlideUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 200, damping: 20 } },
};

export default function ContactModal({ isOpen, onClose }) {
  const [copied, setCopied] = useState(false);
  const [messageSubmitted, setMessageSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [focusedField, setFocusedField] = useState(null);
  const modalRef = useRef(null);

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

  const email = portfolioData.personalInfo.contactEmail;

  const handleCopyEmail = useCallback(() => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    // Mini celebration burst
    confetti({
      particleCount: 25,
      spread: 40,
      origin: { x: 0.65, y: 0.35 },
      colors: ['#d8f3b9', '#ff8d6d', '#bde1e6', '#fac4d8'],
    });
    setTimeout(() => setCopied(false), 2000);
  }, [email]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessageSubmitted(true);
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.5 },
      colors: ['#d8f3b9', '#ff8d6d', '#bde1e6', '#fac4d8', '#1a4f4d'],
    });
    setTimeout(() => {
      setMessageSubmitted(false);
      setFormData({ name: '', email: '', message: '' });
      onClose();
    }, 2800);
  };

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="contact-backdrop"
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={onClose}
        >
          <motion.div
            ref={modalRef}
            className="contact-modal-simple"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
          >
            {/* ─── Floating Draggable Doodle Stickers ─── */}
            <FloatingSticker className="sticker-spiral" delay={0.3} rotate={-15} constraintsRef={modalRef}>
              <SpiralDoodle />
            </FloatingSticker>
            <FloatingSticker className="sticker-star" delay={0.45} rotate={12} constraintsRef={modalRef}>
              <StarBurstDoodle />
            </FloatingSticker>
            <FloatingSticker className="sticker-heart" delay={0.55} rotate={-8} constraintsRef={modalRef}>
              <HeartDoodle />
            </FloatingSticker>
            <FloatingSticker className="sticker-zigzag" delay={0.6} rotate={5} constraintsRef={modalRef}>
              <ZigzagDoodle />
            </FloatingSticker>
            <FloatingSticker className="sticker-smile" delay={0.7} rotate={-10} constraintsRef={modalRef}>
              <SmileDoodle />
            </FloatingSticker>
            <FloatingSticker className="sticker-arrow" delay={0.8} rotate={15} constraintsRef={modalRef}>
              <ArrowCurlDoodle />
            </FloatingSticker>

            {/* ─── Close Button ─── */}
            <motion.button
              className="contact-simple-close"
              onClick={onClose}
              aria-label="Close modal"
              whileHover={{ rotate: 90, scale: 1.1, backgroundColor: '#1a4f4d', color: '#ffffff' }}
              whileTap={{ scale: 0.9 }}
            >
              ✕
            </motion.button>

            {/* ─── Header ─── */}
            <motion.div className="contact-simple-header" variants={staggerChildren} initial="hidden" animate="visible">
              <motion.span className="contact-simple-badge" variants={fadeSlideUp}>
                GET IN TOUCH
              </motion.span>
              <motion.h2 className="contact-simple-title" variants={fadeSlideUp}>
                Let's work together.
              </motion.h2>
              <motion.p className="contact-simple-desc" variants={fadeSlideUp}>
                Have a project in mind or just want to say hi? Drop an email directly or leave a note below.
              </motion.p>

              {/* Quick email row */}
              <motion.div className="contact-simple-email-row" variants={fadeSlideUp}>
                <a href={`mailto:${email}`} className="contact-simple-email-link">
                  {email}
                </a>
                <motion.button
                  type="button"
                  className={`contact-simple-copy-btn${copied ? ' copied' : ''}`}
                  onClick={handleCopyEmail}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.92 }}
                >
                  {copied ? '✓ Copied!' : 'Copy'}
                </motion.button>
              </motion.div>
            </motion.div>

            {/* ─── Form or Success ─── */}
            <AnimatePresence mode="wait">
              {messageSubmitted ? (
                <motion.div
                  key="success"
                  className="contact-simple-success"
                  initial={{ opacity: 0, scale: 0.8, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 18 }}
                >
                  <motion.span
                    className="success-emoji"
                    animate={{ rotate: [0, -15, 15, -10, 10, 0], scale: [1, 1.3, 1.3, 1.2, 1.1, 1] }}
                    transition={{ duration: 0.8, ease: 'easeInOut' }}
                  >
                    🎉
                  </motion.span>
                  <h3>Message sent!</h3>
                  <p>Thanks for reaching out. I'll get back to you soon.</p>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  className="contact-simple-form"
                  onSubmit={handleSubmit}
                  variants={staggerChildren}
                  initial="hidden"
                  animate="visible"
                >
                  <motion.div className="contact-form-grid" variants={fadeSlideUp}>
                    <div className={`contact-input-wrapper${focusedField === 'name' ? ' focused' : ''}`}>
                      <input
                        type="text"
                        required
                        placeholder="Your name"
                        value={formData.name}
                        onFocus={() => setFocusedField('name')}
                        onBlur={() => setFocusedField(null)}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      />
                    </div>
                    <div className={`contact-input-wrapper${focusedField === 'email' ? ' focused' : ''}`}>
                      <input
                        type="email"
                        required
                        placeholder="Your email"
                        value={formData.email}
                        onFocus={() => setFocusedField('email')}
                        onBlur={() => setFocusedField(null)}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      />
                    </div>
                  </motion.div>

                  <motion.div
                    className={`contact-input-wrapper textarea-wrapper${focusedField === 'message' ? ' focused' : ''}`}
                    variants={fadeSlideUp}
                  >
                    <textarea
                      required
                      rows="4"
                      placeholder="Tell me about your project or inquiry..."
                      value={formData.message}
                      onFocus={() => setFocusedField('message')}
                      onBlur={() => setFocusedField(null)}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    ></textarea>
                  </motion.div>

                  <motion.button
                    type="submit"
                    className="contact-simple-submit"
                    variants={fadeSlideUp}
                    whileHover={{ y: -3, boxShadow: '0 12px 28px rgba(26, 79, 77, 0.35)' }}
                    whileTap={{ scale: 0.97, y: 0 }}
                  >
                    <span>Send message</span>
                    <motion.span
                      className="submit-arrow"
                      animate={{ x: 0, y: 0 }}
                      whileHover={{ x: 3, y: -3 }}
                    >
                      ↗
                    </motion.span>
                  </motion.button>
                </motion.form>
              )}
            </AnimatePresence>

            {/* ─── Footer ─── */}
            <motion.div
              className="contact-simple-footer"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <span className="footer-label">Elsewhere</span>
              <div className="footer-links">
                {[
                  { href: portfolioData.personalInfo.socialLinks.linkedin, label: 'LinkedIn' },
                  { href: portfolioData.personalInfo.socialLinks.behance, label: 'Behance' },
                  { href: portfolioData.personalInfo.socialLinks.resume, label: 'Resume' },
                ].map((link, i) => (
                  <motion.a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noreferrer"
                    whileHover={{ y: -2, color: '#ff4a21' }}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.55 + i * 0.08 }}
                  >
                    {link.label} ↗
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
