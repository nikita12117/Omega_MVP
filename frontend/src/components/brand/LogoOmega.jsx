import React from 'react';

export const LogoOmega = ({ size = 28 }) => (
  <div className="relative inline-flex items-center" aria-label="Omega Aurora Codex logo">
    <span 
      className="font-semibold tracking-tight text-slate-100" 
      style={{ fontSize: size }} 
      data-testid="brand-omega-logo"
    >
      Ω
    </span>
    <svg 
      className="absolute -inset-1 pointer-events-none" 
      width="64" 
      height="64" 
      viewBox="0 0 64 64" 
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="g" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#06d6a0" stopOpacity="0.55"/>
          <stop offset="100%" stopColor="#06d6a0" stopOpacity="0"/>
        </radialGradient>
      </defs>
      <circle cx="32" cy="32" r="28" fill="url(#g)"/>
      <g stroke="#06d6a0" strokeOpacity="0.6" strokeWidth="1" fill="none">
        <path d="M10,40 C20,25 44,22 54,34">
          <animate attributeName="stroke-opacity" dur="4s" values="0.2;0.8;0.2" repeatCount="indefinite"/>
        </path>
        <path d="M8,28 C16,18 34,16 52,24">
          <animate attributeName="stroke-opacity" dur="5s" values="0.2;0.7;0.2" repeatCount="indefinite"/>
        </path>
      </g>
    </svg>
  </div>
);

export default LogoOmega;