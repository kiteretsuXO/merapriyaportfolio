import React from 'react';
import { motion } from 'framer-motion';
import AboutSection from '../components/AboutSection';
import './AboutPage.css';

export default function AboutPage({ onOpenContact }) {
  return (
    <motion.div
      className="about-page-view"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Main About Component */}
      <main className="about-page-main">
        <AboutSection onOpenContact={onOpenContact} />
      </main>
    </motion.div>
  );
}
