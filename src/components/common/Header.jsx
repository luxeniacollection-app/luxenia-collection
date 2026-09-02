import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { 
  ShoppingBag, 
  Search, 
  Menu, 
  X, 
  Sparkles, 
  Phone,
  MessageCircle
} from 'lucide-react';
import Logo from './Logo';
import { InstagramIcon, WhatsAppIcon } from './SocialIcons';
import { useCart } from '../../context/CartContext';
import { 
  getWhatsAppInquiryUrl, 
  OFFICIAL_DISPLAY_PHONE,
  OFFICIAL_INSTAGRAM_URL,
  OFFICIAL_INSTAGRAM_HANDLE
} from '../../utils/whatsapp';

export default function Header({ onOpenSearch }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { totalItemCount, currency, toggleCurrency } = useCart();

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const navItems = [
    { label: 'HOME', path: '/' },
    { label: 'SHOP', path: '/shop' },
    { label: 'CART', path: '/cart' },
    { label: 'ABOUT', path: '/about' },
    { label: 'CONTACT', path: '/contact' }
  ];

  return (
    <>
      {/* Top Announcement Bar */}
      <div className="announcement-bar">
        <div className="luxe-container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles size={13} color="var(--gold-400)" />
            <span>Complimentary Courier Delivery on All Orders Across Kenya • Same-Day Nairobi Dispatch</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            {/* WhatsApp Direct Link */}
            <a
              href={getWhatsAppInquiryUrl()}
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: 'flex', alignItems: 'center', gap: '5px', opacity: 0.9, textDecoration: 'none', color: 'inherit' }}
              title="Chat with LUXE NIA Concierge on WhatsApp"
            >
              <WhatsAppIcon size={12} color="var(--gold-400)" />
              <span style={{ fontSize: '0.74rem' }}>Concierge: {OFFICIAL_DISPLAY_PHONE}</span>
            </a>

            {/* Instagram Link */}
            <a
              href={OFFICIAL_INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: 'flex', alignItems: 'center', gap: '5px', textDecoration: 'none', color: 'var(--gold-300)', fontSize: '0.74rem', opacity: 0.9 }}
              title="Follow LUXE NIA on Instagram"
            >
              <InstagramIcon size={12} color="var(--gold-400)" />
              <span>{OFFICIAL_INSTAGRAM_HANDLE}</span>
            </a>

            {/* Official Currency */}
            <div
              style={{
                background: 'rgba(212, 175, 55, 0.15)',
                border: '1px solid var(--border-gold)',
                color: 'var(--gold-300)',
                padding: '2px 8px',
                borderRadius: 'var(--radius-xs)',
                fontSize: '0.72rem',
                fontWeight: '700',
                letterSpacing: '0.05em'
              }}
              title="Official Store Currency: Kenyan Shillings (KSh / KES)"
            >
              Currency: KSh (KES)
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className={`main-header ${isScrolled ? 'scrolled' : ''}`}>
        <div className="luxe-container">
          <div className="header-inner" style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center' }}>
            {/* Left Nav (Desktop) / Mobile Toggle */}
            <div style={{ display: 'flex', alignItems: 'center' }}>
              {/* Mobile Hamburger Menu Button */}
              <button 
                className="menu-toggle-btn"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label="Toggle navigation menu"
                title="Open Navigation Menu"
              >
                {isMobileMenuOpen ? <X size={18} color="var(--gold-400)" /> : <Menu size={18} color="var(--gold-400)" />}
                <span>Menu</span>
              </button>

              {/* Desktop Nav Links */}
              <nav className="desktop-nav">
                <ul className="nav-links" style={{ display: 'flex', gap: '1.75rem', listStyle: 'none', margin: 0, padding: 0 }}>
                  {navItems.map((item) => (
                    <li key={item.path}>
                      <NavLink
                        to={item.path}
                        className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                        style={{
                          textDecoration: 'none',
                          fontSize: '0.85rem',
                          letterSpacing: '0.12em',
                          fontWeight: '700',
                          fontFamily: 'var(--font-serif)',
                          color: location.pathname === item.path ? 'var(--gold-300)' : 'var(--text-primary)',
                          transition: 'all 0.2s ease',
                          padding: '4px 0',
                          borderBottom: location.pathname === item.path ? '2px solid var(--gold-400)' : '2px solid transparent'
                        }}
                      >
                        {item.label}
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>

            {/* Brand Logo (Center) */}
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <Link to="/" style={{ textDecoration: 'none' }}>
                <Logo size="md" />
              </Link>
            </div>

            {/* Right Action Icons */}
            <div className="header-actions" style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.85rem' }}>
              {/* Instagram Icon Link */}
              <a
                href={OFFICIAL_INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="header-icon-btn"
                title={`Instagram: ${OFFICIAL_INSTAGRAM_HANDLE}`}
                aria-label="LUXE NIA Instagram"
                style={{ textDecoration: 'none' }}
              >
                <InstagramIcon size={18} color="var(--gold-300)" />
              </a>

              {/* WhatsApp Icon Link */}
              <a
                href={getWhatsAppInquiryUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="header-icon-btn"
                title={`Chat on WhatsApp (${OFFICIAL_DISPLAY_PHONE})`}
                aria-label="LUXE NIA WhatsApp"
                style={{ textDecoration: 'none' }}
              >
                <WhatsAppIcon size={18} color="var(--gold-300)" />
              </a>

              {/* Search Modal Trigger */}
              <button 
                className="header-icon-btn" 
                onClick={onOpenSearch}
                title="Search Handbags"
                aria-label="Search"
              >
                <Search size={19} />
              </button>

              {/* Shopping Bag Trigger -> Navigates to /cart */}
              <Link
                to="/cart"
                className="header-icon-btn"
                title="Shopping Bag"
                style={{
                  background: 'rgba(212, 175, 55, 0.12)',
                  border: '1px solid rgba(212, 175, 55, 0.35)',
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textDecoration: 'none'
                }}
              >
                <ShoppingBag size={19} color="var(--gold-300)" />
                {totalItemCount > 0 && <span className="header-badge">{totalItemCount}</span>}
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Luxury Navigation Drawer */}
      {isMobileMenuOpen && (
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.8)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            zIndex: 999,
            display: 'flex',
            justifyContent: 'flex-start'
          }}
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <div 
            style={{
              width: '320px',
              maxWidth: '85vw',
              height: '100%',
              background: 'linear-gradient(175deg, #151420 0%, #09090D 100%)',
              borderRight: '1px solid var(--border-gold)',
              padding: '2rem 1.5rem',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '10px 0 40px rgba(0,0,0,0.85)',
              overflowY: 'auto'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '1.25rem', borderBottom: '1px solid var(--border-subtle)' }}>
              <Logo size="sm" />
              <button 
                onClick={() => setIsMobileMenuOpen(false)} 
                style={{ background: 'none', border: 'none', color: 'var(--gold-400)', cursor: 'pointer', padding: '6px' }}
                aria-label="Close menu"
              >
                <X size={22} />
              </button>
            </div>

            {/* Navigation Links */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1.75rem' }}>
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.95rem 1.25rem',
                      borderRadius: 'var(--radius-xs)',
                      fontFamily: 'var(--font-serif)',
                      fontSize: '0.95rem',
                      fontWeight: '700',
                      letterSpacing: '0.1em',
                      textDecoration: 'none',
                      color: isActive ? 'var(--gold-300)' : 'var(--text-primary)',
                      border: isActive ? '1px solid var(--gold-400)' : '1px solid var(--border-subtle)',
                      background: isActive ? 'rgba(212,175,55,0.12)' : 'rgba(255,255,255,0.03)',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <span>{item.label}</span>
                    {item.path === '/cart' && totalItemCount > 0 && (
                      <span style={{ background: 'var(--gold-500)', color: '#08080A', fontSize: '0.75rem', fontWeight: '800', padding: '2px 8px', borderRadius: '10px' }}>
                        {totalItemCount}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Bottom Drawer Actions */}
            <div style={{ marginTop: 'auto', paddingTop: '1.75rem', borderTop: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {/* WhatsApp Mobile Link */}
              <a
                href={getWhatsAppInquiryUrl()}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  width: '100%',
                  padding: '0.85rem 1rem',
                  background: 'linear-gradient(135deg, #1b3824 0%, #128C7E 100%)',
                  border: '1px solid #25D366',
                  borderRadius: 'var(--radius-xs)',
                  color: '#fff',
                  fontSize: '0.84rem',
                  fontWeight: '700',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  textDecoration: 'none'
                }}
              >
                <WhatsAppIcon size={17} color="#fff" />
                <span>WhatsApp: {OFFICIAL_DISPLAY_PHONE}</span>
              </a>

              {/* Instagram Mobile Link */}
              <a
                href={OFFICIAL_INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  width: '100%',
                  padding: '0.85rem 1rem',
                  background: 'rgba(212, 175, 55, 0.1)',
                  border: '1px solid var(--border-gold)',
                  borderRadius: 'var(--radius-xs)',
                  color: 'var(--gold-300)',
                  fontSize: '0.84rem',
                  fontWeight: '700',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  textDecoration: 'none'
                }}
              >
                <InstagramIcon size={17} color="var(--gold-400)" />
                <span>Instagram {OFFICIAL_INSTAGRAM_HANDLE}</span>
              </a>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                <span>Nairobi Atelier</span>
                <div
                  style={{
                    background: 'rgba(212, 175, 55, 0.15)',
                    border: '1px solid var(--border-gold)',
                    color: 'var(--gold-300)',
                    padding: '2px 8px',
                    borderRadius: 'var(--radius-xs)',
                    fontSize: '0.74rem',
                    fontWeight: '700'
                  }}
                  title="Official Store Currency: Kenyan Shillings (KSh / KES)"
                >
                  Currency: KSh (KES)
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
