import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  Sparkles, 
  Crown, 
  ShieldCheck, 
  Award, 
  Truck, 
  ShoppingBag,
  HeartHandshake,
  Eye
} from 'lucide-react';
import { WhatsAppIcon } from '../common/SocialIcons';
import { getWhatsAppInquiryUrl, OFFICIAL_DISPLAY_PHONE } from '../../utils/whatsapp';

// Luxury Signature Modules
import GoldParticlesHeroCanvas from '../common/GoldParticlesHeroCanvas';
import MonogramStudioModal from '../common/MonogramStudioModal';
import AuthenticityCertificateModal from '../common/AuthenticityCertificateModal';

export default function HomePage() {
  const [activePillar, setActivePillar] = useState(0);
  const [monogramProduct, setMonogramProduct] = useState(null);
  const [certificateProduct, setCertificateProduct] = useState(null);

  const experiencePillars = [
    {
      num: '01',
      title: 'ELEGANCE',
      quote: 'Designed for effortless sophistication.',
      description: 'Architectural silhouettes curated with timeless proportions, balancing contemporary modernity with generational poise.'
    },
    {
      num: '02',
      title: 'QUALITY',
      quote: 'Crafted to complement your everyday luxury.',
      description: 'Supple full-grain calf leather, meticulous edge-paint burnishing, and solid antique gold-tone hardware forged to endure.'
    },
    {
      num: '03',
      title: 'CONFIDENCE',
      quote: 'Carry your style. Own your presence.',
      description: 'An unmistakable statement of African luxury that commands attention with quiet grandeur in every room you enter.'
    }
  ];

  const brandValues = [
    {
      icon: Crown,
      title: 'Full-Grain Calfskin',
      desc: 'Supple, enduring leather hand-selected for luxurious texture and longevity.'
    },
    {
      icon: Award,
      title: 'Polished Gold-Tone Hardware',
      desc: 'Precision-engineered antique gold fixtures designed with timeless structural integrity.'
    },
    {
      icon: Truck,
      title: 'Same-Day Nairobi Delivery',
      desc: 'Complimentary white-glove express courier dispatch to your doorstep across Kenya.'
    },
    {
      icon: HeartHandshake,
      title: 'Direct WhatsApp Concierge',
      desc: 'Personalized atelier assistance for custom orders, styling, and seamless delivery.'
    }
  ];

  return (
    <div className="homepage-brand-experience">
      {/* =================================================================
          1. HERO SECTION: EDITORIAL FULL-SCREEN LUXURY HERO WITH GOLD PARTICLES
          ================================================================= */}
      <section 
        className="luxury-hero"
        style={{
          position: 'relative',
          minHeight: '90vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'radial-gradient(ellipse at 50% 35%, #181522 0%, #0c0c12 55%, #050508 100%)',
          overflow: 'hidden',
          padding: '7rem 1.5rem 6rem',
          textAlign: 'center'
        }}
      >
        {/* Floating Living 24K Gold Particles Canvas */}
        <GoldParticlesHeroCanvas />

        {/* Ambient Gold Radial Glow */}
        <div 
          className="ambient-glow"
          style={{
            position: 'absolute',
            top: '25%',
            left: '50%',
            transform: 'translate(-50%, -25%)',
            width: '800px',
            height: '800px',
            background: 'radial-gradient(circle, rgba(212, 175, 55, 0.15) 0%, rgba(180, 130, 40, 0.04) 50%, transparent 70%)',
            pointerEvents: 'none',
            zIndex: 1
          }}
        />

        <div className="luxe-container" style={{ position: 'relative', zIndex: 2, maxWidth: '960px', margin: '0 auto' }}>
          {/* Subtle Atelier Tag */}
          <div 
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: 'rgba(212, 175, 55, 0.08)',
              border: '1px solid rgba(212, 175, 55, 0.35)',
              padding: '0.45rem 1.5rem',
              borderRadius: 'var(--radius-full)',
              marginBottom: '2rem',
              backdropFilter: 'blur(8px)',
              boxShadow: '0 0 20px rgba(212, 175, 55, 0.15)'
            }}
          >
            <Crown size={14} color="var(--gold-400)" />
            <span style={{ fontSize: '0.76rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--gold-300)', fontWeight: '700' }}>
              LUXURY HANDBAGS • NAIROBI
            </span>
          </div>

          {/* Brand Title */}
          <h1 
            style={{
              fontSize: 'clamp(3.2rem, 8vw, 6.2rem)',
              fontFamily: 'var(--font-serif)',
              fontWeight: '700',
              letterSpacing: '0.14em',
              lineHeight: '1.05',
              marginBottom: '1rem',
              color: '#FFFFFF',
              textTransform: 'uppercase',
              textShadow: '0 4px 30px rgba(0,0,0,0.8)'
            }}
          >
            LUXE NIA
          </h1>

          {/* Brand Signature Tagline */}
          <p 
            style={{
              fontSize: 'clamp(1.5rem, 3.5vw, 2.6rem)',
              fontFamily: 'var(--font-serif)',
              fontStyle: 'italic',
              fontWeight: '400',
              color: 'var(--gold-300)',
              marginBottom: '1.5rem',
              letterSpacing: '0.04em'
            }}
          >
            “Elegance You Carry.”
          </p>

          {/* Short Luxury Statement */}
          <p 
            style={{
              fontSize: 'clamp(1rem, 1.8vw, 1.25rem)',
              fontFamily: 'var(--font-sans)',
              color: 'var(--text-secondary)',
              lineHeight: '1.8',
              maxWidth: '660px',
              margin: '0 auto 2.75rem',
              fontWeight: '300',
              letterSpacing: '0.02em'
            }}
          >
            Timeless leather pieces designed to command quiet reverence. Handcrafted from full-grain calfskin with antique gold fixtures in Nairobi.
          </p>

          {/* Hero CTAs */}
          <div style={{ display: 'flex', gap: '1.25rem', justifyContent: 'center', flexWrap: 'wrap', alignItems: 'center' }}>
            <Link
              to="/shop"
              className="btn-gold"
              style={{
                padding: '1.2rem 3.5rem',
                fontSize: '0.96rem',
                letterSpacing: '0.16em',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '12px',
                boxShadow: '0 10px 35px rgba(212, 175, 55, 0.4)',
                transition: 'all 0.3s ease'
              }}
            >
              <ShoppingBag size={18} />
              <span>SHOP HANDBAGS</span>
              <ArrowRight size={18} />
            </Link>

            {/* Interactive Monogram Studio Trigger Button */}
            <button
              onClick={() => setMonogramProduct({ id: 'prod-001', name: 'The Sovereign Baguette Flap Bag' })}
              className="btn-gold-outline"
              style={{
                padding: '1.2rem 2.2rem',
                fontSize: '0.92rem',
                letterSpacing: '0.12em',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                cursor: 'pointer'
              }}
            >
              <Sparkles size={17} color="var(--gold-400)" />
              <span>ADD YOUR INITIALS</span>
            </button>
          </div>
        </div>
      </section>

      {/* =================================================================
          2. BRAND HERITAGE & ATELIER VALUES SECTION
          ================================================================= */}
      <section 
        className="home-brand-heritage"
        style={{
          padding: '6.5rem 1.5rem',
          background: '#07070A',
          borderTop: '1px solid rgba(212, 175, 55, 0.15)',
          borderBottom: '1px solid rgba(212, 175, 55, 0.15)'
        }}
      >
        <div className="luxe-container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
            {brandValues.map((val, idx) => {
              const IconComp = val.icon;
              return (
                <div
                  key={idx}
                  className="heritage-card"
                  style={{
                    background: 'linear-gradient(160deg, #13121C 0%, #09090D 100%)',
                    border: '1px solid var(--border-gold)',
                    borderRadius: 'var(--radius-xs)',
                    padding: '2.25rem 1.75rem',
                    textAlign: 'center',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.6)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center'
                  }}
                >
                  <div 
                    style={{
                      width: '56px',
                      height: '56px',
                      borderRadius: '50%',
                      background: 'rgba(212, 175, 55, 0.1)',
                      border: '1px solid var(--border-gold)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '1.25rem',
                      color: 'var(--gold-400)'
                    }}
                  >
                    <IconComp size={26} />
                  </div>
                  <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.15rem', color: 'var(--text-pure-white)', marginBottom: '0.6rem' }}>
                    {val.title}
                  </h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.65', margin: 0 }}>
                    {val.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* =================================================================
          3. ARTISAN CRAFTSMANSHIP SPECIFICATIONS & MATERIAL STANDARDS
          ================================================================= */}
      <section 
        className="craftsmanship-specs-section"
        style={{
          padding: '6.5rem 1.5rem',
          background: '#07070A',
          borderTop: '1px solid rgba(212, 175, 55, 0.15)',
          borderBottom: '1px solid rgba(212, 175, 55, 0.15)'
        }}
      >
        <div className="luxe-container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 4rem' }}>
            <div 
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: 'rgba(212, 175, 55, 0.08)',
                border: '1px solid rgba(212, 175, 55, 0.35)',
                padding: '0.45rem 1.5rem',
                borderRadius: 'var(--radius-full)',
                marginBottom: '1.25rem'
              }}
            >
              <Crown size={14} color="var(--gold-400)" />
              <span style={{ fontSize: '0.74rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--gold-300)', fontWeight: '700' }}>
                TECHNICAL STANDARDS & DETAILS
              </span>
            </div>

            <h2 
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: 'clamp(2.2rem, 4.5vw, 3.4rem)',
                color: 'var(--text-pure-white)',
                fontWeight: '700',
                letterSpacing: '0.04em',
                lineHeight: 1.15
              }}
            >
              The Science of Leather Craft
            </h2>

            <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', marginTop: '1rem', lineHeight: '1.75' }}>
              Every Luxe Nia handbag is engineered according to uncompromising structural tolerances, material grading, and artisan hand-finishing.
            </p>
          </div>

          {/* 6 Technical Specification Cards */}
          <div 
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '1.75rem',
              marginBottom: '3.5rem'
            }}
          >
            <div 
              style={{
                background: 'linear-gradient(160deg, #13121C 0%, #09090D 100%)',
                border: '1px solid var(--border-gold)',
                borderRadius: 'var(--radius-xs)',
                padding: '2.25rem',
                boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <span style={{ fontSize: '0.74rem', color: 'var(--gold-300)', fontWeight: '700', letterSpacing: '0.15em', textTransform: 'uppercase' }}>SPEC 01 • MATERIAL</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--gold-400)', background: 'rgba(212,175,55,0.1)', border: '1px solid var(--border-gold)', padding: '2px 8px', borderRadius: 'var(--radius-full)' }}>1.4mm Caliber</span>
              </div>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', color: 'var(--text-pure-white)', marginBottom: '0.75rem' }}>Full-Grain Calf Leather</h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: '1.7', margin: 0 }}>
                Sourced from ethical East African tanneries. Only the uppermost layer of the hide is selected, preserving natural breathability and grain strength that gracefully ages with time.
              </p>
            </div>

            <div 
              style={{
                background: 'linear-gradient(160deg, #13121C 0%, #09090D 100%)',
                border: '1px solid var(--border-gold)',
                borderRadius: 'var(--radius-xs)',
                padding: '2.25rem',
                boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <span style={{ fontSize: '0.74rem', color: 'var(--gold-300)', fontWeight: '700', letterSpacing: '0.15em', textTransform: 'uppercase' }}>SPEC 02 • HARDWARE</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--gold-400)', background: 'rgba(212,175,55,0.1)', border: '1px solid var(--border-gold)', padding: '2px 8px', borderRadius: 'var(--radius-full)' }}>24K Antique Plating</span>
              </div>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', color: 'var(--text-pure-white)', marginBottom: '0.75rem' }}>Solid Forged Brass Alloy</h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: '1.7', margin: 0 }}>
                Twist clasps, D-rings, and zippers are forged from heavy solid alloy and electroplated with antique gold tone for scratch-resistant luster and reassuring heft.
              </p>
            </div>

            <div 
              style={{
                background: 'linear-gradient(160deg, #13121C 0%, #09090D 100%)',
                border: '1px solid var(--border-gold)',
                borderRadius: 'var(--radius-xs)',
                padding: '2.25rem',
                boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <span style={{ fontSize: '0.74rem', color: 'var(--gold-300)', fontWeight: '700', letterSpacing: '0.15em', textTransform: 'uppercase' }}>SPEC 03 • SEAMS</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--gold-400)', background: 'rgba(212,175,55,0.1)', border: '1px solid var(--border-gold)', padding: '2px 8px', borderRadius: 'var(--radius-full)' }}>7 Stitches / Inch</span>
              </div>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', color: 'var(--text-pure-white)', marginBottom: '0.75rem' }}>Reinforced Saddle Stitching</h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: '1.7', margin: 0 }}>
                Constructed using bonded tensile thread. Key stress zones—including handle anchors and base corners—receive double-backstitched reinforcements to prevent unraveling.
              </p>
            </div>

            <div 
              style={{
                background: 'linear-gradient(160deg, #13121C 0%, #09090D 100%)',
                border: '1px solid var(--border-gold)',
                borderRadius: 'var(--radius-xs)',
                padding: '2.25rem',
                boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <span style={{ fontSize: '0.74rem', color: 'var(--gold-300)', fontWeight: '700', letterSpacing: '0.15em', textTransform: 'uppercase' }}>SPEC 04 • EDGES</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--gold-400)', background: 'rgba(212,175,55,0.1)', border: '1px solid var(--border-gold)', padding: '2px 8px', borderRadius: 'var(--radius-full)' }}>3-Layer Lacquer</span>
              </div>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', color: 'var(--text-pure-white)', marginBottom: '0.75rem' }}>Hand-Burnished Edge Paint</h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: '1.7', margin: 0 }}>
                Raw cut leather edges are hand-sanded, coated with flexible edge paint, and burnished with organic beeswax to form an impervious barrier against humidity and daily wear.
              </p>
            </div>

            <div 
              style={{
                background: 'linear-gradient(160deg, #13121C 0%, #09090D 100%)',
                border: '1px solid var(--border-gold)',
                borderRadius: 'var(--radius-xs)',
                padding: '2.25rem',
                boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <span style={{ fontSize: '0.74rem', color: 'var(--gold-300)', fontWeight: '700', letterSpacing: '0.15em', textTransform: 'uppercase' }}>SPEC 05 • INTERIOR</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--gold-400)', background: 'rgba(212,175,55,0.1)', border: '1px solid var(--border-gold)', padding: '2px 8px', borderRadius: 'var(--radius-full)' }}>Satin Jacquard</span>
              </div>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', color: 'var(--text-pure-white)', marginBottom: '0.75rem' }}>Protective Interior Vault</h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: '1.7', margin: 0 }}>
                Lined in smooth midnight satin jacquard that protects delicate personal items, sunglasses, and phones from abrasion, complete with a zip compartment and gold-foil leather patch.
              </p>
            </div>

            <div 
              style={{
                background: 'linear-gradient(160deg, #13121C 0%, #09090D 100%)',
                border: '1px solid var(--border-gold)',
                borderRadius: 'var(--radius-xs)',
                padding: '2.25rem',
                boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <span style={{ fontSize: '0.74rem', color: 'var(--gold-300)', fontWeight: '700', letterSpacing: '0.15em', textTransform: 'uppercase' }}>SPEC 06 • AUTHENTICITY</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--gold-400)', background: 'rgba(212,175,55,0.1)', border: '1px solid var(--border-gold)', padding: '2px 8px', borderRadius: 'var(--radius-full)' }}>Verified Guarantee</span>
              </div>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', color: 'var(--text-pure-white)', marginBottom: '0.75rem' }}>Individually Certified</h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: '1.7', margin: 0 }}>
                Every handbag is authenticated with an internal registry number and accompanied by our official certificate guaranteeing genuine calfskin provenance and Nairobi artisan assembly.
              </p>
            </div>
          </div>

          {/* Interactive Certificate Inspection Action */}
          <div style={{ textAlign: 'center' }}>
            <button
              onClick={() => setCertificateProduct({ id: 'prod-001', name: 'The Sovereign Baguette Flap Bag', priceKes: 5800 })}
              className="btn-gold-outline"
              style={{
                padding: '1rem 2.25rem',
                fontSize: '0.88rem',
                letterSpacing: '0.12em',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                cursor: 'pointer'
              }}
            >
              <ShieldCheck size={18} color="var(--gold-400)" />
              <span>INSPECT CERTIFICATE OF AUTHENTICITY</span>
            </button>
          </div>
        </div>
      </section>

      {/* =================================================================
          4. INTERACTIVE FEATURE: “THE LUXE NIA EXPERIENCE”
          ================================================================= */}
      <section 
        className="experience-section"
        style={{
          padding: '7rem 1.5rem',
          background: 'linear-gradient(180deg, #050508 0%, #0B0B10 50%, #07070A 100%)',
          borderBottom: '1px solid rgba(212, 175, 55, 0.15)'
        }}
      >
        <div className="luxe-container" style={{ maxWidth: '1140px', margin: '0 auto' }}>
          {/* Section Header */}
          <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 4.5rem' }}>
            <span 
              style={{
                fontSize: '0.76rem',
                letterSpacing: '0.24em',
                textTransform: 'uppercase',
                color: 'var(--gold-400)',
                fontWeight: '700',
                display: 'block',
                marginBottom: '0.75rem'
              }}
            >
              OUR PHILOSOPHY
            </span>
            <h2 
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: 'clamp(2.2rem, 4.5vw, 3.4rem)',
                color: 'var(--text-pure-white)',
                fontWeight: '700',
                letterSpacing: '0.04em'
              }}
            >
              THE LUXE NIA EXPERIENCE
            </h2>
            <div style={{ width: '60px', height: '2px', background: 'var(--gold-400)', margin: '1.25rem auto 0' }} />
          </div>

          {/* 3 Interactive Experience Pillars */}
          <div 
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(310px, 1fr))',
              gap: '2.5rem'
            }}
          >
            {experiencePillars.map((pillar, idx) => {
              const isHovered = activePillar === idx;
              return (
                <div
                  key={idx}
                  className={`experience-pillar-card ${isHovered ? 'active-pillar' : ''}`}
                  onMouseEnter={() => setActivePillar(idx)}
                  style={{
                    background: isHovered 
                      ? 'linear-gradient(160deg, rgba(28, 25, 38, 0.85) 0%, rgba(14, 14, 20, 0.95) 100%)'
                      : 'linear-gradient(160deg, rgba(18, 17, 24, 0.5) 0%, rgba(10, 10, 14, 0.8) 100%)',
                    border: isHovered ? '1px solid var(--gold-400)' : '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-xs)',
                    padding: '3rem 2.25rem',
                    position: 'relative',
                    transition: 'all 0.35s ease',
                    boxShadow: isHovered ? '0 15px 40px rgba(0,0,0,0.8), 0 0 25px rgba(212,175,55,0.15)' : 'none',
                    transform: isHovered ? 'translateY(-6px)' : 'none',
                    cursor: 'default'
                  }}
                >
                  {/* Pillar Number */}
                  <span 
                    style={{
                      fontFamily: 'var(--font-serif)',
                      fontSize: '1.8rem',
                      color: isHovered ? 'var(--gold-300)' : 'rgba(212,175,55,0.4)',
                      fontWeight: '700',
                      letterSpacing: '0.1em',
                      display: 'block',
                      marginBottom: '1.5rem',
                      transition: 'color 0.3s ease'
                    }}
                  >
                    {pillar.num} — {pillar.title}
                  </span>

                  {/* Quote */}
                  <h3 
                    style={{
                      fontFamily: 'var(--font-serif)',
                      fontSize: '1.35rem',
                      color: 'var(--text-pure-white)',
                      lineHeight: '1.4',
                      marginBottom: '1.25rem',
                      fontWeight: '600'
                    }}
                  >
                    “{pillar.quote}”
                  </h3>

                  {/* Description */}
                  <p 
                    style={{
                      fontSize: '0.9rem',
                      color: 'var(--text-secondary)',
                      lineHeight: '1.75',
                      margin: 0
                    }}
                  >
                    {pillar.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* =================================================================
          5. BRAND STATEMENT: LARGE EDITORIAL TYPOGRAPHY
          ================================================================= */}
      <section 
        className="brand-statement-section"
        style={{
          padding: '8rem 1.5rem',
          background: '#060608',
          position: 'relative',
          overflow: 'hidden',
          textAlign: 'center'
        }}
      >
        <div 
          className="brand-statement-watermark"
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            fontSize: 'clamp(8rem, 20vw, 22rem)',
            fontFamily: 'var(--font-serif)',
            fontWeight: '900',
            color: 'rgba(255, 255, 255, 0.015)',
            letterSpacing: '0.15em',
            pointerEvents: 'none',
            whiteSpace: 'nowrap',
            zIndex: 0
          }}
        >
          LUXE NIA
        </div>

        <div className="luxe-container" style={{ position: 'relative', zIndex: 1, maxWidth: '960px', margin: '0 auto' }}>
          <Sparkles size={24} color="var(--gold-400)" style={{ margin: '0 auto 2.25rem' }} />

          <blockquote 
            style={{
              fontSize: 'clamp(1.9rem, 4.5vw, 3.6rem)',
              fontFamily: 'var(--font-serif)',
              lineHeight: '1.35',
              color: '#FFFFFF',
              fontWeight: '400',
              margin: '0 0 2.5rem',
              letterSpacing: '0.02em'
            }}
          >
            “Luxury isn’t just what you wear.<br />
            <span style={{ color: 'var(--gold-300)', fontStyle: 'italic' }}>
              It’s how you carry yourself.
            </span>”
          </blockquote>

          <div style={{ width: '40px', height: '1px', background: 'var(--border-gold)', margin: '0 auto 2.5rem' }} />

          <p 
            style={{
              fontSize: '1rem',
              color: 'var(--text-secondary)',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              fontWeight: '600'
            }}
          >
            THE LUXE NIA CREED • NAIROBI
          </p>
        </div>
      </section>

      {/* =================================================================
          6. SHOP CALL TO ACTION: READY TO CARRY LUXURY?
          ================================================================= */}
      <section 
        className="home-shop-cta"
        style={{
          padding: '7rem 1.5rem',
          background: 'radial-gradient(ellipse at 50% 50%, #15131e 0%, #08080C 75%)',
          borderTop: '1px solid rgba(212, 175, 55, 0.2)',
          textAlign: 'center'
        }}
      >
        <div className="luxe-container" style={{ maxWidth: '800px', margin: '0 auto' }}>
          <span 
            style={{
              fontSize: '0.78rem',
              letterSpacing: '0.25em',
              textTransform: 'uppercase',
              color: 'var(--gold-400)',
              fontWeight: '700',
              display: 'block',
              marginBottom: '1rem'
            }}
          >
            ATELIER CREATIONS
          </span>

          <h2 
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(2.2rem, 5vw, 3.8rem)',
              color: 'var(--text-pure-white)',
              marginBottom: '1.25rem',
              letterSpacing: '0.04em'
            }}
          >
            READY TO CARRY LUXURY?
          </h2>

          <p 
            style={{
              fontSize: 'clamp(1rem, 1.6vw, 1.15rem)',
              color: 'var(--text-secondary)',
              lineHeight: '1.75',
              maxWidth: '580px',
              margin: '0 auto 3rem'
            }}
          >
            Explore our handcrafted Sovereign luxury handbag collection in our online boutique with express same-day courier dispatch across Kenya.
          </p>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link
              to="/shop"
              className="btn-gold"
              style={{
                padding: '1.2rem 3.5rem',
                fontSize: '0.98rem',
                letterSpacing: '0.18em',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '12px',
                boxShadow: '0 10px 35px rgba(212, 175, 55, 0.4)',
                transition: 'all 0.3s ease'
              }}
            >
              <ShoppingBag size={18} />
              <span>SHOP NOW</span>
              <ArrowRight size={18} />
            </Link>

            <a
              href={getWhatsAppInquiryUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-gold-outline"
              style={{
                padding: '1.2rem 2.25rem',
                fontSize: '0.92rem',
                letterSpacing: '0.12em',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px'
              }}
            >
              <WhatsAppIcon size={16} color="var(--gold-400)" />
              <span>CONCIERGE ({OFFICIAL_DISPLAY_PHONE})</span>
            </a>
          </div>
        </div>
      </section>

      {/* Global Interactive Modals Triggered From Home */}
      <MonogramStudioModal
        isOpen={!!monogramProduct}
        defaultProduct={monogramProduct}
        onClose={() => setMonogramProduct(null)}
      />

      <AuthenticityCertificateModal
        isOpen={!!certificateProduct}
        product={certificateProduct}
        onClose={() => setCertificateProduct(null)}
      />
    </div>
  );
}
