import React from 'react';
import { Sparkles, Crown, Gem, ShoppingBag, Wind, Footprints, ShieldCheck } from 'lucide-react';

const categoryIcons = {
  'haute-couture': Crown,
  'fine-jewelry': Gem,
  'handbags': ShoppingBag,
  'fragrances': Wind,
  'footwear': Footprints,
  'accessories': Sparkles,
  'default': Crown
};

export default function ProductImagePlaceholder({ 
  productName = 'Luxe Nia Piece', 
  category = 'haute-couture',
  categoryName = 'Haute Couture',
  aspectRatio = '4/5',
  height = '100%',
  className = ''
}) {
  const IconComponent = categoryIcons[category] || categoryIcons.default;

  return (
    <div 
      className={`product-placeholder-frame ${className}`}
      style={{
        aspectRatio: aspectRatio,
        height: height,
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'radial-gradient(ellipse at 50% 40%, #1c1a24 0%, #0c0c10 80%, #070709 100%)',
        overflow: 'hidden',
        userSelect: 'none'
      }}
    >
      {/* Corner Filigree */}
      <div className="placeholder-corner tl" />
      <div className="placeholder-corner tr" />
      <div className="placeholder-corner bl" />
      <div className="placeholder-corner br" />

      {/* Subtle Radial Watermark Background */}
      <div 
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(212, 175, 55, 0.04) 0%, transparent 70%)',
          pointerEvents: 'none'
        }}
      />

      {/* Decorative Gold Crest Outline */}
      <div
        style={{
          width: '90px',
          height: '90px',
          borderRadius: '50%',
          border: '1px dashed rgba(212, 175, 55, 0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          marginBottom: '1rem',
          boxShadow: '0 0 30px rgba(212, 175, 55, 0.1)'
        }}
      >
        {/* Glowing Monogram Center */}
        <span
          style={{
            fontFamily: "'Cormorant Garamond', 'Playfair Display', serif",
            fontStyle: 'italic',
            fontSize: '2.4rem',
            fontWeight: '600',
            background: 'var(--gold-gradient)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '1px'
          }}
        >
          LN
        </span>

        {/* Small floating category icon */}
        <div
          style={{
            position: 'absolute',
            bottom: '-6px',
            right: '-6px',
            background: '#0D0D12',
            border: '1px solid var(--border-gold)',
            borderRadius: '50%',
            width: '26px',
            height: '26px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--gold-400)'
          }}
        >
          <IconComponent size={14} />
        </div>
      </div>

      {/* Product Name & Brand Tag */}
      <div style={{ textAlign: 'center', padding: '0 1.25rem', zIndex: 2 }}>
        <p
          style={{
            fontFamily: "'Cinzel', serif",
            fontSize: '0.85rem',
            color: 'var(--text-primary)',
            letterSpacing: '0.08em',
            marginBottom: '0.25rem',
            fontWeight: '600'
          }}
        >
          {productName}
        </p>
        <span
          style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: '0.68rem',
            color: 'var(--gold-400)',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            opacity: 0.85
          }}
        >
          {categoryName} • Luxe Nia Atelier
        </span>
      </div>

      {/* Atelier Awaiting Media Pill */}
      <div
        style={{
          position: 'absolute',
          bottom: '14px',
          background: 'rgba(10, 10, 14, 0.85)',
          backdropFilter: 'blur(6px)',
          border: '1px solid rgba(212, 175, 55, 0.25)',
          padding: '3px 10px',
          borderRadius: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          fontSize: '0.62rem',
          color: 'var(--text-muted)',
          letterSpacing: '0.05em'
        }}
      >
        <ShieldCheck size={11} color="var(--gold-400)" />
        <span>Awaiting Official Image</span>
      </div>
    </div>
  );
}
