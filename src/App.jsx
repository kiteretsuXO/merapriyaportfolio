import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Lenis from 'lenis';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ContactModal from './components/ContactModal';
import ProjectModal from './components/ProjectModal';
import ScrollToTop from './components/ScrollToTop';

import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import MusicPage from './pages/MusicPage';

export default function App() {
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  // Initialize smooth scrolling with Lenis
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // smooth ease-out
      smoothWheel: true,
      wheelMultiplier: 1.2,
      touchMultiplier: 2,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <BrowserRouter>
      <ScrollToTop />
      <div className="portfolio-app">
        {/* Top Header Bar */}
        <Navbar onOpenContact={() => setIsContactOpen(true)} />

        {/* Dynamic Page Routes */}
        <Routes>
          <Route 
            path="/" 
            element={<HomePage onSelectProject={(project) => setSelectedProject(project)} />} 
          />
          <Route 
            path="/about" 
            element={<AboutPage onOpenContact={() => setIsContactOpen(true)} />} 
          />
          <Route 
            path="/fun" 
            element={<MusicPage />} 
          />
          <Route 
            path="/music" 
            element={<MusicPage />} 
          />
        </Routes>

        {/* Global Footer */}
        <Footer onOpenContact={() => setIsContactOpen(true)} />

        {/* Contact Modal Drawer */}
        <ContactModal
          isOpen={isContactOpen}
          onClose={() => setIsContactOpen(false)}
        />

        {/* Case Study Modal */}
        <ProjectModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      </div>
    </BrowserRouter>
  );
}
