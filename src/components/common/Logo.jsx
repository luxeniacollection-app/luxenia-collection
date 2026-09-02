import React from 'react';

export default function Logo({ size = 'md', className = '', onClick }) {
  // Sizes: sm, md, lg, xl
  const sizeMap = {
    sm: { scale: 0.75, width: 140, height: 48 },
    md: { scale: 1, width: 180, height: 60 },
    lg: { scale: 1.35, width: 230, height: 75 },
    xl: { scale: 1.8, width: 300, height: 100 }
  };

  const currentSize = sizeMap[size] || sizeMap.md;

  return (
    <div 
      className={`luxury-logo-wrapper ${className}`}
      onClick={onClick}
      style={{
        display: 'inline-flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: onClick ? 'pointer' : 'default',
        userSelect: 'none'
      }}
    >
      <svg 
        width={currentSize.width} 
        height={currentSize.height} 
        viewBox="0 0 240 80" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F9E498" />
            <stop offset="30%" stopColor="#E2BA60" />
            <stop offset="60%" stopColor="#C99738" />
            <stop offset="85%" stopColor="#E6C275" />
            <stop offset="100%" stopColor="#966D21" />
          </linearGradient>
          <linearGradient id="goldShine" x1="0%" y1="50%" x2="100%" y2="50%">
            <stop offset="0%" stopColor="#C99738" />
            <stop offset="50%" stopColor="#FFF2B2" />
            <stop offset="100%" stopColor="#A77B28" />
          </linearGradient>
          <filter id="goldGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Monogram LN */}
        <g filter="url(#goldGlow)">
          {/* Stylized L */}
          <path
            d="M 68 18 C 76 10, 88 12, 94 19 C 100 26, 92 36, 84 46 C 78 54, 72 58, 64 58 C 56 58, 52 52, 60 44 C 68 36, 84 44, 98 48 C 114 52, 134 50, 146 45 C 132 46, 116 43, 102 38 C 92 34, 82 28, 86 20 C 88 16, 82 14, 78 16 C 72 18, 66 22, 68 18 Z"
            fill="url(#goldGradient)"
          />
          {/* Stylized N interwoven */}
          <path
            d="M 98 16 L 102 48 M 102 20 L 128 48 M 128 16 L 128 48"
            stroke="url(#goldShine)"
            strokeWidth="3.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>

        {/* Luxe Nia script */}
        <text
          x="120"
          y="63"
          textAnchor="middle"
          fill="url(#goldGradient)"
          style={{
            fontFamily: "'Cormorant Garamond', 'Playfair Display', cursive, serif",
            fontSize: '25px',
            fontStyle: 'italic',
            fontWeight: '600',
            letterSpacing: '1px'
          }}
        >
          Luxe Nia
        </text>

        {/* COLLECTIONS subtext */}
        <text
          x="120"
          y="75"
          textAnchor="middle"
          fill="#D4AF37"
          style={{
            fontFamily: "'Cinzel', 'Montserrat', serif",
            fontSize: '7.5px',
            fontWeight: '600',
            letterSpacing: '7px',
            opacity: 0.9
          }}
        >
          COLLECTIONS
        </text>
      </svg>
    </div>
  );
}
