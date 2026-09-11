import React, { useState } from 'react';
import { Sparkles, Crown, ShieldCheck, Check, ArrowRight, Eye, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AtelierAnatomy() {
  const [activeHotspot, setActiveHotspot] = useState(0);

  const hotspots = [
    {
      id: 'leather',
      number: '01',
      title: 'Full-Grain Calfskin',
      subtitle: 'Supple 1.4mm Vegetable-Tanned Leather',
      description: 'Hand-selected from ethical Kenyan tanneries. Retains authentic natural grain texture that softens and develops a rich, personal luster over years of use.',
      coordinates: { x: 32, y: 35 },
      icon: Crown,
      metric: '1.4mm Thickness'
    },
    {
      id: 'hardware',
      number: '02',
      title: 'Antique Gold-Tone Lock',
      subtitle: 'Weighted Precision Twist-Latch Mechanism',
      description: 'Solid forged alloy clasp electroplated in high-luster antique 24K gold tone. Engineered for a smooth, tactile click with structural security.',
      coordinates: { x: 50, y: 55 },
      icon: ShieldCheck,
      metric: 'High-Luster Electroplate'
    },
    {
      id: 'edge',
      number: '03',
      title: 'Hand-Burnished Edge Dressing',
      subtitle: 'Triple-Coated Artisanal Lacquer',
      description: 'Each raw leather seam undergoes three layers of hand-applied pigment and beeswax burnishing to ensure lifetime protection against fraying or weather.',
      coordinates: { x: 80, y: 48 },
      icon: Sparkles,
      metric: '3-Layer Burnish'
    },
    {
      id: 'lining',
      number: '04',
      title: 'Silk-Touch Interior Vault',
      subtitle: 'Satin-Lined Compartment Sanctuary',
      description: 'Supple interior lined with satin-touch jacquard featuring an internal zippered sanctuary and dedicated card slip for effortless organization.',
      coordinates: { x: 42, y: 72 },
      icon: Check,
      metric: 'Satin Jacquard'
    },
    {
      id: 'strap',
      number: '05',
      title: 'Convertible Strap Architecture',
      subtitle: '48cm Drop with 360° Swivel Clasps',
      description: 'Effortlessly transitions from an architectural evening clutch to a day shoulder baguette with reinforced stitch stress points.',
      coordinates: { x: 68, y: 22 },
      icon: ArrowRight,
      metric: '48cm Shoulder Drop'
    }
  ];

  const current = hotspots[activeHotspot];

  return (
    <section 
      className="atelier-anatomy-section"
      style={{
        padding: '7rem 1.5rem',
        background: 'radial-gradient(ellipse at 50% 40%, rgba(18, 16, 28, 0.7) 0%, rgba(8, 7, 12, 0.95) 70%, #050408 100%)',
        borderTop: '1px solid rgba(212, 175, 55, 0.2)',
        borderBottom: '1px solid rgba(212, 175, 55, 0.2)',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <div className="luxe-container" style={{ maxWidth: '1240px', margin: '0 auto' }}>
        {/* Section Header */}
        <div style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto 4.5rem' }}>
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
            <Sparkles size={14} color="var(--gold-400)" />
            <span style={{ fontSize: '0.74rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--gold-300)', fontWeight: '700' }}>
              HANDBAG CRAFTSMANSHIP & DETAILS
            </span>
          </div>

          <h2 
            style={{ 
              fontFamily: 'var(--font-serif)', 
              fontSize: 'clamp(2.2rem, 4.5vw, 3.4rem)', 
              color: 'var(--text-pure-white)', 
              fontWeight: '700',
              lineHeight: 1.15,
              letterSpacing: '0.03em'
            }}
          >
            Craftsmanship in Every Millimeter
          </h2>
          <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', marginTop: '1rem', lineHeight: '1.75' }}>
            Inspect the tactile construction of The Sovereign Baguette. Every curve, burnished stitch, and gold closure is forged to command quiet reverence.
          </p>
        </div>

        {/* Interactive Anatomy Showcase Grid */}
        <div 
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(300px, 1.25fr) minmax(300px, 1fr)',
            gap: '3rem',
            alignItems: 'center'
          }}
          className="anatomy-grid-wrapper"
        >
          {/* Left: Bag Interactive Dissection Stage with Pulsing Hotspots */}
          <div 
            style={{
              position: 'relative',
              borderRadius: 'var(--radius-sm)',
              overflow: 'hidden',
              border: '1px solid rgba(212, 175, 55, 0.3)',
              background: 'radial-gradient(circle at 50% 50%, #151320 0%, #09090E 80%)',
              boxShadow: '0 20px 60px rgba(0,0,0,0.8), 0 0 35px rgba(212,175,55,0.1)'
            }}
            className="anatomy-visual-stage"
          >
            <img 
              src="/images/products/luxe-baguette-noir-black.jpg" 
              alt="The Sovereign Baguette Anatomy" 
              style={{
                width: '100%',
                display: 'block',
                aspectRatio: '4/4.5',
                objectFit: 'cover',
                filter: 'brightness(0.95) contrast(1.05)'
              }}
            />

            {/* Glowing Hotspot Overlay Pins */}
            {hotspots.map((spot, idx) => {
              const isActive = activeHotspot === idx;
              return (
                <button
                  type="button"
                  key={spot.id}
                  onClick={() => setActiveHotspot(idx)}
                  onMouseEnter={() => setActiveHotspot(idx)}
                  aria-label={`Inspect ${spot.title}`}
                  style={{
                    position: 'absolute',
                    top: `${spot.coordinates.y}%`,
                    left: `${spot.coordinates.x}%`,
                    transform: isActive ? 'translate(-50%, -50%) scale(1.15)' : 'translate(-50%, -50%)',
                    width: '38px',
                    height: '38px',
                    borderRadius: '50%',
                    background: isActive ? '#D4AF37' : 'rgba(10, 9, 16, 0.9)',
                    border: isActive ? '3px solid #FFF' : '2px solid #D4AF37',
                    color: isActive ? '#000' : '#D4AF37',
                    fontWeight: '800',
                    fontSize: '0.78rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: isActive ? '0 0 25px rgba(212, 175, 55, 0.95), 0 0 10px #FFF' : '0 0 15px rgba(0,0,0,0.85)',
                    transition: 'all 0.25s ease',
                    zIndex: 25,
                    pointerEvents: 'auto'
                  }}
                  className={`anatomy-pin ${isActive ? 'active-pin' : ''}`}
                >
                  <span>{spot.number}</span>
                </button>
              );
            })}

            {/* Stage Footer Badge */}
            <div 
              style={{
                position: 'absolute',
                bottom: '16px',
                left: '16px',
                background: 'rgba(8, 7, 14, 0.85)',
                border: '1px solid var(--border-gold)',
                padding: '6px 14px',
                borderRadius: 'var(--radius-xs)',
                backdropFilter: 'blur(8px)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10B981', display: 'inline-block' }} />
              <span style={{ fontSize: '0.74rem', letterSpacing: '0.12em', color: 'var(--gold-300)', fontWeight: '700', textTransform: 'uppercase' }}>
                Artisan Spec: The Sovereign Baguette
              </span>
            </div>
          </div>

          {/* Right: Dynamic Specification Card & List Explorer */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
            {/* Active Detail Featured Card */}
            <div 
              style={{
                background: 'linear-gradient(160deg, rgba(26, 23, 38, 0.9) 0%, rgba(13, 12, 20, 0.95) 100%)',
                border: '1px solid var(--gold-400)',
                borderRadius: 'var(--radius-sm)',
                padding: '2.5rem 2rem',
                boxShadow: '0 15px 40px rgba(0,0,0,0.6), 0 0 30px rgba(212, 175, 55, 0.12)',
                position: 'relative'
              }}
              className="anatomy-featured-card"
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <span 
                  style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: '1.8rem',
                    color: 'var(--gold-300)',
                    fontWeight: '800'
                  }}
                >
                  {current.number}
                </span>

                <span 
                  style={{
                    fontSize: '0.74rem',
                    letterSpacing: '0.15em',
                    textTransform: 'uppercase',
                    color: 'var(--gold-400)',
                    background: 'rgba(212, 175, 55, 0.12)',
                    border: '1px solid var(--border-gold)',
                    padding: '4px 12px',
                    borderRadius: 'var(--radius-full)',
                    fontWeight: '700'
                  }}
                >
                  {current.metric}
                </span>
              </div>

              <h3 
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: '1.55rem',
                  color: 'var(--text-pure-white)',
                  marginBottom: '0.4rem',
                  fontWeight: '700'
                }}
              >
                {current.title}
              </h3>

              <p 
                style={{
                  fontSize: '0.85rem',
                  color: 'var(--gold-300)',
                  fontStyle: 'italic',
                  marginBottom: '1rem',
                  letterSpacing: '0.02em'
                }}
              >
                {current.subtitle}
              </p>

              <p 
                style={{
                  fontSize: '0.92rem',
                  color: 'var(--text-secondary)',
                  lineHeight: '1.8',
                  margin: 0
                }}
              >
                {current.description}
              </p>
            </div>

            {/* Quick Selector Pills for all 5 Hotspots */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {hotspots.map((spot, idx) => {
                const isActive = activeHotspot === idx;
                return (
                  <button
                    key={spot.id}
                    onClick={() => setActiveHotspot(idx)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.85rem 1.25rem',
                      background: isActive ? 'rgba(212, 175, 55, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                      border: isActive ? '1px solid var(--gold-400)' : '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-xs)',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      textAlign: 'left'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span 
                        style={{
                          fontSize: '0.8rem',
                          fontFamily: 'var(--font-serif)',
                          fontWeight: '800',
                          color: isActive ? 'var(--gold-300)' : 'var(--text-muted)'
                        }}
                      >
                        {spot.number}
                      </span>
                      <span 
                        style={{
                          fontSize: '0.88rem',
                          fontWeight: isActive ? '700' : '500',
                          color: isActive ? 'var(--text-pure-white)' : 'var(--text-secondary)'
                        }}
                      >
                        {spot.title}
                      </span>
                    </div>

                    <ChevronRight size={16} color={isActive ? 'var(--gold-400)' : 'var(--text-muted)'} />
                  </button>
                );
              })}
            </div>

            {/* Call to Action: View in Boutique */}
            <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
              <Link
                to="/product/prod-001"
                className="btn-gold"
                style={{
                  flex: 1,
                  padding: '1rem',
                  fontSize: '0.86rem',
                  letterSpacing: '0.14em',
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                <Eye size={16} />
                <span>INSPECT IN 360° BOUTIQUE</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
