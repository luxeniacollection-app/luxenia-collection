import React, { useState } from 'react';
import { MessageCircle, X, Sparkles, Send, ShieldCheck, Clock, ArrowRight, ExternalLink } from 'lucide-react';
import { WhatsAppIcon } from './SocialIcons';
import { 
  OFFICIAL_DISPLAY_PHONE, 
  OFFICIAL_LOCAL_PHONE,
  OFFICIAL_WHATSAPP_PHONE,
  DEFAULT_WHATSAPP_MESSAGE,
  getWhatsAppInquiryUrl 
} from '../../utils/whatsapp';

export default function WhatsAppConcierge() {
  const [isOpen, setIsOpen] = useState(false);
  const [customMsg, setCustomMsg] = useState('');

  const quickQuestions = [
    DEFAULT_WHATSAPP_MESSAGE,
    '👜 Inquire about The Sovereign Baguette Flap Bag',
    '🚚 Inquire about Same-Day Nairobi Express Courier',
    '💳 Inquire about Ordering & Payment Options',
    '👑 Inquire about Custom Colorways & Bespoke Orders'
  ];

  const handleSend = (textToSend) => {
    const message = textToSend || customMsg || DEFAULT_WHATSAPP_MESSAGE;
    const url = getWhatsAppInquiryUrl(message);
    window.open(url, '_blank', 'noopener,noreferrer');
    setIsOpen(false);
    setCustomMsg('');
  };

  return (
    <div style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 120, fontFamily: 'var(--font-sans)' }}>
      {/* Floating Chat Popover Window */}
      {isOpen && (
        <div 
          style={{
            position: 'absolute',
            bottom: '70px',
            right: '0',
            width: '350px',
            maxWidth: 'calc(100vw - 32px)',
            background: 'linear-gradient(145deg, #13121C 0%, #08080C 100%)',
            border: '1px solid var(--border-gold)',
            borderRadius: 'var(--radius-sm)',
            boxShadow: '0 25px 60px rgba(0,0,0,0.9), 0 0 30px rgba(212,175,55,0.2)',
            overflow: 'hidden',
            animation: 'fadeInUp 0.3s ease forwards'
          }}
        >
          {/* Header */}
          <div 
            style={{
              padding: '1.25rem',
              background: 'linear-gradient(135deg, rgba(212,175,55,0.2) 0%, rgba(37,211,102,0.15) 100%)',
              borderBottom: '1px solid var(--border-gold)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ position: 'relative' }}>
                <div 
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, #25D366 0%, #128C7E 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    boxShadow: '0 0 12px rgba(37,211,102,0.5)'
                  }}
                >
                  <WhatsAppIcon size={22} color="#fff" />
                </div>
                {/* Online pulse green dot */}
                <span 
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    backgroundColor: '#10B981',
                    border: '2px solid #111',
                    boxShadow: '0 0 8px #10B981'
                  }}
                />
              </div>

              <div>
                <h4 style={{ fontSize: '0.98rem', color: 'var(--text-pure-white)', fontFamily: 'var(--font-serif)', margin: 0 }}>
                  LUXE NIA Concierge
                </h4>
                <span style={{ fontSize: '0.72rem', color: '#34D399', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#34D399' }} /> Live • Nairobi Atelier
                </span>
              </div>
            </div>

            <button 
              onClick={() => setIsOpen(false)}
              style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }}
              aria-label="Close concierge popup"
            >
              <X size={18} />
            </button>
          </div>

          {/* Body Content */}
          <div style={{ padding: '1.25rem' }}>
            {/* Direct 1-Click Launch Button */}
            <button
              onClick={() => handleSend(DEFAULT_WHATSAPP_MESSAGE)}
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
                marginBottom: '1rem',
                boxShadow: '0 4px 15px rgba(37,211,102,0.35)',
                transition: 'all 0.2s ease'
              }}
            >
              <WhatsAppIcon size={16} color="#fff" />
              <span>Start WhatsApp Inquiry Now</span>
              <ExternalLink size={13} />
            </button>

            <div 
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-xs)',
                padding: '0.75rem',
                marginBottom: '1rem',
                fontSize: '0.8rem',
                color: 'var(--text-secondary)',
                lineHeight: '1.5'
              }}
            >
              <p style={{ margin: 0, color: 'var(--text-primary)' }}>
                Welcome to <strong>LUXE NIA</strong>. ✨
              </p>
              <p style={{ margin: '0.35rem 0 0', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Select a pre-filled inquiry or write your custom message below.
              </p>
            </div>

            {/* Quick Prompt Chips */}
            <div style={{ marginBottom: '1rem' }}>
              <span style={{ fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--gold-400)', fontWeight: '700', display: 'block', marginBottom: '0.4rem' }}>
                Pre-Filled Inquiries:
              </span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {quickQuestions.map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSend(q)}
                    style={{
                      background: 'rgba(212,175,55,0.06)',
                      border: '1px solid rgba(212,175,55,0.2)',
                      borderRadius: 'var(--radius-xs)',
                      padding: '0.5rem 0.75rem',
                      textAlign: 'left',
                      fontSize: '0.74rem',
                      color: 'var(--text-primary)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(212,175,55,0.15)';
                      e.currentTarget.style.borderColor = 'var(--gold-400)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'rgba(212,175,55,0.06)';
                      e.currentTarget.style.borderColor = 'rgba(212,175,55,0.2)';
                    }}
                  >
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '270px' }}>{q}</span>
                    <ArrowRight size={12} color="var(--gold-400)" style={{ flexShrink: 0 }} />
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Input */}
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                handleSend(customMsg);
              }}
              style={{ display: 'flex', gap: '6px' }}
            >
              <input
                type="text"
                value={customMsg}
                onChange={(e) => setCustomMsg(e.target.value)}
                placeholder="Type your question..."
                style={{
                  flex: 1,
                  padding: '0.65rem 0.85rem',
                  background: 'rgba(10,10,14,0.8)',
                  border: '1px solid var(--border-gold)',
                  borderRadius: 'var(--radius-xs)',
                  color: '#fff',
                  fontSize: '0.8rem',
                  outline: 'none'
                }}
              />
              <button
                type="submit"
                style={{
                  background: 'radial-gradient(circle, #25D366 0%, #128C7E 100%)',
                  border: 'none',
                  borderRadius: 'var(--radius-xs)',
                  color: '#fff',
                  padding: '0 0.85rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 0 10px rgba(37,211,102,0.3)'
                }}
                title="Send to WhatsApp"
                aria-label="Send WhatsApp message"
              >
                <Send size={15} />
              </button>
            </form>

            <div style={{ marginTop: '0.75rem', textAlign: 'center' }}>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                Official WhatsApp: <strong style={{ color: 'var(--gold-300)' }}>{OFFICIAL_DISPLAY_PHONE}</strong> ({OFFICIAL_LOCAL_PHONE})
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Floating Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          padding: '0.75rem 1.25rem',
          background: 'linear-gradient(135deg, #1b3824 0%, #0d1a10 50%, #181822 100%)',
          border: '1px solid #25D366',
          borderRadius: 'var(--radius-full)',
          color: '#fff',
          cursor: 'pointer',
          boxShadow: '0 8px 25px rgba(0,0,0,0.75), 0 0 20px rgba(37,211,102,0.4)',
          transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
          position: 'relative'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-3px) scale(1.03)';
          e.currentTarget.style.boxShadow = '0 12px 30px rgba(0,0,0,0.85), 0 0 25px rgba(37,211,102,0.6)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0) scale(1)';
          e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.75), 0 0 20px rgba(37,211,102,0.4)';
        }}
        aria-label="Open WhatsApp Concierge"
      >
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
          <div 
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              background: '#25D366',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 10px rgba(37,211,102,0.6)'
            }}
          >
            <WhatsAppIcon size={17} color="#fff" />
          </div>
          <span 
            style={{
              position: 'absolute',
              top: -2,
              right: -2,
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: '#10B981',
              border: '1.5px solid #111'
            }}
          />
        </div>

        <div style={{ textAlign: 'left' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: '700', letterSpacing: '0.04em', color: '#fff', display: 'block', lineHeight: 1.2 }}>
            WhatsApp Concierge
          </span>
          <span style={{ fontSize: '0.68rem', color: '#34D399', letterSpacing: '0.02em' }}>
            Nairobi Atelier Online
          </span>
        </div>
      </button>
    </div>
  );
}
