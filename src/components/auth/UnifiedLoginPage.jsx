import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Lock, Mail, User, Phone, ShieldCheck, ArrowRight, Crown, ArrowLeft, Eye, EyeOff, Sparkles } from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { useCustomerAuth } from '../../context/CustomerAuthContext';
import Logo from '../common/Logo';

export default function UnifiedLoginPage({ defaultTab = 'login' }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { login: adminLogin, isAuthenticated: isAdminAuthenticated } = useAdminAuth();
  const { customerLogin, customerRegister, isCustomerAuthenticated } = useCustomerAuth();

  const [activeTab, setActiveTab] = useState(defaultTab); // 'login' | 'register'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // If already authenticated as admin, route to dashboard
  useEffect(() => {
    if (isAdminAuthenticated) {
      navigate('/admin/dashboard', { replace: true });
    }
  }, [isAdminAuthenticated, navigate]);

  // If already authenticated as customer and not admin, route to account
  useEffect(() => {
    if (isCustomerAuthenticated && !isAdminAuthenticated && location.pathname !== '/admin') {
      navigate('/account', { replace: true });
    }
  }, [isCustomerAuthenticated, isAdminAuthenticated, location.pathname, navigate]);

  const handleTabSwitch = (tab) => {
    setActiveTab(tab);
    setErrorMsg('');
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setErrorMsg('');
    setIsSubmitting(true);

    const cleanEmail = (email || '').trim().toLowerCase();
    const cleanPass = (password || '').trim();

    if (activeTab === 'login') {
      if (!cleanEmail || !cleanPass) {
        setErrorMsg('Please enter both your email address and password.');
        setIsSubmitting(false);
        return;
      }

      // 1. Check if Admin credentials
      if (cleanEmail === 'luxeniacollection@gmail.com' || cleanEmail === 'admin@luxenia.com') {
        const adminRes = await adminLogin(cleanEmail, cleanPass);
        setIsSubmitting(false);

        if (adminRes.success) {
          navigate('/admin/dashboard', { replace: true });
          return;
        } else {
          setErrorMsg(adminRes.error || 'Incorrect administrator password.');
          return;
        }
      }

      // 2. Try Customer Login
      const custRes = await customerLogin(cleanEmail, cleanPass);
      if (custRes.success) {
        setIsSubmitting(false);
        const redirectTarget = location.state?.from?.pathname || '/account';
        navigate(redirectTarget, { replace: true });
        return;
      }

      // 3. Fallback: check if alternate admin credentials match
      const fallbackAdminRes = await adminLogin(cleanEmail, cleanPass);
      setIsSubmitting(false);
      if (fallbackAdminRes.success) {
        navigate('/admin/dashboard', { replace: true });
        return;
      }

      setErrorMsg(custRes.error || 'Invalid email or password. Please check your credentials or create a new account.');
    } else {
      // 4. Register New Customer Account
      if (!fullName.trim()) {
        setErrorMsg('Please enter your full name.');
        setIsSubmitting(false);
        return;
      }
      if (!cleanEmail) {
        setErrorMsg('Please enter your email address.');
        setIsSubmitting(false);
        return;
      }
      if (!cleanPass || cleanPass.length < 6) {
        setErrorMsg('Password must be at least 6 characters.');
        setIsSubmitting(false);
        return;
      }

      const regRes = await customerRegister({
        fullName: fullName.trim(),
        email: cleanEmail,
        phone: (phone || '').trim(),
        password: cleanPass
      });

      setIsSubmitting(false);
      if (regRes.success) {
        navigate('/account', { replace: true });
      } else {
        setErrorMsg(regRes.error || 'Registration failed. Please try again.');
      }
    }
  };

  return (
    <div 
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'radial-gradient(ellipse at 50% 30%, #171424 0%, #0c0c12 60%, #050508 100%)',
        padding: '2.5rem 1.5rem',
        fontFamily: 'var(--font-sans)',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Background Ambient Glow */}
      <div 
        style={{
          position: 'absolute',
          top: '20%',
          left: '50%',
          transform: 'translate(-50%, -20%)',
          width: '600px',
          height: '600px',
          background: 'radial-gradient(circle, rgba(212, 175, 55, 0.12) 0%, transparent 70%)',
          pointerEvents: 'none'
        }}
      />

      <div 
        style={{
          width: '100%',
          maxWidth: '480px',
          background: 'linear-gradient(165deg, rgba(22, 20, 32, 0.98) 0%, rgba(12, 12, 16, 0.99) 100%)',
          border: '1px solid var(--border-gold)',
          borderRadius: 'var(--radius-sm)',
          padding: 'clamp(1.75rem, 5vw, 3rem) clamp(1.25rem, 4vw, 2.5rem)',
          boxShadow: '0 25px 60px rgba(0,0,0,0.85), 0 0 35px rgba(212,175,55,0.18)',
          position: 'relative',
          zIndex: 2,
          backdropFilter: 'blur(16px)'
        }}
      >
        {/* Top Atelier Badge */}
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(212, 175, 55, 0.12)', border: '1px solid var(--border-gold)', padding: '5px 16px', borderRadius: 'var(--radius-full)', marginBottom: '1.25rem' }}>
            <Crown size={13} color="var(--gold-400)" />
            <span style={{ fontSize: '0.72rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--gold-300)', fontWeight: '700' }}>
              LUXE NIA UNIFIED ACCESS
            </span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.5rem' }}>
            <Logo size="md" />
          </div>

          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.6rem', color: 'var(--text-pure-white)', margin: '0.75rem 0 0.25rem' }}>
            Sign In to LUXE NIA
          </h1>
          <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.5 }}>
            Portal access for Atelier Administration and Concierge Services.
          </p>
        </div>

        {/* Error Notification */}
        {errorMsg && (
          <div 
            style={{
              background: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.4)',
              borderRadius: 'var(--radius-xs)',
              padding: '0.75rem 1rem',
              color: '#F87171',
              fontSize: '0.84rem',
              marginBottom: '1.5rem',
              textAlign: 'center'
            }}
          >
            {errorMsg}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {activeTab === 'register' && (
            <>
              <div className="form-group">
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--gold-300)', fontSize: '0.82rem' }}>
                  <User size={14} color="var(--gold-400)" />
                  <span>Full Name *</span>
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Vanessa Nyambura"
                  className="form-input"
                  style={{ height: '46px', fontSize: '0.9rem' }}
                />
              </div>

              <div className="form-group">
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--gold-300)', fontSize: '0.82rem' }}>
                  <Phone size={14} color="var(--gold-400)" />
                  <span>M-Pesa Phone Number</span>
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="07XX XXX XXX (for order delivery & M-Pesa)"
                  className="form-input"
                  style={{ height: '46px', fontSize: '0.9rem' }}
                />
              </div>
            </>
          )}

          <div className="form-group">
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--gold-300)', fontSize: '0.82rem' }}>
              <Mail size={14} color="var(--gold-400)" />
              <span>Email Address *</span>
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="client@luxenia.com or admin@luxenia.com"
              className="form-input"
              style={{ height: '46px', fontSize: '0.9rem' }}
            />
          </div>

          <div className="form-group">
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--gold-300)', fontSize: '0.82rem' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Lock size={14} color="var(--gold-400)" />
                <span>Password *</span>
              </span>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.76rem', display: 'flex', alignItems: 'center', gap: '4px' }}
              >
                {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
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
              style={{ height: '46px', fontSize: '0.9rem' }}
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-gold"
            style={{
              padding: '0.95rem 1.5rem',
              fontWeight: '700',
              fontSize: '0.88rem',
              letterSpacing: '0.08em',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              marginTop: '0.5rem'
            }}
          >
            {isSubmitting ? (
              <span>AUTHENTICATING...</span>
            ) : (
              <>
                <span>{activeTab === 'login' ? 'SIGN IN TO LUXE NIA' : 'CREATE CLIENT ACCOUNT'}</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        {/* Destination Information Note */}
        <div style={{ marginTop: '1.5rem', padding: '0.75rem', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 'var(--radius-xs)', fontSize: '0.74rem', color: 'var(--text-muted)', textAlign: 'center', lineHeight: '1.4' }}>
          <span>Admins are routed to the <strong>Atelier Dashboard</strong> • Clients are routed to <strong>My Purchases & Basket</strong></span>
        </div>

        {/* Bottom Security Info & Return Link */}
        <div style={{ marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', flexDirection: 'column', gap: '12px', textAlign: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '0.76rem', color: 'var(--text-muted)' }}>
            <ShieldCheck size={14} color="var(--gold-400)" />
            <span>256-Bit Encrypted Secure Session</span>
          </div>

          <Link
            to="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              color: 'var(--gold-300)',
              fontSize: '0.84rem',
              textDecoration: 'none',
              marginTop: '0.25rem'
            }}
          >
            <ArrowLeft size={14} />
            <span>Return to Boutique Storefront</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
