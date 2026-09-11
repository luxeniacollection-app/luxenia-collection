import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, Eye, Crown, ShoppingBag } from 'lucide-react';

export default function EditorialLookbook() {
  const [activeMood, setActiveMood] = useState(0);

  const lookbook = [
    {
      id: 'gala',
      title: 'The Nairobi Gala Evening',
      subtitle: 'Silk Drapes & 24K Antique Accents',
      bagName: 'The Sovereign Baguette — Noir Black',
      bagPrice: 'KSh 5,800',
      image: '/images/products/luxe-baguette-noir-black.jpg',
      quote: '“A whisper of midnight leather against radiant gold hardware.”',
      description: 'Pairs effortlessly with tailored tuxedo suiting or an emerald floor-length silk gown. Carry as an architectural clutch or shoulder baguette for black-tie evenings.',
      details: ['Noir Smooth Calfskin', '24K Gold Twist Clasp', 'Concealed Evening Vault'],
      productId: 'prod-001'
    },
    {
      id: 'boardroom',
      title: 'The Executive Boardroom',
      subtitle: 'Charcoal Tailoring & Uncompromising Presence',
      bagName: 'The Sovereign Carryall — Glazed Obsidian',
      bagPrice: 'KSh 6,800',
      image: '/images/products/luxe-shopper-glazed-noir.jpg',
      quote: '“Commanding authority crafted for the decisive leader.”',
      description: 'Generously proportioned for documents and personal essentials. Built from oil-wax pull-up leather that deepens in patina and character with every milestone.',
      details: ['Oil-Wax Glazed Calfskin', 'Capacious Interior', 'Reinforced Flat Handles'],
      productId: 'prod-005'
    },
    {
      id: 'brunch',
      title: 'The Karen Sunday Brunch',
      subtitle: 'Sunlit Ivory Linen & Organic Textures',
      bagName: 'The Sovereign Baguette — Ivory Pearl',
      bagPrice: 'KSh 5,800',
      image: '/images/products/luxe-baguette-ivory-cream.jpg',
      quote: '“Effortless luminosity under the East African sun.”',
      description: 'Luminous off-white leather highlighted by contrast dark edge paint. Complements relaxed cream knitwear, wide-leg linen trousers, and artisanal jewelry.',
      details: ['Luminous Ivory Pearl', 'Hand-Painted Edge Lacquer', 'Polished Gold Latch'],
      productId: 'prod-003'
    }
  ];

  const current = lookbook[activeMood];

  return (
    <section 
      className="editorial-lookbook-section"
      style={{
        padding: '7rem 1.5rem',
        background: 'linear-gradient(180deg, #07060A 0%, #100E1A 50%, #08070E 100%)',
        borderBottom: '1px solid rgba(212, 175, 55, 0.2)',
        position: 'relative'
      }}
    >
      <div className="luxe-container" style={{ maxWidth: '1240px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto 4rem' }}>
          <div 
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: 'rgba(212, 175, 55, 0.08)',
              border: '1px solid rgba(212, 175, 55, 0.35)',
              padding: '0.4rem 1.35rem',
              borderRadius: 'var(--radius-full)',
              marginBottom: '1.25rem'
            }}
          >
            <Crown size={14} color="var(--gold-400)" />
            <span style={{ fontSize: '0.74rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--gold-300)', fontWeight: '700' }}>
              STYLE GUIDE • HOW TO CARRY
            </span>
          </div>

          <h2 
            style={{ 
              fontFamily: 'var(--font-serif)', 
              fontSize: 'clamp(2.2rem, 4.5vw, 3.6rem)', 
              color: 'var(--text-pure-white)', 
              fontWeight: '700',
              lineHeight: 1.15,
              letterSpacing: '0.03em'
            }}
          >
            Curated Occasions
          </h2>
          <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', marginTop: '1rem', lineHeight: '1.75' }}>
            Explore how the Sovereign collection adapts effortlessly across high-stakes boardrooms, evening galas, and sunlit weekends.
          </p>

          {/* Lookbook Occasion Switchers */}
          <div 
            style={{
              display: 'flex',
              gap: '12px',
              justifyContent: 'center',
              flexWrap: 'wrap',
              marginTop: '2.5rem'
            }}
          >
            {lookbook.map((item, idx) => {
              const isActive = activeMood === idx;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveMood(idx)}
                  style={{
                    padding: '0.65rem 1.5rem',
                    background: isActive ? 'var(--gold-gradient)' : 'rgba(255, 255, 255, 0.05)',
                    color: isActive ? '#08070E' : 'var(--text-secondary)',
                    border: isActive ? '1px solid #FFF' : '1px solid var(--border-gold)',
                    borderRadius: 'var(--radius-full)',
                    fontWeight: isActive ? '800' : '600',
                    fontSize: '0.82rem',
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    cursor: 'pointer',
                    transition: 'all 0.25s ease'
                  }}
                >
                  {item.title}
                </button>
              );
            })}
          </div>
        </div>

        {/* Featured Editorial Split Banner */}
        <div 
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '3.5rem',
            alignItems: 'center',
            background: 'linear-gradient(160deg, rgba(24, 20, 34, 0.8) 0%, rgba(12, 11, 18, 0.95) 100%)',
            border: '1px solid var(--border-gold)',
            borderRadius: 'var(--radius-sm)',
            padding: 'clamp(2rem, 4vw, 3.5rem)',
            boxShadow: '0 20px 60px rgba(0,0,0,0.8), 0 0 35px rgba(212,175,55,0.1)'
          }}
          className="lookbook-split-container"
        >
          {/* Left: Editorial Bag Imagery */}
          <div style={{ position: 'relative' }}>
            <div 
              style={{
                aspectRatio: '4/4.8',
                borderRadius: 'var(--radius-xs)',
                overflow: 'hidden',
                border: '1px solid rgba(212, 175, 55, 0.4)',
                boxShadow: '0 15px 40px rgba(0,0,0,0.8)',
                background: '#090810'
              }}
            >
              <img 
                src={current.image} 
                alt={current.title} 
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  transition: 'opacity 0.4s ease'
                }}
              />
            </div>

            {/* Floating Editorial Label */}
            <div 
              style={{
                position: 'absolute',
                bottom: '16px',
                right: '16px',
                background: 'rgba(8, 7, 12, 0.88)',
                border: '1px solid var(--border-gold)',
                padding: '6px 14px',
                borderRadius: 'var(--radius-xs)',
                color: 'var(--gold-300)',
                fontSize: '0.74rem',
                fontWeight: '700',
                letterSpacing: '0.1em',
                textTransform: 'uppercase'
              }}
            >
              {current.bagPrice} • Nairobi Dispatch
            </div>
          </div>

          {/* Right: Editorial Narrative */}
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <span style={{ fontSize: '0.76rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--gold-400)', fontWeight: '700', display: 'block', marginBottom: '0.6rem' }}>
              {current.subtitle}
            </span>

            <h3 
              style={{ 
                fontFamily: 'var(--font-serif)', 
                fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)', 
                color: 'var(--text-pure-white)', 
                lineHeight: 1.2,
                marginBottom: '1rem'
              }}
            >
              {current.title}
            </h3>

            <p 
              style={{ 
                fontFamily: 'var(--font-editorial)', 
                fontSize: '1.4rem', 
                fontStyle: 'italic', 
                color: 'var(--gold-300)', 
                marginBottom: '1.5rem',
                lineHeight: 1.4
              }}
            >
              {current.quote}
            </p>

            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.8', marginBottom: '1.75rem' }}>
              {current.description}
            </p>

            {/* Key Craft Highlights */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '2.5rem' }}>
              {current.details.map((detail, dIdx) => (
                <span
                  key={dIdx}
                  style={{
                    background: 'rgba(212, 175, 55, 0.1)',
                    border: '1px solid rgba(212, 175, 55, 0.3)',
                    color: 'var(--gold-300)',
                    padding: '4px 12px',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '0.74rem',
                    fontWeight: '600'
                  }}
                >
                  ✦ {detail}
                </span>
              ))}
            </div>

            {/* Action buttons */}
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <Link
                to={`/product/${current.productId}`}
                className="btn-gold"
                style={{
                  padding: '0.95rem 2rem',
                  fontSize: '0.86rem',
                  letterSpacing: '0.12em',
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <ShoppingBag size={16} />
                <span>SHOP THIS SILHOUETTE</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
