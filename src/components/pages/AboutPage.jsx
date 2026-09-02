import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, 
  Crown, 
  ShieldCheck, 
  Truck, 
  ArrowRight,
  ShoppingBag,
  Award
} from 'lucide-react';
import Logo from '../common/Logo';

export default function AboutPage() {
  return (
    <div className="about-page">
      {/* Editorial Hero Header */}
      <section 
        style={{
          padding: '6rem 0 4.5rem',
          background: 'radial-gradient(ellipse at 50% 20%, #1c1a26 0%, #0c0c10 70%, #070709 100%)',
          borderBottom: '1px solid var(--border-gold)',
          textAlign: 'center'
        }}
      >
        <div className="luxe-container-narrow">
          <Logo size="lg" />
          
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginTop: '1.75rem', marginBottom: '1rem' }}>
            <Sparkles size={16} color="var(--gold-400)" />
            <span style={{ fontSize: '0.76rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--gold-400)', fontWeight: '700' }}>
              The Maison Philosophy
            </span>
          </div>

          <h1 style={{ fontSize: 'clamp(2.2rem, 4.5vw, 3.8rem)', fontFamily: 'var(--font-serif)', lineHeight: '1.2', marginBottom: '1.5rem' }}>
            Elevating Modern <br />
            <span className="text-gold-gradient">African Luxury</span>
          </h1>

          <p 
            style={{ 
              fontSize: '1.15rem', 
              fontFamily: 'var(--font-editorial)', 
              color: 'var(--text-secondary)', 
              lineHeight: '1.8',
              maxWidth: '750px',
              margin: '0 auto'
            }}
          >
            LUXE NIA was conceived with a clear mission: to craft world-class luxury leather handbags defined by structural refinement, rich full-grain calfskin, and bespoke African sophistication.
          </p>
        </div>
      </section>

      {/* Brand Values & Craftsmanship */}
      <section className="luxe-section" style={{ background: '#08080C' }}>
        <div className="luxe-container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center', marginBottom: '5rem' }}>
            <div>
              <span style={{ fontSize: '0.74rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--gold-400)', fontWeight: '700' }}>
                Artisanal Dedication
              </span>
              <h2 style={{ fontSize: '2.4rem', fontFamily: 'var(--font-serif)', margin: '0.5rem 0 1.5rem', color: 'var(--text-pure-white)' }}>
                Precision Craftsmanship & Timeless Silhouettes
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.8', marginBottom: '1.25rem' }}>
                Every LUXE NIA creation is guided by a devotion to enduring quality. Our signature piece, <strong>The Sovereign Baguette</strong>, embodies architectural balance with its sleek east-west lines, hand-burnished edge dressings, and polished antique gold-tone latch closures.
              </p>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.8' }}>
                Designed for discerning tastemakers across Nairobi and beyond, our pieces transition seamlessly from executive daytime elegance to evening glamour.
              </p>
            </div>

            <div 
              style={{
                background: 'linear-gradient(135deg, #181822 0%, #0E0E14 100%)',
                border: '1px solid var(--border-gold)',
                borderRadius: 'var(--radius-sm)',
                padding: '2.75rem 2.25rem',
                boxShadow: 'var(--shadow-gold)'
              }}
            >
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.35rem', color: 'var(--gold-300)', marginBottom: '1.75rem' }}>
                The LUXE NIA Standard
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <Crown size={22} color="var(--gold-400)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <h4 style={{ fontSize: '0.95rem', color: 'var(--text-pure-white)' }}>Premium Full-Grain Calfskin</h4>
                    <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Supple, durable leather selected for its refined texture and longevity.</p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <Award size={22} color="var(--gold-400)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <h4 style={{ fontSize: '0.95rem', color: 'var(--text-pure-white)' }}>Polished Gold-Tone Hardware</h4>
                    <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Precision-engineered clasps and fixtures with high-luster antique finish.</p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <Truck size={22} color="var(--gold-400)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <h4 style={{ fontSize: '0.95rem', color: 'var(--text-pure-white)' }}>Same-Day Nairobi Delivery</h4>
                    <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Dedicated courier dispatch directly to your doorstep across Kenya.</p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <ShieldCheck size={22} color="var(--gold-400)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <h4 style={{ fontSize: '0.95rem', color: 'var(--text-pure-white)' }}>Direct WhatsApp Concierge</h4>
                    <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Discuss your desired pieces, payment preferences, and same-day delivery directly with our atelier on WhatsApp.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Banner */}
          <div 
            style={{
              background: 'radial-gradient(ellipse at 50% 50%, #1a1624 0%, #0c0c10 100%)',
              border: '1px solid var(--border-gold)',
              borderRadius: 'var(--radius-sm)',
              padding: '3.5rem 2rem',
              textAlign: 'center',
              boxShadow: 'var(--shadow-gold)'
            }}
          >
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', color: 'var(--text-pure-white)', marginBottom: '0.75rem' }}>
              Experience The Sovereign Baguette
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', maxWidth: '500px', margin: '0 auto 2rem' }}>
              Available in Noir Black, Sahara Mocha, and Ivory Pearl. Handcrafted for the modern connoisseur.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/shop" className="btn-gold" style={{ textDecoration: 'none' }}>
                <ShoppingBag size={17} /> Explore Collection (KSh 5,800)
              </Link>
              <Link to="/contact" className="btn-gold-outline" style={{ textDecoration: 'none' }}>
                Contact Concierge
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
