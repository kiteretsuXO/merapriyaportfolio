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

// Cleaner Adobe Creative Cloud-style badge
export function AdobeLogo({ size = 18, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <rect width="24" height="24" rx="5" fill="#E24B39"/>
      <path d="M8 17.2L10.8 6.8H13.2L16 17.2H13.7L12.9 14.8H11.1L10.3 17.2H8ZM11.3 12.8H12.7L12.1 9.9L11.3 12.8Z" fill="#FFFFFF"/>
    </svg>
  );
}

// Cleaner ChatGPT-style badge with a simple chat bubble + sparkle
export function ChatGPTLogo({ size = 18, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <rect width="24" height="24" rx="5" fill="#12A37F"/>
      <path d="M7.5 7.5C7.5 6.12 8.62 5 10 5H14C15.38 5 16.5 6.12 16.5 7.5V11.5C16.5 12.88 15.38 14 14 14H11.3L8.5 16.5V14H10C8.62 14 7.5 12.88 7.5 11.5V7.5Z" fill="#FFFFFF"/>
      <circle cx="10.8" cy="9.3" r="0.8" fill="#12A37F"/>
      <circle cx="13.2" cy="9.3" r="0.8" fill="#12A37F"/>
      <path d="M10.8 11.1C11.3 11.5 12.7 11.5 13.2 11.1" stroke="#12A37F" strokeWidth="0.9" strokeLinecap="round"/>
    </svg>
  );
}

// Cleaner Claude-style badge with a crisp A mark
export function ClaudeLogo({ size = 18, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <rect width="24" height="24" rx="5" fill="#D97757"/>
      <path d="M7 17.2L11.2 6.8H12.8L17 17.2H14.8L14 14.9H10L9.2 17.2H7ZM10.5 12.8H13.5L12.4 9.8L10.5 12.8Z" fill="#FFFFFF"/>
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
