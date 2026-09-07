import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, MapPin, Mail, ShieldCheck, ArrowUpRight, Sparkles } from 'lucide-react';
import { InstagramIcon, WhatsAppIcon } from './SocialIcons';
import { 
  OFFICIAL_DISPLAY_PHONE, 
  OFFICIAL_LOCAL_PHONE,
  OFFICIAL_INSTAGRAM_URL, 
  OFFICIAL_INSTAGRAM_HANDLE, 
  OFFICIAL_EMAIL,
  getWhatsAppInquiryUrl 
} from '../../utils/whatsapp';

export default function Footer() {
  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Shop Handbags', path: '/shop' },
    { label: 'Shopping Bag', path: '/cart' },
    { label: 'About Atelier', path: '/about' },
    { label: 'Contact Us', path: '/contact' }
  ];

  return (
    <footer 
      className="main-footer" 
      style={{ 
        background: 'var(--bg-black)', 
        borderTop: '1px solid rgba(212, 175, 55, 0.25)', 
        paddingTop: '5rem', 
        paddingBottom: '3.5rem',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Ambient Gold Glow Behind Footer */}
      <div 
        style={{
          position: 'absolute',
          top: '0',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '600px',
          height: '250px',
          background: 'radial-gradient(ellipse at 50% 0%, rgba(212, 175, 55, 0.08) 0%, transparent 70%)',
          pointerEvents: 'none'
        }}
      />

      <div className="luxe-container" style={{ position: 'relative', zIndex: 1 }}>
        {/* =================================================================
            1. LUXE NIA COLLECTION BRAND SHOWCASE (CENTERED & CLEARLY VISIBLE)
            ================================================================= */}
        <div 
          style={{ 
            textAlign: 'center', 
            maxWidth: '680px', 
            margin: '0 auto 4.5rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}
        >
          {/* Official LUXE NIA COLLECTION Brand Image */}
          <div 
            style={{
              width: '220px',
              maxWidth: '85vw',
              borderRadius: 'var(--radius-sm)',
              overflow: 'hidden',
              border: '1px solid var(--border-gold)',
              boxShadow: '0 12px 35px rgba(0,0,0,0.85), 0 0 25px rgba(212,175,55,0.2)',
              marginBottom: '1.75rem',
              background: '#000',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.03)';
              e.currentTarget.style.boxShadow = '0 16px 45px rgba(0,0,0,0.9), 0 0 35px rgba(212,175,55,0.35)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = '0 12px 35px rgba(0,0,0,0.85), 0 0 25px rgba(212,175,55,0.2)';
            }}
          >
            <img 
              src="/images/luxe-nia-collection.jpg" 
              alt="LUXE NIA COLLECTION" 
              style={{
                width: '100%',
                height: 'auto',
                display: 'block',
                objectFit: 'contain'
              }}
            />
          </div>

          {/* Brand Heading */}
          <h3 
            style={{ 
              fontFamily: 'var(--font-serif)', 
              fontSize: 'clamp(1.5rem, 3.5vw, 2.1rem)', 
              color: 'var(--text-pure-white)', 
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              margin: '0 0 0.5rem',
              fontWeight: '700'
            }}
          >
            LUXE NIA COLLECTION
          </h3>

          <p 
            style={{ 
              fontFamily: 'var(--font-serif)', 
              fontStyle: 'italic', 
              color: 'var(--gold-300)', 
              fontSize: '1.05rem', 
              margin: '0 0 1.5rem' 
            }}
          >
            “Elegance You Carry.”
          </p>

          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.7', maxWidth: '520px', margin: '0 0 2rem' }}>
            Contemporary African luxury and bespoke leather craftsmanship. Handcrafted with reverence from full-grain calf leather in Nairobi, Kenya.
          </p>

          {/* Prominent Clickable Action Badges */}
          <div 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              flexWrap: 'wrap', 
              gap: '1rem',
              width: '100%'
            }}
          >
            {/* Clickable WhatsApp Button */}
            <a 
              href={getWhatsAppInquiryUrl()} 
              target="_blank" 
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                color: '#fff',
                fontSize: '0.9rem',
                fontWeight: '700',
                textDecoration: 'none',
                background: 'linear-gradient(135deg, #1b3824 0%, #128C7E 50%, #25D366 100%)',
                padding: '0.85rem 1.75rem',
                borderRadius: 'var(--radius-xs)',
                border: '1px solid #25D366',
                boxShadow: '0 6px 20px rgba(37, 211, 102, 0.35)',
                transition: 'all 0.25s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 10px 28px rgba(37, 211, 102, 0.5)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(37, 211, 102, 0.35)';
              }}
              aria-label="Order & Chat on WhatsApp"
            >
              <WhatsAppIcon size={18} color="#fff" />
              <span>WhatsApp: {OFFICIAL_LOCAL_PHONE}</span>
              <ArrowUpRight size={15} />
            </a>

            {/* Clickable Instagram Link */}
            <a 
              href={OFFICIAL_INSTAGRAM_URL} 
              target="_blank" 
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                color: 'var(--gold-300)',
                fontSize: '0.9rem',
                fontWeight: '700',
                textDecoration: 'none',
                background: 'rgba(212, 175, 55, 0.1)',
                padding: '0.85rem 1.75rem',
                borderRadius: 'var(--radius-xs)',
                border: '1px solid var(--border-gold)',
                boxShadow: '0 6px 20px rgba(212, 175, 55, 0.15)',
                transition: 'all 0.25s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(212, 175, 55, 0.2)';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 10px 28px rgba(212, 175, 55, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(212, 175, 55, 0.1)';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(212, 175, 55, 0.15)';
              }}
              aria-label="Follow on Instagram"
            >
              <InstagramIcon size={18} color="var(--gold-400)" />
              <span>Instagram: {OFFICIAL_INSTAGRAM_HANDLE}</span>
              <ArrowUpRight size={15} />
            </a>
          </div>
        </div>

        {/* =================================================================
            2. FOOTER NAVIGATION & ATELIER INFO
            ================================================================= */}
        <div 
          style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', 
            gap: '2.5rem', 
            marginBottom: '3.5rem',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            paddingTop: '3.5rem'
          }}
        >
          {/* Quick Navigation */}
          <div>
            <h4 
              style={{ 
                fontFamily: 'var(--font-serif)', 
                fontSize: '0.95rem', 
                color: 'var(--gold-300)', 
                marginBottom: '1.25rem', 
                letterSpacing: '0.12em', 
                textTransform: 'uppercase' 
              }}
            >
              Collections & Pages
            </h4>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', listStyle: 'none', padding: 0, margin: 0 }}>
              {navLinks.map((link) => (
                <li key={link.path}>
                  <Link 
                    to={link.path} 
                    style={{ 
                      color: 'var(--text-secondary)', 
                      fontSize: '0.88rem', 
                      textDecoration: 'none', 
                      transition: 'color 0.2s ease' 
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--gold-300)')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Location & Delivery */}
          <div>
            <h4 
              style={{ 
                fontFamily: 'var(--font-serif)', 
                fontSize: '0.95rem', 
                color: 'var(--gold-300)', 
                marginBottom: '1.25rem', 
                letterSpacing: '0.12em', 
                textTransform: 'uppercase' 
              }}
            >
              Location & Delivery
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.86rem', color: 'var(--text-secondary)' }}>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                <MapPin size={16} color="var(--gold-400)" style={{ flexShrink: 0, marginTop: '3px' }} />
                <span>Web-based online Nairobi and delivery is done country wide</span>
              </div>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <Phone size={16} color="var(--gold-400)" style={{ flexShrink: 0 }} />
                <a 
                  href={`tel:${OFFICIAL_LOCAL_PHONE}`}
                  style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}
                >
                  Direct: {OFFICIAL_DISPLAY_PHONE} ({OFFICIAL_LOCAL_PHONE})
                </a>
              </div>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <Mail size={16} color="var(--gold-400)" style={{ flexShrink: 0 }} />
                <a 
                  href={`mailto:${OFFICIAL_EMAIL}`}
                  style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}
                >
                  {OFFICIAL_EMAIL}
                </a>
              </div>
            </div>
          </div>

          {/* Kenya Courier & Concierge Care */}
          <div>
            <h4 
              style={{ 
                fontFamily: 'var(--font-serif)', 
                fontSize: '0.95rem', 
                color: 'var(--gold-300)', 
                marginBottom: '1.25rem', 
                letterSpacing: '0.12em', 
                textTransform: 'uppercase' 
              }}
            >
              Concierge Service
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.86rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
              <p style={{ margin: 0 }}>
                • <strong>Same-Day Dispatch:</strong> Nairobi orders placed before 2:00 PM.
              </p>
              <p style={{ margin: 0 }}>
                • <strong>Countrywide Courier:</strong> 24–48 hours secure hand-delivery across Kenya.
              </p>
              <p style={{ margin: 0 }}>
                • <strong>Certificate of Authenticity:</strong> Included with each luxury piece.
              </p>
            </div>
          </div>
        </div>

        {/* =================================================================
            3. FOOTER COPYRIGHT & AUTHENTICITY BAR
            ================================================================= */}
        <div 
          style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            flexWrap: 'wrap', 
            gap: '1rem', 
            borderTop: '1px solid rgba(255, 255, 255, 0.08)', 
            paddingTop: '2rem', 
            fontSize: '0.82rem', 
            color: 'var(--text-muted)' 
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <span>© {new Date().getFullYear()} LUXE NIA COLLECTION. All Rights Reserved.</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--gold-400)' }}>
            <ShieldCheck size={16} />
            <span>100% Genuine Full-Grain Calf Leather • Nairobi Atelier</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
