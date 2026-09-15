import React from 'react';

// Official 5-Color Figma Teardrop Logo
export function FigmaLogo({ size = 18, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 38 57" fill="none" className={className}>
      <path d="M19 28.5C19 23.2533 23.2533 19 28.5 19C33.7467 19 38 23.2533 38 28.5C38 33.7467 33.7467 38 28.5 38H19V28.5Z" fill="#1ABCFE"/>
      <path d="M0 47.5C0 42.2533 4.25329 38 9.5 38H19V47.5C19 52.7467 14.7467 57 9.5 57C4.25329 57 0 52.7467 0 47.5Z" fill="#0ACF83"/>
      <path d="M19 0V19H28.5C33.7467 19 38 14.7467 38 9.5C38 4.25329 33.7467 0 28.5 0H19Z" fill="#FF7262"/>
      <path d="M0 9.5C0 14.7467 4.25329 19 9.5 19H19V0H9.5C4.25329 0 0 4.25329 0 9.5Z" fill="#F24E1E"/>
      <path d="M0 28.5C0 33.7467 4.25329 38 9.5 38H19V19H9.5C4.25329 19 0 23.2533 0 28.5Z" fill="#A259FF"/>
    </svg>
  );
}

// Official Framer Blue Logo
export function FramerLogo({ size = 18, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M4 0H20V8H12L4 0Z" fill="#0055FF"/>
      <path d="M4 8H12L20 16H4V8Z" fill="#0055FF"/>
      <path d="M4 16H12V24L4 16Z" fill="#0055FF"/>
    </svg>
  );
}

// Official Adobe Creative Cloud App Badge (Red with White CC Infinity Loop)
export function AdobeLogo({ size = 18, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <rect width="24" height="24" rx="5" fill="#DA1F26"/>
      <path d="M13.2 7.2c-1.8 0-3.3 1.5-3.3 3.3 0 .2.03.4.07.6-.9.2-1.5 1-1.5 2 0 1.1.9 2 2 2h5.5c1.1 0 2-.9 2-2 0-1-.7-1.8-1.7-2 .07-.2.1-.4.1-.6 0-1.8-1.5-3.3-3.3-3.3z" fill="#FFFFFF"/>
    </svg>
  );
}

// Official ChatGPT / OpenAI App Badge (Teal with White Vortex)
export function ChatGPTLogo({ size = 18, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <rect width="24" height="24" rx="5" fill="#10A37F"/>
      <path d="M17.5 10.2a3.8 3.8 0 0 0-.3-2.5 3.8 3.8 0 0 0-3.3-1.8c-.3 0-.7.05-1 .15A3.8 3.8 0 0 0 10.3 5a3.8 3.8 0 0 0-3.6 2.6c-.3.1-.7.2-1 .4A3.8 3.8 0 0 0 5 11.5c0 1.2.6 2.3 1.5 3a3.8 3.8 0 0 0 .3 2.5 3.8 3.8 0 0 0 3.3 1.8c.3 0 .7-.05 1-.15a3.8 3.8 0 0 0 2.6 1.1 3.8 3.8 0 0 0 3.6-2.6c.3-.1.7-.2 1-.4a3.8 3.8 0 0 0 0-6.7zm-5.5 7.5a2.5 2.5 0 0 1-1.6-.6l.1-.1 2-1.1a.5.5 0 0 0 .2-.4v-3l.9.5v2.4a2.5 2.5 0 0 1-1.6 2.3zm-4.3-1.9a2.5 2.5 0 0 1-.3-1.7l.1.1 2 1.1a.5.5 0 0 0 .5 0l2.5-1.4v1l-2.1 1.2a2.5 2.5 0 0 1-2.7-.3zm-1.1-4.7a2.5 2.5 0 0 1 1.3-1.2v2.4a.5.5 0 0 0 .2.4l2.5 1.4-.9.5-2.1-1.2a2.5 2.5 0 0 1-1-2.3zm7.8-2l-2.5 1.4v-1l2.1-1.2a2.5 2.5 0 0 1 3 2.1l-.1-.1-2-1.1a.5.5 0 0 0-.5 0zm2 3.3a2.5 2.5 0 0 1-1.3 1.2v-2.4a.5.5 0 0 0-.2-.4l-2.5-1.4.9-.5 2.1 1.2a2.5 2.5 0 0 1 1 2.3zm-5.2-.8l.9-1.5.9 1.5v3l-.9 1.5-.9-1.5v-3z" fill="#FFFFFF"/>
    </svg>
  );
}

// Official Anthropic Claude App Badge (Terracotta with White Anthropic A Logo)
export function ClaudeLogo({ size = 18, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <rect width="24" height="24" rx="5" fill="#D97757"/>
      <path d="M6.8 17.2L12 5.5l5.2 11.7h-2.3l-1.1-2.6H10.2l-1.1 2.6H6.8zm4.2-4.6h2l-1-2.4-1 2.4z" fill="#FFFFFF"/>
    </svg>
  );
}

// Official Google Gemini Gradient Spark Star
export function GeminiLogo({ size = 18, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <defs>
        <linearGradient id="gemini-grad-spark" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1A73E8" />
          <stop offset="50%" stopColor="#8AB4F8" />
          <stop offset="100%" stopColor="#EA4335" />
        </linearGradient>
      </defs>
      <path d="M12 0C12 6.627 6.627 12 0 12C6.627 12 12 17.373 12 24C12 17.373 17.373 12 24 12C17.373 12 12 6.627 12 0Z" fill="url(#gemini-grad-spark)" />
    </svg>
  );
}
