import React, { useState } from 'react';
import { X, Sparkles, Crown, Check, ArrowRight, ShieldCheck } from 'lucide-react';
import { WhatsAppIcon } from './SocialIcons';
import { useCart } from '../../context/CartContext';
import { useToast } from './Toast';
import { getWhatsAppInquiryUrl, OFFICIAL_DISPLAY_PHONE } from '../../utils/whatsapp';

export default function MonogramStudioModal({ isOpen, onClose, defaultProduct = null }) {
  const { addToCart, formatPrice } = useCart();
  const { addToast } = useToast();

  const bagModels = [
    {
      id: 'prod-001',
      name: 'The Sovereign Baguette Flap Bag',
      color: 'Noir Black',
      priceKes: 5800,
      priceUsd: 45,
      image: '/images/products/luxe-baguette-noir-black.jpg',
      leatherBg: '#0b0b0e',
      flapPosition: { top: '68%', left: '50%' }
    },
    {
      id: 'prod-002',
      name: 'The Sovereign Baguette Flap Bag',
      color: 'Sahara Mocha',
      priceKes: 5800,
      priceUsd: 45,
      image: '/images/products/luxe-baguette-sahara-brown.jpg',
      leatherBg: '#3d2012',
      flapPosition: { top: '68%', left: '50%' }
    },
    {
      id: 'prod-003',
      name: 'The Sovereign Baguette Flap Bag',
      color: 'Ivory Pearl',
      priceKes: 5800,
      priceUsd: 45,
      image: '/images/products/luxe-baguette-ivory-cream.jpg',
      leatherBg: '#e6ded3',
      flapPosition: { top: '68%', left: '50%' }
    },
    {
      id: 'prod-004',
      name: 'The Sovereign Grand Satchel',
      color: 'Espresso Mahogany',
      priceKes: 6500,
      priceUsd: 50,
      image: '/images/products/luxe-satchel-espresso-mahogany.jpg',
      leatherBg: '#22140d',
      flapPosition: { top: '74%', left: '50%' }
    }
  ];

  // Default selection
  const initialIndex = defaultProduct
    ? Math.max(0, bagModels.findIndex(b => b.id === defaultProduct.id || b.name.includes(defaultProduct.name)))
    : 0;

  const [selectedBagIndex, setSelectedBagIndex] = useState(initialIndex >= 0 ? initialIndex : 0);
  const [initials, setInitials] = useState('L.N');
  const [foilFinish, setFoilFinish] = useState('gold'); // 'gold' | 'rose' | 'deboss'
  const [fontFamily, setFontFamily] = useState('serif'); // 'serif' | 'sans'

  if (!isOpen) return null;

  const activeBag = bagModels[selectedBagIndex];

  const foilStyles = {
    gold: {
      name: '24K Gold Foil',
      color: '#D4AF37',
      gradient: 'linear-gradient(135deg, #FFF1C5 0%, #D4AF37 40%, #996D18 100%)',
      shadow: '0 0 12px rgba(212, 175, 55, 0.65), 0 2px 4px rgba(0,0,0,0.8)',
      swatch: '#D4AF37'
    },
    rose: {
      name: 'Champagne Bronze',
      color: '#E8A598',
      gradient: 'linear-gradient(135deg, #FFE8E2 0%, #E8A598 45%, #9E5345 100%)',
      shadow: '0 0 12px rgba(232, 165, 152, 0.65), 0 2px 4px rgba(0,0,0,0.8)',
      swatch: '#E8A598'
    },
    deboss: {
      name: 'Artisan Blind Deboss',
      color: activeBag.color === 'Ivory Pearl' ? 'rgba(40,40,40,0.45)' : 'rgba(0,0,0,0.85)',
      gradient: activeBag.color === 'Ivory Pearl' 
        ? 'linear-gradient(180deg, rgba(0,0,0,0.3) 0%, rgba(255,255,255,0.4) 100%)' 
        : 'linear-gradient(180deg, rgba(0,0,0,0.9) 0%, rgba(255,255,255,0.15) 100%)',
      shadow: 'inset 0 2px 4px rgba(0,0,0,0.7), 0 1px 1px rgba(255,255,255,0.2)',
      swatch: '#4A3B32'
    }
  };

  const activeFoil = foilStyles[foilFinish];

  const handleInitialsChange = (e) => {
    let val = e.target.value.toUpperCase().replace(/[^A-Z.]/g, '');
    if (val.length > 4) val = val.slice(0, 4);
    setInitials(val);
  };

  const handleWhatsAppCustomOrder = () => {
    const text = encodeURIComponent(
      `Hello LUXE NIA, I want to buy a handbag with custom initials:\n\n` +
      `• Bag: ${activeBag.name}\n` +
      `• Color: ${activeBag.color}\n` +
      `• Custom Initials: "${initials || 'None'}"\n` +
      `• Gold Finish: ${activeFoil.name}\n` +
      `• Font Style: ${fontFamily === 'serif' ? 'Classic Serif' : 'Clean Sans'}\n` +
      `• Price: KSh ${activeBag.priceKes.toLocaleString()} (Free Custom Initials)\n\n` +
      `Please confirm availability and arrange my same-day delivery.`
    );
    window.open(`https://wa.me/254795439545?text=${text}`, '_blank', 'noopener,noreferrer');
  };

  const handleAddCustomToBag = () => {
    const customProduct = {
      ...activeBag,
      subtitle: `Custom Initials: "${initials}" • ${activeFoil.name}`,
      monogram: {
        initials,
        foil: activeFoil.name,
        font: fontFamily
      }
    };
    addToCart(customProduct, 'Classic Silhouette', { name: activeBag.color }, 1);
    addToast(`Added personalized "${activeBag.name}" to your bag!`, 'gold');
    onClose();
  };

  return (
    <div 
      className="modal-backdrop open monogram-modal-backdrop" 
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(5, 4, 8, 0.88)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.25rem',
        opacity: 1,
        visibility: 'visible',
        pointerEvents: 'auto'
      }}
    >
      <div 
        className="monogram-modal-card"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '920px',
          maxHeight: '92vh',
          background: 'linear-gradient(165deg, #161422 0%, #0c0b12 60%, #060509 100%)',
          border: '1px solid rgba(212, 175, 55, 0.45)',
          borderRadius: 'var(--radius-sm)',
          boxShadow: '0 25px 80px rgba(0,0,0,0.9), 0 0 50px rgba(212, 175, 55, 0.15)',
          overflowY: 'auto',
          position: 'relative',
          color: '#FFFFFF'
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close Monogram Studio"
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: 'rgba(255, 255, 255, 0.08)',
            border: '1px solid rgba(212, 175, 55, 0.3)',
            borderRadius: '50%',
            width: '36px',
            height: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--gold-300)',
            cursor: 'pointer',
            zIndex: 10,
            transition: 'all 0.2s ease'
          }}
        >
          <X size={18} />
        </button>

        {/* Modal Header */}
        <div style={{ padding: '2rem 2.5rem 1.25rem', borderBottom: '1px solid rgba(212,175,55,0.15)' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '0.4rem' }}>
            <Crown size={15} color="var(--gold-400)" />
            <span style={{ fontSize: '0.74rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--gold-300)', fontWeight: '700' }}>
              CUSTOM GOLD INITIALS
            </span>
          </div>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(1.5rem, 3.5vw, 2.2rem)', margin: 0 }}>
            Personalized Initials Studio
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '0.4rem 0 0' }}>
            Add your personal initials in shining gold foil onto genuine full-grain leather. Free with every handbag.
          </p>
        </div>

        {/* Studio Content: 2-Column Split */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem', padding: '2rem 2.5rem' }}>
          {/* Left Column: Live Visual Monogram Preview */}
          <div>
            <div 
              style={{
                position: 'relative',
                borderRadius: 'var(--radius-xs)',
                overflow: 'hidden',
                aspectRatio: '4/4.8',
                border: '1px solid var(--border-gold)',
                background: '#0a0910',
                boxShadow: 'inset 0 0 50px rgba(0,0,0,0.8), 0 15px 40px rgba(0,0,0,0.6)'
              }}
            >
              <img 
                src={activeBag.image} 
                alt={activeBag.name}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
              />

              {/* Simulated Hot-Stamping Monogram Badge over the Leather */}
              <div
                style={{
                  position: 'absolute',
                  top: activeBag.flapPosition.top,
                  left: activeBag.flapPosition.left,
                  transform: 'translate(-50%, -50%)',
                  padding: '6px 18px',
                  borderRadius: '3px',
                  background: 'rgba(0, 0, 0, 0.25)',
                  backdropFilter: 'blur(2px)',
                  border: '1px solid rgba(212, 175, 55, 0.2)',
                  textAlign: 'center',
                  pointerEvents: 'none',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.5)'
                }}
              >
                <div
                  style={{
                    fontFamily: fontFamily === 'serif' ? 'var(--font-serif)' : 'var(--font-sans)',
                    fontSize: 'clamp(1.1rem, 2.2vw, 1.45rem)',
                    fontWeight: '800',
                    letterSpacing: '0.28em',
                    lineHeight: 1.1,
                    textTransform: 'uppercase',
                    color: activeFoil.color,
                    background: activeFoil.gradient,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    filter: `drop-shadow(${activeFoil.shadow})`,
                    display: 'inline-block'
                  }}
                >
                  {initials || '—'}
                </div>
                <div style={{ fontSize: '0.52rem', letterSpacing: '0.24em', textTransform: 'uppercase', color: 'rgba(212,175,55,0.7)', marginTop: '2px' }}>
                  LUXE NIA ATELIER
                </div>
              </div>

              {/* Live Badge Indicator */}
              <div 
                style={{
                  position: 'absolute',
                  bottom: '12px',
                  left: '12px',
                  background: 'rgba(10, 9, 16, 0.85)',
                  border: '1px solid var(--border-gold)',
                  padding: '4px 10px',
                  borderRadius: 'var(--radius-xs)',
                  fontSize: '0.72rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  color: 'var(--gold-300)'
                }}
              >
                <Sparkles size={12} />
                <span>Live Atelier Rendering</span>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
              <div>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Model & Tone</span>
                <p style={{ margin: 0, fontWeight: '700', fontSize: '0.92rem', color: 'var(--text-pure-white)' }}>
                  {activeBag.name} — <span style={{ color: 'var(--gold-300)' }}>{activeBag.color}</span>
                </p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Price</span>
                <p style={{ margin: 0, fontWeight: '800', fontSize: '1.05rem', color: 'var(--gold-300)', fontFamily: 'var(--font-serif)' }}>
                  KSh {activeBag.priceKes.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Customizer Controls */}
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {/* 1. Select Silhouette & Colorway */}
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--gold-400)', marginBottom: '0.6rem' }}>
                  1. Choose Silhouette & Leather
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
                  {bagModels.map((bag, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedBagIndex(idx)}
                      style={{
                        padding: '0.65rem 0.85rem',
                        background: selectedBagIndex === idx ? 'rgba(212, 175, 55, 0.16)' : 'rgba(255, 255, 255, 0.04)',
                        border: selectedBagIndex === idx ? '1px solid var(--gold-400)' : '1px solid var(--border-subtle)',
                        borderRadius: 'var(--radius-xs)',
                        textAlign: 'left',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        color: selectedBagIndex === idx ? 'var(--gold-300)' : 'var(--text-primary)'
                      }}
                    >
                      <div style={{ fontSize: '0.78rem', fontWeight: '700' }}>{bag.color}</div>
                      <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>KSh {bag.priceKes.toLocaleString()}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. Enter Monogram Initials */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
                  <label style={{ fontSize: '0.75rem', fontWeight: '700', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--gold-400)' }}>
                    2. Your Initials (Max 4 Characters)
                  </label>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>e.g. L.N or A.K.W</span>
                </div>
                <input
                  type="text"
                  value={initials}
                  onChange={handleInitialsChange}
                  placeholder="E.G. L.N"
                  maxLength={4}
                  style={{
                    width: '100%',
                    padding: '0.85rem 1.25rem',
                    background: 'rgba(0, 0, 0, 0.5)',
                    border: '1px solid var(--border-gold)',
                    borderRadius: 'var(--radius-xs)',
                    color: 'var(--gold-300)',
                    fontFamily: fontFamily === 'serif' ? 'var(--font-serif)' : 'var(--font-sans)',
                    fontSize: '1.25rem',
                    letterSpacing: '0.2em',
                    textTransform: 'uppercase',
                    fontWeight: '700',
                    outline: 'none',
                    textAlign: 'center'
                  }}
                />
              </div>

              {/* 3. Choose Hot-Foil Stamping Finish */}
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--gold-400)', marginBottom: '0.6rem' }}>
                  3. Select Foil Stamping Finish
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                  {Object.entries(foilStyles).map(([key, styleObj]) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setFoilFinish(key)}
                      style={{
                        padding: '0.75rem 0.5rem',
                        background: foilFinish === key ? 'rgba(212, 175, 55, 0.16)' : 'rgba(255, 255, 255, 0.04)',
                        border: foilFinish === key ? '1px solid var(--gold-400)' : '1px solid var(--border-subtle)',
                        borderRadius: 'var(--radius-xs)',
                        textAlign: 'center',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      <span 
                        style={{
                          width: '18px',
                          height: '18px',
                          borderRadius: '50%',
                          background: styleObj.swatch,
                          border: '1px solid rgba(255,255,255,0.4)',
                          boxShadow: foilFinish === key ? '0 0 10px rgba(212,175,55,0.5)' : 'none'
                        }}
                      />
                      <span style={{ fontSize: '0.72rem', fontWeight: '600', color: foilFinish === key ? 'var(--gold-300)' : 'var(--text-secondary)' }}>
                        {styleObj.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 4. Font Family Typography */}
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--gold-400)', marginBottom: '0.6rem' }}>
                  4. Font Typography Style
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  <button
                    type="button"
                    onClick={() => setFontFamily('serif')}
                    style={{
                      padding: '0.7rem',
                      background: fontFamily === 'serif' ? 'rgba(212, 175, 55, 0.16)' : 'rgba(255, 255, 255, 0.04)',
                      border: fontFamily === 'serif' ? '1px solid var(--gold-400)' : '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-xs)',
                      color: fontFamily === 'serif' ? 'var(--gold-300)' : 'var(--text-secondary)',
                      fontFamily: 'var(--font-serif)',
                      fontSize: '0.82rem',
                      fontWeight: '700',
                      cursor: 'pointer'
                    }}
                  >
                    Imperial Roman Serif
                  </button>
                  <button
                    type="button"
                    onClick={() => setFontFamily('sans')}
                    style={{
                      padding: '0.7rem',
                      background: fontFamily === 'sans' ? 'rgba(212, 175, 55, 0.16)' : 'rgba(255, 255, 255, 0.04)',
                      border: fontFamily === 'sans' ? '1px solid var(--gold-400)' : '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-xs)',
                      color: fontFamily === 'sans' ? 'var(--gold-300)' : 'var(--text-secondary)',
                      fontFamily: 'var(--font-sans)',
                      fontSize: '0.82rem',
                      fontWeight: '700',
                      cursor: 'pointer'
                    }}
                  >
                    Atelier Modernist
                  </button>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {/* Direct WhatsApp Concierge Order Button */}
              <button
                type="button"
                onClick={handleWhatsAppCustomOrder}
                style={{
                  width: '100%',
                  padding: '1rem',
                  fontSize: '0.88rem',
                  fontWeight: '800',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  background: 'linear-gradient(135deg, #1b3824 0%, #128C7E 50%, #25D366 100%)',
                  border: '1px solid #25D366',
                  color: '#FFFFFF',
                  borderRadius: 'var(--radius-xs)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  cursor: 'pointer',
                  boxShadow: '0 8px 25px rgba(37,211,102,0.3)',
                  transition: 'all 0.25s ease'
                }}
              >
                <WhatsAppIcon size={18} color="#FFF" />
                <span>BUY WITH MY INITIALS ON WHATSAPP</span>
              </button>

              {/* Add to Storefront Bag */}
              <button
                type="button"
                onClick={handleAddCustomToBag}
                className="btn-gold-outline"
                style={{
                  width: '100%',
                  padding: '0.85rem',
                  fontSize: '0.85rem',
                  fontWeight: '700',
                  letterSpacing: '0.1em',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  cursor: 'pointer'
                }}
              >
                <span>ADD TO SHOPPING BAG (KSh {activeBag.priceKes.toLocaleString()})</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
