import React from 'react';
import { X, ShieldCheck, Award, Crown, Check, Sparkles, ExternalLink } from 'lucide-react';
import Logo from './Logo';
import { WhatsAppIcon } from './SocialIcons';
import { getWhatsAppInquiryUrl, OFFICIAL_DISPLAY_PHONE } from '../../utils/whatsapp';

export default function AuthenticityCertificateModal({ isOpen, onClose, product }) {
  if (!isOpen) return null;

  const bag = product || {
    name: 'The Sovereign Baguette Flap Bag',
    sku: 'LN-HB-001',
    material: 'Supple Full-Grain Calf Leather',
    priceKes: 5800
  };

  const serialNumber = `LN-${bag.sku || 'HB-001'}-${new Date().getFullYear()}-NAI`;

  return (
    <div 
      className="modal-backdrop open certificate-modal-backdrop"
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(4, 3, 7, 0.88)',
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
        className="certificate-modal-card"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '640px',
          background: 'linear-gradient(165deg, #181524 0%, #0d0c14 70%, #07060A 100%)',
          border: '2px solid rgba(212, 175, 55, 0.65)',
          borderRadius: 'var(--radius-sm)',
          boxShadow: '0 25px 80px rgba(0,0,0,0.9), 0 0 50px rgba(212, 175, 55, 0.2)',
          position: 'relative',
          padding: 'clamp(2rem, 5vw, 3rem)',
          textAlign: 'center',
          color: '#FFFFFF'
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close Certificate Modal"
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: 'rgba(255, 255, 255, 0.08)',
            border: '1px solid rgba(212, 175, 55, 0.3)',
            borderRadius: '50%',
            width: '34px',
            height: '34px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--gold-300)',
            cursor: 'pointer'
          }}
        >
          <X size={18} />
        </button>

        {/* Certificate Ornamental Inner Border */}
        <div 
          style={{
            border: '1px dashed rgba(212, 175, 55, 0.35)',
            padding: '2rem 1.5rem',
            borderRadius: 'var(--radius-xs)',
            position: 'relative'
          }}
        >
          {/* Logo & Seal */}
          <div style={{ marginBottom: '1.5rem' }}>
            <Logo size="sm" />
            <div 
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                marginTop: '1rem',
                color: 'var(--gold-400)',
                fontSize: '0.72rem',
                letterSpacing: '0.24em',
                textTransform: 'uppercase',
                fontWeight: '700'
              }}
            >
              <Crown size={14} />
              <span>CERTIFICATE OF AUTHENTICITY</span>
            </div>
          </div>

          {/* Certificate Title */}
          <h2 
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(1.4rem, 3vw, 1.9rem)',
              color: 'var(--text-pure-white)',
              lineHeight: 1.25,
              marginBottom: '0.5rem'
            }}
          >
            Official Certificate of Quality & Authenticity
          </h2>

          <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', maxWidth: '440px', margin: '0 auto 1.75rem', lineHeight: '1.6' }}>
            This document certifies that this handcrafted leather piece was made and inspected to the genuine luxury standards of Luxe Nia in Nairobi.
          </p>

          {/* Verification Spec Grid */}
          <div 
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '10px',
              textAlign: 'left',
              background: 'rgba(0, 0, 0, 0.35)',
              padding: '1.25rem',
              borderRadius: 'var(--radius-xs)',
              border: '1px solid rgba(212, 175, 55, 0.2)',
              marginBottom: '1.75rem'
            }}
          >
            <div>
              <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Model Name</span>
              <p style={{ margin: 0, fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-pure-white)' }}>{bag.name}</p>
            </div>
            <div>
              <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Serial Number</span>
              <p style={{ margin: 0, fontSize: '0.85rem', fontWeight: '700', color: 'var(--gold-300)', fontFamily: 'monospace' }}>{serialNumber}</p>
            </div>
            <div>
              <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Leather Grade</span>
              <p style={{ margin: 0, fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-pure-white)' }}>Full-Grain Calfskin</p>
            </div>
            <div>
              <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Crafted In</span>
              <p style={{ margin: 0, fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-pure-white)' }}>Nairobi, Kenya</p>
            </div>
          </div>

          {/* Artisan Stamp Badge */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1.5rem', marginBottom: '1.5rem' }}>
            <div 
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                border: '2px double var(--gold-400)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--gold-300)',
                fontSize: '0.52rem',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                fontWeight: '800',
                padding: '4px'
              }}
            >
              <Award size={18} color="var(--gold-400)" />
              <span>SEAL OF LUXE NIA</span>
            </div>

            <div style={{ textAlign: 'left' }}>
              <div style={{ fontFamily: 'var(--font-editorial)', fontStyle: 'italic', fontSize: '1.25rem', color: 'var(--gold-300)' }}>
                Luxe Nia Collections
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                Genuine Leather • Nairobi, Kenya
              </div>
            </div>
          </div>

          {/* Concierge Action */}
          <a
            href={getWhatsAppInquiryUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-gold"
            style={{
              width: '100%',
              padding: '0.85rem',
              fontSize: '0.82rem',
              letterSpacing: '0.1em',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            <WhatsAppIcon size={16} color="#000" />
            <span>VERIFY WITH CONCIERGE ({OFFICIAL_DISPLAY_PHONE})</span>
          </a>
        </div>
      </div>
    </div>
  );
}
