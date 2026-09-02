import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Lock, Mail, Key, ShieldCheck, ArrowRight, Crown, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import Logo from '../common/Logo';

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated } = useAdminAuth();

  const [email, setEmail] = useState('admin@luxenia.com');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const from = location.state?.from?.pathname || '/admin';

  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  const handleLogin = async (e) => {
    if (e) e.preventDefault();
    setErrorMsg('');
    setIsSubmitting(true);

    const res = await login(email, password);
    setIsSubmitting(false);

    if (res.success) {
      navigate(from, { replace: true });
    } else {
      setErrorMsg(res.error || 'Invalid administrator credentials. Access restricted.');
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
          background: 'linear-gradient(165deg, rgba(22, 20, 32, 0.96) 0%, rgba(12, 12, 16, 0.99) 100%)',
          border: '1px solid var(--border-gold)',
          borderRadius: 'var(--radius-sm)',
          padding: '3rem 2.5rem',
          boxShadow: '0 25px 60px rgba(0,0,0,0.85), 0 0 35px rgba(212,175,55,0.18)',
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
              LUXE NIA ATELIER MANAGEMENT
            </span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.5rem' }}>
            <Logo size="md" />
          </div>

          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.6rem', color: 'var(--text-pure-white)', margin: '0.75rem 0 0.25rem' }}>
            Private Admin Login
          </h1>
          <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.5 }}>
            Authorized portal to manage handbag catalogs, stock levels, orders, and atelier settings.
          </p>
        </div>

        {/* Error Alert */}
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
        <form onSubmit={handleLogin}>
          <div className="form-group" style={{ marginBottom: '1.25rem' }}>
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--gold-300)', fontSize: '0.84rem' }}>
              <Mail size={14} color="var(--gold-400)" />
              <span>Email / Username</span>
            </label>
            <input 
              type="text"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@luxenia.com"
              className="form-input"
              style={{ height: '48px', fontSize: '0.9rem' }}
            />
          </div>

          <div className="form-group" style={{ marginBottom: '1.75rem' }}>
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--gold-300)', fontSize: '0.84rem' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Key size={14} color="var(--gold-400)" />
                <span>Password</span>
              </span>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px' }}
              >
                {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                <span>{showPassword ? 'Hide' : 'Show'}</span>
              </button>
            </label>
            <div style={{ position: 'relative' }}>
              <input 
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="form-input"
                style={{ height: '48px', fontSize: '0.9rem', paddingRight: '45px' }}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-gold"
            style={{
              width: '100%',
              padding: '1rem',
              fontSize: '0.92rem',
              letterSpacing: '0.12em',
              fontWeight: '700',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
              opacity: isSubmitting ? 0.75 : 1,
              boxShadow: '0 4px 20px rgba(212,175,55,0.3)'
            }}
          >
            {isSubmitting ? (
              <span>AUTHENTICATING...</span>
            ) : (
              <>
                <span>ENTER ADMIN DASHBOARD</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        {/* Bottom Security Info */}
        <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', flexDirection: 'column', gap: '12px', textAlign: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '0.76rem', color: 'var(--text-muted)' }}>
            <ShieldCheck size={14} color="var(--gold-400)" />
            <span>256-Bit Encrypted Secure Administrator Session</span>
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
            <span>Return to Customer Storefront</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
