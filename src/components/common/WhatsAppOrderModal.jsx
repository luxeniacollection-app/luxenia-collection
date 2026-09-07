import React, { useState, useEffect, useRef } from 'react';
import { X, Sparkles } from 'lucide-react';
import { WhatsAppIcon } from './SocialIcons';
import { 
  getWhatsAppOrderUrl, 
  getWhatsAppCartOrderUrl,
  OFFICIAL_DISPLAY_PHONE 
} from '../../utils/whatsapp';

export default function WhatsAppOrderModal({ isOpen, onClose, orderData }) {
  const [customerName, setCustomerName] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const inputRef = useRef(null);

  // Pre-load remembered name from localStorage if available
  useEffect(() => {
    if (isOpen) {
      setErrorMsg('');
      try {
        const savedName = localStorage.getItem('luxenia_customer_name') || '';
        setCustomerName(savedName);
      } catch (e) {}

      // Auto-focus name field on open
      setTimeout(() => {
        if (inputRef.current) inputRef.current.focus();
      }, 100);
    }
  }, [isOpen]);

  if (!isOpen || !orderData) return null;

  const isCartOrder = Array.isArray(orderData.items) && orderData.items.length > 0;

  // Values for single bag order
  const bagName = orderData.bagName || orderData.name || 'Signature Luxury Bag';
  const quantity = Number(orderData.quantity) || 1;
  const bagPrice = Number(orderData.bagPrice || orderData.priceKes) || 5800;
  const totalPrice = orderData.totalPrice !== undefined && orderData.totalPrice !== null
    ? Number(orderData.totalPrice)
    : bagPrice * quantity;
  const bagImage = orderData.image || (orderData.gallery && orderData.gallery[0]);

  const handleContinue = (e) => {
    if (e) e.preventDefault();
    const cleanName = customerName.trim();

    if (!cleanName) {
      setErrorMsg('Please enter your name to proceed.');
      if (inputRef.current) inputRef.current.focus();
      return;
    }

    // Save for convenience
    try {
      localStorage.setItem('luxenia_customer_name', cleanName);
    } catch (e) {}

    let whatsappUrl = '';
    if (isCartOrder) {
      whatsappUrl = getWhatsAppCartOrderUrl(orderData.items, totalPrice, cleanName);
    } else {
      whatsappUrl = getWhatsAppOrderUrl({
        customerName: cleanName,
        bagName,
        quantity,
        bagPrice,
        totalPrice
      });
    }

    // Open WhatsApp directly
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    onClose();
  };

  return (
    <div 
      className="modal-backdrop open" 
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.85)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem'
      }}
    >
      <div 
        className="luxe-modal" 
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '460px',
          background: 'linear-gradient(165deg, #161424 0%, #0c0c12 100%)',
          border: '1px solid var(--border-gold)',
          borderRadius: 'var(--radius-sm)',
          padding: '2rem 1.75rem',
          boxShadow: '0 25px 60px rgba(0,0,0,0.85), 0 0 35px rgba(212,175,55,0.18)',
          position: 'relative',
          color: '#fff'
        }}
      >
        {/* Close Button */}
        <button 
          className="modal-close-btn" 
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: 'none',
            border: 'none',
            color: 'var(--gold-400)',
            cursor: 'pointer',
            padding: '4px'
          }}
          aria-label="Close"
        >
          <X size={20} />
        </button>

        {/* Modal Header */}
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div 
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: 'rgba(37, 211, 102, 0.12)',
              border: '1px solid rgba(37, 211, 102, 0.4)',
              padding: '4px 14px',
              borderRadius: 'var(--radius-full)',
              marginBottom: '0.85rem'
            }}
          >
            <WhatsAppIcon size={14} color="#25D366" />
            <span style={{ fontSize: '0.72rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#25D366', fontWeight: '700' }}>
              DIRECT WHATSAPP ORDER
            </span>
          </div>

          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', color: 'var(--text-pure-white)', margin: '0 0 0.4rem' }}>
            Order on WhatsApp
          </h2>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: 0 }}>
            Enter your name below to start your order with the LUXE NIA concierge.
          </p>
        </div>

        {/* Order Details Card */}
        <div 
          style={{
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid var(--border-gold)',
            borderRadius: 'var(--radius-xs)',
            padding: '1.15rem',
            marginBottom: '1.5rem',
            display: 'flex',
            gap: '1rem',
            alignItems: 'center'
          }}
        >
          {bagImage && !isCartOrder && (
            <img 
              src={bagImage} 
              alt={bagName} 
              style={{
                width: '64px',
                height: '64px',
                objectFit: 'cover',
                borderRadius: 'var(--radius-xs)',
                border: '1px solid rgba(212, 175, 55, 0.3)'
              }}
            />
          )}

          <div style={{ flex: 1, minWidth: 0 }}>
            <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '0.98rem', color: 'var(--text-pure-white)', margin: '0 0 0.35rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {isCartOrder ? `${orderData.items.length} Bags Selected` : bagName}
            </h4>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px', fontSize: '0.76rem', color: 'var(--text-muted)' }}>
              <div>
                <span style={{ display: 'block', color: 'var(--text-secondary)' }}>Quantity</span>
                <strong style={{ color: 'var(--text-primary)', fontSize: '0.84rem' }}>
                  {isCartOrder ? orderData.items.reduce((s, i) => s + (i.quantity || 1), 0) : quantity}
                </strong>
              </div>

              {!isCartOrder && (
                <div>
                  <span style={{ display: 'block', color: 'var(--text-secondary)' }}>Bag Price</span>
                  <strong style={{ color: 'var(--gold-300)', fontSize: '0.84rem' }}>
                    KSh {bagPrice.toLocaleString()}
                  </strong>
                </div>
              )}

              <div style={{ gridColumn: isCartOrder ? 'span 2' : 'auto' }}>
                <span style={{ display: 'block', color: 'var(--text-secondary)' }}>Total Price</span>
                <strong style={{ color: 'var(--gold-300)', fontSize: '0.88rem' }}>
                  KSh {totalPrice.toLocaleString()}
                </strong>
              </div>
            </div>
          </div>
        </div>

        {/* Single Field Form: Customer Name */}
        <form onSubmit={handleContinue} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label 
              htmlFor="customer-order-name" 
              style={{ 
                display: 'block', 
                fontSize: '0.82rem', 
                fontWeight: '700', 
                color: 'var(--gold-300)', 
                marginBottom: '0.45rem',
                letterSpacing: '0.05em'
              }}
            >
              Your Name *
            </label>
            <input
              id="customer-order-name"
              ref={inputRef}
              type="text"
              required
              value={customerName}
              onChange={(e) => {
                setCustomerName(e.target.value);
                if (errorMsg) setErrorMsg('');
              }}
              placeholder="e.g. Jane"
              className="form-input"
              style={{
                width: '100%',
                height: '48px',
                padding: '0 1rem',
                fontSize: '0.95rem',
                borderRadius: 'var(--radius-xs)',
                border: errorMsg ? '1px solid #EF4444' : '1px solid var(--border-gold)',
                background: 'rgba(0, 0, 0, 0.4)',
                color: '#fff'
              }}
            />
            {errorMsg && (
              <span style={{ color: '#EF4444', fontSize: '0.76rem', marginTop: '4px', display: 'block' }}>
                {errorMsg}
              </span>
            )}
          </div>

          {/* Action Button: Continue to WhatsApp */}
          <button
            type="submit"
            style={{
              width: '100%',
              padding: '0.95rem 1.25rem',
              fontSize: '0.92rem',
              fontWeight: '800',
              letterSpacing: '0.08em',
              background: 'linear-gradient(135deg, #1b3824 0%, #128C7E 50%, #25D366 100%)',
              border: '1px solid #25D366',
              borderRadius: 'var(--radius-xs)',
              color: '#fff',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              boxShadow: '0 8px 25px rgba(37,211,102,0.4)',
              transition: 'all 0.2s ease',
              marginTop: '0.5rem'
            }}
          >
            <WhatsAppIcon size={20} color="#fff" />
            <span>CONTINUE TO WHATSAPP</span>
          </button>
        </form>

        {/* Reassurance Footer */}
        <div style={{ marginTop: '1.25rem', textAlign: 'center', fontSize: '0.74rem', color: 'var(--text-muted)' }}>
          <span>Chat directly with LUXE NIA concierge ({OFFICIAL_DISPLAY_PHONE}) to arrange courier delivery & payment.</span>
        </div>
      </div>
    </div>
  );
}
