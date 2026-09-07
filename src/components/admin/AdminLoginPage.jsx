import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Lock, Mail, ShieldCheck, ArrowRight, Crown, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { useTheme } from '../../context/ThemeContext';
import Logo from '../common/Logo';

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated } = useAdminAuth();
  const { isDarkMode, toggleTheme } = useTheme();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const rawFrom = location.state?.from?.pathname;
  const redirectTarget = (rawFrom && rawFrom !== '/admin' && rawFrom !== '/admin/' && rawFrom !== '/admin-login' && rawFrom !== '/ceo') 
    ? rawFrom 
    : '/admin/dashboard';

  useEffect(() => {
    if (isAuthenticated) {
      navigate(redirectTarget, { replace: true });
    }
  }, [isAuthenticated, navigate, redirectTarget]);

  const handleLogin = async (e) => {
    if (e) e.preventDefault();
    setErrorMsg('');
    setIsSubmitting(true);

    const cleanEmail = (email || '').trim().toLowerCase();
    const cleanPass = (password || '').trim();

    if (!cleanEmail || !cleanPass) {
      setErrorMsg('Please enter both your CEO email and password.');
      setIsSubmitting(false);
      return;
    }

    const res = await login(cleanEmail, cleanPass);
    setIsSubmitting(false);

    if (res.success) {
      navigate(redirectTarget, { replace: true });
    } else {
      setErrorMsg(res.error || 'Access restricted: Invalid CEO / Administrator credentials.');
    }
  };

  return (
    <div 
      className="admin-login-page"
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: isDarkMode 
          ? 'radial-gradient(ellipse at 50% 30%, #171424 0%, #0c0c12 60%, #050508 100%)' 
          : 'radial-gradient(ellipse at 50% 30%, #FFFFFF 0%, #F5F0E8 60%, #EAE4D8 100%)',
        padding: '2.5rem 1.5rem',
        fontFamily: 'var(--font-sans)',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Top Right Theme Toggle */}
      <div style={{ position: 'absolute', top: '24px', right: '24px', zIndex: 20 }}>
        <button
          onClick={toggleTheme}
          className="theme-toggle-btn"
          title={isDarkMode ? 'Switch to Light Mode (☀️)' : 'Switch to Dark Mode (🌙)'}
          aria-label={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          id="admin-login-theme-toggle"
          style={{
            background: isDarkMode ? 'rgba(212, 175, 55, 0.12)' : 'rgba(196, 152, 38, 0.15)',
            border: '1px solid var(--border-gold)',
            color: 'var(--gold-400)'
          }}
        >
          <span style={{ fontSize: '1.05rem', lineHeight: 1 }}>{isDarkMode ? '☀️' : '🌙'}</span>
        </button>
      </div>

      {/* Background Ambient Gold Glow */}
      <div 
        style={{
          position: 'absolute',
          top: '20%',
          left: '50%',
          transform: 'translate(-50%, -20%)',
          width: '600px',
          height: '600px',
          background: isDarkMode 
            ? 'radial-gradient(circle, rgba(212, 175, 55, 0.12) 0%, transparent 70%)' 
            : 'radial-gradient(circle, rgba(196, 152, 38, 0.1) 0%, transparent 70%)',
          pointerEvents: 'none'
        }}
      />

      <div 
        className="admin-login-card"
        style={{
          width: '100%',
          maxWidth: '460px',
          background: isDarkMode 
            ? 'linear-gradient(165deg, rgba(22, 20, 32, 0.98) 0%, rgba(12, 12, 16, 0.99) 100%)' 
            : '#FFFFFF',
          border: '1px solid var(--border-gold)',
          borderRadius: 'var(--radius-sm)',
          padding: 'clamp(2rem, 5vw, 3rem) clamp(1.5rem, 4vw, 2.5rem)',
          boxShadow: isDarkMode 
            ? '0 25px 60px rgba(0,0,0,0.85), 0 0 35px rgba(212,175,55,0.18)' 
            : '0 20px 50px rgba(30,25,20,0.1), 0 0 30px rgba(196,152,38,0.15)',
          position: 'relative',
          zIndex: 2,
          backdropFilter: 'blur(16px)'
        }}
      >
        {/* Top Atelier Badge */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(212, 175, 55, 0.12)', border: '1px solid var(--border-gold)', padding: '5px 16px', borderRadius: 'var(--radius-full)', marginBottom: '1.25rem' }}>
            <Crown size={13} color="var(--gold-400)" />
            <span style={{ fontSize: '0.72rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--gold-300)', fontWeight: '700' }}>
              LUXE NIA CEO & ATELIER SUITE
            </span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.5rem' }}>
            <Logo size="md" />
          </div>

          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.65rem', color: 'var(--text-pure-white)', margin: '0.75rem 0 0.25rem' }}>
            CEO / Admin Sign In
          </h1>
          <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.5 }}>
            Secure executive portal to manage handbag collections, stock inventory, and orders.
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

        {/* Login Form */}
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="form-group">
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--gold-300)', fontSize: '0.82rem' }}>
              <Mail size={14} color="var(--gold-400)" />
              <span>CEO Email Address</span>
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter CEO Email Address"
              className="form-input"
              style={{ height: '46px', fontSize: '0.9rem' }}
            />
          </div>

          <div className="form-group">
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--gold-300)', fontSize: '0.82rem' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Lock size={14} color="var(--gold-400)" />
                <span>Executive Password</span>
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
              placeholder="••••••••"
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
                <span>ENTER CEO DASHBOARD</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        {/* Bottom Security Info & Return Link */}
        <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', flexDirection: 'column', gap: '12px', textAlign: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '0.76rem', color: 'var(--text-muted)' }}>
            <ShieldCheck size={14} color="var(--gold-400)" />
            <span>256-Bit Encrypted Secure CEO Session</span>
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
