import React, { useState } from 'react';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Send, 
  Sparkles, 
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  ExternalLink
} from 'lucide-react';
import { useToast } from '../common/Toast';
import { InstagramIcon, WhatsAppIcon } from '../common/SocialIcons';
import { 
  OFFICIAL_WHATSAPP_PHONE,
  OFFICIAL_LOCAL_PHONE,
  OFFICIAL_DISPLAY_PHONE, 
  OFFICIAL_INSTAGRAM_URL, 
  OFFICIAL_INSTAGRAM_HANDLE, 
  OFFICIAL_EMAIL,
  DEFAULT_WHATSAPP_MESSAGE,
  getWhatsAppInquiryUrl 
} from '../../utils/whatsapp';
import Logo from '../common/Logo';

export default function ContactPage() {
  const { addToast } = useToast();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('Product Inquiry');
  const [message, setMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!fullName || !phone || !message) {
      addToast('Please fill in your name, phone, and message.', 'error');
      return;
    }

    setIsSubmitted(true);
    addToast('Thank you for reaching out. Our concierge team has received your message.', 'gold', 5000);
  };

  return (
    <div className="contact-page" style={{ padding: '3.5rem 0 6rem', background: 'var(--bg-black)', minHeight: '80vh' }}>
      <div className="luxe-container">
        {/* Header */}
        <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 3.5rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(212, 175, 55, 0.1)', border: '1px solid var(--border-gold)', padding: '4px 16px', borderRadius: 'var(--radius-full)', marginBottom: '1.25rem' }}>
            <Sparkles size={14} color="var(--gold-400)" />
            <span style={{ fontSize: '0.74rem', textTransform: 'uppercase', letterSpacing: '0.18em', color: 'var(--gold-300)', fontWeight: '700' }}>
              LUXE NIA Client Concierge
            </span>
          </div>

          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2.2rem, 4.5vw, 3.4rem)', color: 'var(--text-pure-white)', marginBottom: '0.85rem' }}>
            Connect with LUXE NIA
          </h1>

          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: '1.7', margin: 0 }}>
            Whether inquiring about the Sovereign Baguette, bespoke leather craftsmanship, or same-day delivery in Nairobi, our dedicated concierge team is at your service.
          </p>
        </div>

        {/* =================================================================
            1. DEDICATED "FIND US" SECTION
            ================================================================= */}
        <section 
          id="find-us"
          className="find-us-section"
          style={{
            marginBottom: '4.5rem',
            background: 'linear-gradient(180deg, rgba(21, 19, 30, 0.7) 0%, rgba(10, 10, 14, 0.95) 100%)',
            border: '1px solid var(--border-gold)',
            borderRadius: 'var(--radius-sm)',
            padding: '3rem 2.25rem',
            boxShadow: '0 20px 50px rgba(0,0,0,0.7), 0 0 30px rgba(212,175,55,0.1)'
          }}
        >
          {/* Find Us Section Header */}
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 2.75rem' }}>
            <span style={{ fontSize: '0.74rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--gold-400)', fontWeight: '700', display: 'block', marginBottom: '0.5rem' }}>
              OFFICIAL CHANNELS
            </span>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)', color: 'var(--text-pure-white)', margin: 0 }}>
              Find Us & Connect
            </h2>
            <div style={{ width: '50px', height: '2px', background: 'var(--gold-400)', margin: '1rem auto 0' }} />
          </div>

          {/* 3 Channels Grid */}
          <div 
            style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
              gap: '2rem' 
            }}
          >
            {/* Card 1: WhatsApp Channel */}
            <div 
              style={{
                background: 'linear-gradient(160deg, #102619 0%, #09140D 100%)',
                border: '1px solid rgba(37, 211, 102, 0.45)',
                borderRadius: 'var(--radius-xs)',
                padding: '2rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: '0 10px 30px rgba(0,0,0,0.5), 0 0 20px rgba(37,211,102,0.15)',
                transition: 'all 0.3s ease'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                  <div 
                    style={{
                      width: '46px',
                      height: '46px',
                      borderRadius: '50%',
                      background: 'radial-gradient(circle, #25D366 0%, #128C7E 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#fff',
                      boxShadow: '0 0 15px rgba(37,211,102,0.4)'
                    }}
                  >
                    <WhatsAppIcon size={24} color="#fff" />
                  </div>
                  <span style={{ fontSize: '0.72rem', background: 'rgba(37,211,102,0.15)', color: '#34D399', border: '1px solid rgba(37,211,102,0.3)', padding: '2px 8px', borderRadius: '10px', fontWeight: '700' }}>
                    Instant Chat
                  </span>
                </div>

                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.35rem', color: '#fff', marginBottom: '0.4rem' }}>
                  WhatsApp Concierge
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.75)', lineHeight: '1.6', marginBottom: '1rem' }}>
                  Speak directly with our client concierge for bag inquiries, stock confirmation, and fast M-Pesa order dispatch.
                </p>

                <div style={{ background: 'rgba(0,0,0,0.35)', padding: '0.75rem', borderRadius: 'var(--radius-xs)', marginBottom: '1.5rem', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div style={{ fontSize: '0.76rem', color: 'rgba(255,255,255,0.6)', marginBottom: '3px' }}>Business Number:</div>
                  <div style={{ fontSize: '0.92rem', fontWeight: '700', color: '#34D399', fontFamily: 'monospace' }}>
                    {OFFICIAL_LOCAL_PHONE} ({OFFICIAL_DISPLAY_PHONE})
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.5)', marginTop: '4px' }}>
                    International: +{OFFICIAL_WHATSAPP_PHONE}
                  </div>
                </div>
              </div>

              <a
                href={getWhatsAppInquiryUrl(DEFAULT_WHATSAPP_MESSAGE)}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  background: 'linear-gradient(135deg, #1b3824 0%, #128C7E 100%)',
                  border: '1px solid #25D366',
                  borderRadius: 'var(--radius-xs)',
                  color: '#fff',
                  padding: '0.85rem 1.25rem',
                  fontSize: '0.86rem',
                  fontWeight: '700',
                  textDecoration: 'none',
                  boxShadow: '0 4px 15px rgba(37,211,102,0.3)',
                  transition: 'all 0.2s ease'
                }}
              >
                <WhatsAppIcon size={16} color="#fff" />
                <span>Chat on WhatsApp</span>
                <ExternalLink size={14} />
              </a>
            </div>

            {/* Card 2: Instagram Channel */}
            <div 
              style={{
                background: 'linear-gradient(160deg, #1D1525 0%, #110B16 100%)',
                border: '1px solid rgba(212, 175, 55, 0.45)',
                borderRadius: 'var(--radius-xs)',
                padding: '2rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: '0 10px 30px rgba(0,0,0,0.5), 0 0 20px rgba(212,175,55,0.15)',
                transition: 'all 0.3s ease'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                  <div 
                    style={{
                      width: '46px',
                      height: '46px',
                      borderRadius: '50%',
                      background: 'radial-gradient(circle, #E1306C 0%, #833AB4 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#fff',
                      boxShadow: '0 0 15px rgba(225,48,108,0.4)'
                    }}
                  >
                    <InstagramIcon size={24} color="#fff" />
                  </div>
                  <span style={{ fontSize: '0.72rem', background: 'rgba(212,175,55,0.15)', color: 'var(--gold-300)', border: '1px solid var(--border-gold)', padding: '2px 8px', borderRadius: '10px', fontWeight: '700' }}>
                    Haute Lookbook
                  </span>
                </div>

                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.35rem', color: '#fff', marginBottom: '0.4rem' }}>
                  Official Instagram
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.6', marginBottom: '1rem' }}>
                  Follow our visual feed for new bag releases, artisan behind-the-scenes videos, and editorial styling in Nairobi.
                </p>

                <div style={{ background: 'rgba(0,0,0,0.35)', padding: '0.75rem', borderRadius: 'var(--radius-xs)', marginBottom: '1.5rem', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', marginBottom: '3px' }}>Instagram Handle:</div>
                  <div style={{ fontSize: '0.92rem', fontWeight: '700', color: 'var(--gold-300)', fontFamily: 'monospace' }}>
                    {OFFICIAL_INSTAGRAM_HANDLE}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                    Direct Link: instagram.com/luxeniacollection
                  </div>
                </div>
              </div>

              <a
                href={OFFICIAL_INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  background: 'linear-gradient(135deg, rgba(212,175,55,0.15) 0%, rgba(225,48,108,0.2) 100%)',
                  border: '1px solid var(--border-gold)',
                  borderRadius: 'var(--radius-xs)',
                  color: 'var(--gold-300)',
                  padding: '0.85rem 1.25rem',
                  fontSize: '0.86rem',
                  fontWeight: '700',
                  textDecoration: 'none',
                  boxShadow: '0 4px 15px rgba(212,175,55,0.2)',
                  transition: 'all 0.2s ease'
                }}
              >
                <InstagramIcon size={16} color="var(--gold-400)" />
                <span>Visit @luxeniacollection</span>
                <ExternalLink size={14} />
              </a>
            </div>

            {/* Card 3: Nairobi Atelier Showroom */}
            <div 
              className="contact-showroom-card"
              style={{
                background: 'linear-gradient(160deg, #161520 0%, #0A0A0E 100%)',
                border: '1px solid var(--border-gold)',
                borderRadius: 'var(--radius-xs)',
                padding: '2rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                transition: 'all 0.3s ease'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                  <div 
                    style={{
                      width: '46px',
                      height: '46px',
                      borderRadius: '50%',
                      background: 'radial-gradient(circle, #D4AF37 0%, #966D21 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#08080C',
                      boxShadow: '0 0 15px rgba(212,175,55,0.3)'
                    }}
                  >
                    <MapPin size={24} color="#08080C" />
                  </div>
                  <span style={{ fontSize: '0.72rem', background: 'rgba(212,175,55,0.1)', color: 'var(--gold-300)', border: '1px solid var(--border-gold)', padding: '2px 8px', borderRadius: '10px', fontWeight: '700' }}>
                    Online & Countrywide
                  </span>
                </div>

                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.35rem', color: 'var(--text-pure-white)', marginBottom: '0.4rem' }}>
                  Web-based Online Nairobi
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.6', marginBottom: '1rem' }}>
                  Web-based online Nairobi and delivery is done country wide.
                </p>

                <div style={{ background: 'rgba(0,0,0,0.35)', padding: '0.75rem', borderRadius: 'var(--radius-xs)', marginBottom: '1.5rem', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                    <Clock size={13} color="var(--gold-400)" />
                    <span>Mon – Sun: 8:00 AM – 10:00 PM EAT</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.76rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                    <Phone size={13} color="var(--gold-400)" />
                    <span>Direct: {OFFICIAL_DISPLAY_PHONE}</span>
                  </div>
                </div>
              </div>

              <a
                href={`tel:${OFFICIAL_LOCAL_PHONE}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  background: 'rgba(212,175,55,0.1)',
                  border: '1px solid var(--border-gold)',
                  borderRadius: 'var(--radius-xs)',
                  color: 'var(--gold-300)',
                  padding: '0.85rem 1.25rem',
                  fontSize: '0.86rem',
                  fontWeight: '700',
                  textDecoration: 'none',
                  transition: 'all 0.2s ease'
                }}
              >
                <Phone size={15} color="var(--gold-400)" />
                <span>Call {OFFICIAL_LOCAL_PHONE}</span>
              </a>
            </div>
          </div>
        </section>

        {/* =================================================================
            2. DIRECT INQUIRY & CONTACT FORM SECTION
            ================================================================= */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '3.5rem', alignItems: 'flex-start' }}>
          {/* Left Column: Atelier Overview & Quick WhatsApp */}
          <div>
            <div 
              className="contact-atelier-card"
              style={{
                background: 'linear-gradient(145deg, #14131D 0%, #0A0A0E 100%)',
                border: '1px solid var(--border-gold)',
                borderRadius: 'var(--radius-sm)',
                padding: '2.5rem',
                boxShadow: 'var(--shadow-gold)',
                marginBottom: '2rem'
              }}
            >
              <Logo size="md" />

              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', color: 'var(--text-pure-white)', margin: '1.5rem 0 1.25rem' }}>
                Client Care Summary
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  <MapPin size={18} color="var(--gold-400)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <strong style={{ color: 'var(--text-pure-white)', display: 'block', marginBottom: '2px' }}>Location & Delivery</strong>
                    <span>Web-based online Nairobi and delivery is done country wide</span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  <Phone size={18} color="var(--gold-400)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <strong style={{ color: 'var(--text-pure-white)', display: 'block', marginBottom: '2px' }}>Phone / WhatsApp</strong>
                    <span>{OFFICIAL_LOCAL_PHONE} / {OFFICIAL_DISPLAY_PHONE}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  <Mail size={18} color="var(--gold-400)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <strong style={{ color: 'var(--text-pure-white)', display: 'block', marginBottom: '2px' }}>Concierge Email</strong>
                    <a 
                      href={`mailto:${OFFICIAL_EMAIL}`}
                      style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}
                    >
                      {OFFICIAL_EMAIL}
                    </a>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  <InstagramIcon size={18} color="var(--gold-400)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <strong style={{ color: 'var(--text-pure-white)', display: 'block', marginBottom: '2px' }}>Instagram</strong>
                    <a 
                      href={OFFICIAL_INSTAGRAM_URL}
                      target="_blank" 
                      rel="noopener noreferrer"
                      style={{ color: 'var(--gold-300)', textDecoration: 'none' }}
                    >
                      {OFFICIAL_INSTAGRAM_HANDLE}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div 
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-gold)',
              borderRadius: 'var(--radius-sm)',
              padding: '3rem 2.5rem',
              boxShadow: 'var(--shadow-gold)'
            }}
          >
            {isSubmitted ? (
              <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
                <div 
                  style={{
                    width: '68px',
                    height: '68px',
                    borderRadius: '50%',
                    background: 'rgba(212, 175, 55, 0.15)',
                    border: '2px solid var(--gold-400)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1.5rem',
                    color: 'var(--gold-300)'
                  }}
                >
                  <CheckCircle2 size={36} />
                </div>

                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.6rem', color: 'var(--text-pure-white)', marginBottom: '0.5rem' }}>
                  Inquiry Received
                </h3>

                <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', maxWidth: '400px', margin: '0 auto 2rem', lineHeight: '1.7' }}>
                  Thank you, <strong>{fullName}</strong>. A dedicated LUXE NIA concierge advisor will reach out to you shortly via phone or email.
                </p>

                <button 
                  className="btn-gold-outline"
                  onClick={() => {
                    setIsSubmitted(false);
                    setMessage('');
                  }}
                  style={{ padding: '0.8rem 2rem' }}
                >
                  Send Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', color: 'var(--gold-300)', marginBottom: '0.4rem' }}>
                  Send a Direct Message
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '2rem' }}>
                  Fill out your details below and our concierge team will respond promptly.
                </p>

                <div className="form-group">
                  <label className="form-label">Your Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Zahra Mwangi"
                    className="form-input"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                  <div className="form-group">
                    <label className="form-label">Email Address</label>
                    <input
                      type="email"
                      required
                      placeholder="you@domain.com"
                      className="form-input"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Phone / WhatsApp Number</label>
                    <input
                      type="tel"
                      required
                      placeholder="0795439545"
                      className="form-input"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Topic / Subject</label>
                  <select 
                    className="form-select"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                  >
                    <option value="Product Inquiry">Product Inquiry (The Sovereign Baguette)</option>
                    <option value="Same-Day Delivery">Nairobi Same-Day Express Delivery</option>
                    <option value="M-Pesa Payment">M-Pesa Payment Support</option>
                    <option value="Corporate / Custom Gift Commission">Corporate / Bespoke Gift Commission</option>
                    <option value="General Concierge">General Concierge Care</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Your Message</label>
                  <textarea
                    rows={5}
                    required
                    placeholder="How may our concierge assist you today?"
                    className="form-textarea"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                </div>

                <button 
                  type="submit" 
                  className="btn-gold"
                  style={{ width: '100%', padding: '1rem', marginTop: '0.5rem' }}
                >
                  <Send size={16} /> Send Concierge Message
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
