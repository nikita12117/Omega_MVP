import React from 'react';

export const OmegaLogo = ({ className = "", size = 28, ...props }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Omega Aurora Codex logo"
      className={className}
      {...props}
    >
      <defs>
        <linearGradient id="omega-gradient" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#06d6a0" />
          <stop offset="100%" stopColor="#1e3a8a" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="1" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      
      {/* Omega symbol */}
      <path
        d="M5 11c0-5 4-8 11-8s11 3.5 11 8c0 3.5-2.2 6.2-5.5 7.2 2.8 1 4.5 3.5 4.5 7.8h-4c0-3.5-2-5.5-6-5.5s-6 2-6 5.5h-4c0-4.3 1.7-6.8 4.5-7.8C7.2 17.2 5 14.5 5 11z"
        fill="none"
        stroke="url(#omega-gradient)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        filter="url(#glow)"
      />
      
      {/* Neural connection nodes */}
      <circle cx="10" cy="10" r="1.5" fill="#06d6a0" opacity="0.8" />
      <circle cx="22" cy="10" r="1.5" fill="#06d6a0" opacity="0.8" />
      <circle cx="16" cy="6" r="1" fill="#1e3a8a" opacity="0.6" />
      
      {/* Neural pathways */}
      <path
        d="M10 10 L16 6 L22 10"
        stroke="#06d6a0"
        strokeWidth="0.5"
        opacity="0.4"
        strokeDasharray="2 2"
      />
    </svg>
  );
};

export default OmegaLogo;