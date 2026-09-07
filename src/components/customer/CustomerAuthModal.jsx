import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Mail, Lock, User, Phone, ArrowRight, ShieldCheck, Eye, EyeOff, Sparkles, Crown } from 'lucide-react';
import { useCustomerAuth } from '../../context/CustomerAuthContext';
import { useAdminAuth } from '../../context/AdminAuthContext';
import Logo from '../common/Logo';

export default function CustomerAuthModal() {
  const navigate = useNavigate();
  const { isAuthModalOpen, closeAuthModal, authModalTab, setAuthModalTab, customerLogin, customerRegister, isLoading: isCustLoading } = useCustomerAuth();
  const { login: adminLogin } = useAdminAuth();

  const [activeTab, setActiveTab] = useState('login'); // 'login' | 'register'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync tab with external open trigger
  useEffect(() => {
    if (authModalTab) {
      setActiveTab(authModalTab);
    }
  }, [authModalTab]);

  if (!isAuthModalOpen) return null;

  const handleTabSwitch = (tab) => {
    setActiveTab(tab);
    if (setAuthModalTab) {
      setAuthModalTab(tab);
    }
    setErrorMsg('');
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setErrorMsg('');
    setIsSubmitting(true);

    const cleanEmail = (email || '').trim().toLowerCase();
    const cleanPass = (password || '').trim();

    if (activeTab === 'login') {
      // 1. Check if Admin credentials
      if (cleanEmail === 'luxeniacollection@gmail.com' || cleanEmail === 'admin@luxenia.com') {
        const adminRes = await adminLogin(cleanEmail, cleanPass);
        setIsSubmitting(false);
        if (adminRes.success) {
          closeAuthModal();
          navigate('/admin/dashboard');
          return;
        } else {
          setErrorMsg(adminRes.error || 'Incorrect administrator password.');
          return;
        }
      }

      // 2. Authenticate as Customer
      const res = await customerLogin(cleanEmail, cleanPass);
      if (res.success) {
        setIsSubmitting(false);
        closeAuthModal();
        navigate('/account');
        return;
      }

      // 3. Fallback: Check if another admin email matches
      const fallbackAdminRes = await adminLogin(cleanEmail, cleanPass);
      setIsSubmitting(false);
      if (fallbackAdminRes.success) {
        closeAuthModal();
        navigate('/admin/dashboard');
        return;
      }

      setErrorMsg(res.error || 'Invalid email or password. Please check your credentials or create a new account.');
    } else {
      // Register New Customer Account
      const res = await customerRegister({
        fullName,
        email: cleanEmail,
        phone,
        password: cleanPass
      });
      setIsSubmitting(false);
      if (res.success) {
        closeAuthModal();
        navigate('/account');
      } else {
        setErrorMsg(res.error || 'Failed to create account.');
      }
    }
  };

  return (
    <div 
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(5, 5, 8, 0.88)',
        backdropFilter: 'blur(10px)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.25rem',
        animation: 'fadeIn 0.2s ease-out'
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) closeAuthModal();
      }}
    >
      <div 
        style={{
          width: '100%',
          maxWidth: '460px',
          background: 'linear-gradient(165deg, rgba(22, 20, 32, 0.98) 0%, rgba(12, 12, 16, 0.99) 100%)',
          border: '1px solid var(--border-gold)',
          borderRadius: 'var(--radius-sm)',
          padding: 'clamp(1.75rem, 5vw, 2.5rem)',
          boxShadow: '0 25px 60px rgba(0,0,0,0.9), 0 0 30px rgba(212,175,55,0.15)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Close Button */}
        <button
          onClick={closeAuthModal}
          style={{
            position: 'absolute',
            top: '1.25rem',
            right: '1.25rem',
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid var(--border-subtle)',
            color: 'var(--text-muted)',
            borderRadius: '50%',
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
          aria-label="Close"
        >
          <X size={16} />
        </button>

        {/* Top Atelier Branding */}
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(212,175,55,0.1)', border: '1px solid var(--border-gold)', padding: '3px 12px', borderRadius: 'var(--radius-full)', marginBottom: '0.85rem' }}>
            <Sparkles size={12} color="var(--gold-400)" />
            <span style={{ fontSize: '0.7rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--gold-300)', fontWeight: '700' }}>
              LUXE NIA UNIFIED ACCESS
            </span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.5rem' }}>
            <Logo size="sm" />
          </div>

          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.45rem', color: 'var(--text-pure-white)', margin: '0.5rem 0 0.25rem' }}>
            Sign In to LUXE NIA
          </h2>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.4 }}>
            Access your private portal, order status, and atelier privileges.
          </p>
        </div>

        {/* Error Notification */}
        {errorMsg && (
          <div 
            style={{
              background: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.4)',
              borderRadius: 'var(--radius-xs)',
              padding: '0.65rem 0.85rem',
              color: '#F87171',
              fontSize: '0.82rem',
              marginBottom: '1.25rem',
              textAlign: 'center'
            }}
          >
            {errorMsg}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {activeTab === 'register' && (
            <>
              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--gold-300)', fontSize: '0.8rem' }}>
                  <User size={13} color="var(--gold-400)" />
                  <span>Full Name *</span>
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Vanessa Nyambura"
                  className="form-input"
                  style={{ height: '44px', fontSize: '0.88rem' }}
                />
              </div>

              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--gold-300)', fontSize: '0.8rem' }}>
                  <Phone size={13} color="var(--gold-400)" />
                  <span>M-Pesa Phone Number</span>
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="07XX XXX XXX (for order delivery & M-Pesa)"
                  className="form-input"
                  style={{ height: '44px', fontSize: '0.88rem' }}
                />
              </div>
            </>
          )}

          <div className="form-group" style={{ marginBottom: '1rem' }}>
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--gold-300)', fontSize: '0.8rem' }}>
              <Mail size={13} color="var(--gold-400)" />
              <span>Email Address *</span>
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="client@luxenia.com or admin@luxenia.com"
              className="form-input"
              style={{ height: '44px', fontSize: '0.88rem' }}
            />
          </div>

          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--gold-300)', fontSize: '0.8rem' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Lock size={13} color="var(--gold-400)" />
                <span>Password *</span>
              </span>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.74rem', display: 'flex', alignItems: 'center', gap: '4px' }}
              >
                {showPassword ? <EyeOff size={13} /> : <Eye size={13} />}
                <span>{showPassword ? 'Hide' : 'Show'}</span>
              </button>
            </label>
            <input
              type={showPassword ? 'text' : 'password'}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={activeTab === 'register' ? 'Min. 6 characters' : '••••••••'}
              className="form-input"
              style={{ height: '44px', fontSize: '0.88rem' }}
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting || isCustLoading}
            className="btn-gold"
            style={{
              width: '100%',
              padding: '0.85rem',
              fontWeight: '700',
              fontSize: '0.86rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            <span>
              {isSubmitting
                ? 'AUTHENTICATING...'
                : activeTab === 'login'
                ? 'SIGN IN'
                : 'CREATE CLIENT ACCOUNT'}
            </span>
            <ArrowRight size={15} />
          </button>
        </form>

        {/* Security Note */}
        <div style={{ marginTop: '1.5rem', textAlign: 'center', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
          <ShieldCheck size={13} color="var(--gold-400)" />
          <span>Encrypted Luxe Nia Security Protocol</span>
        </div>
      </div>
    </div>
  );
}
