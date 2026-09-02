import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  ShoppingBag, 
  Trash2, 
  Plus, 
  Minus, 
  ShieldCheck, 
  Tag, 
  MessageCircle,
  ArrowLeft,
  ArrowRight,
  ExternalLink,
  Sparkles,
  Smartphone
} from 'lucide-react';
import { WhatsAppIcon } from '../common/SocialIcons';
import { useCart } from '../../context/CartContext';
import { useProducts } from '../../context/ProductContext';
import { useToast } from '../common/Toast';
import { getWhatsAppCartOrderUrl, OFFICIAL_DISPLAY_PHONE, OFFICIAL_LOCAL_PHONE } from '../../utils/whatsapp';

export default function CartPage() {
  const navigate = useNavigate();
  const { reduceStock } = useProducts();
  const {
    cart,
    totalItemCount,
    subtotalKes,
    discountAmountKes,
    promoCode,
    applyPromoCode,
    removePromoCode,
    updateQuantity,
    removeFromCart,
    clearCart,
    formatPrice
  } = useCart();

  const { addToast } = useToast();
  const [inputPromo, setInputPromo] = useState('');
  const [promoError, setPromoError] = useState('');

  // PRODUCT TOTAL = FINAL TOTAL (ZERO DELIVERY FEE)
  const grandTotalKes = Math.max(0, subtotalKes - discountAmountKes);

  const handleApplyPromo = (e) => {
    e.preventDefault();
    setPromoError('');
    if (!inputPromo.trim()) return;

    const res = applyPromoCode(inputPromo);
    if (res.success) {
      addToast(res.message, 'gold');
      setInputPromo('');
    } else {
      setPromoError(res.message);
    }
  };

  const handleOrderOnWhatsApp = () => {
    if (cart.length === 0) {
      addToast('Your shopping bag is empty.', 'info');
      return;
    }
    if (reduceStock) {
      reduceStock(cart);
    }
    const url = getWhatsAppCartOrderUrl(cart, grandTotalKes);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="cart-page" style={{ padding: '3.5rem 0 6rem', background: '#08080C', minHeight: '80vh' }}>
      <div className="luxe-container">
        {/* Header Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.4rem' }}>
              <Link to="/shop" style={{ color: 'var(--text-muted)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '4px', textDecoration: 'none' }}>
                <ArrowLeft size={14} /> Back to Atelier Collections
              </Link>
            </div>
            <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', color: 'var(--text-pure-white)', margin: 0 }}>
              Shopping Bag {totalItemCount > 0 ? `(${totalItemCount})` : ''}
            </h1>
          </div>

          {cart.length > 0 && (
            <button
              onClick={() => {
                clearCart();
                addToast('Shopping bag cleared.', 'info');
              }}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-muted)',
                fontSize: '0.82rem',
                cursor: 'pointer',
                textDecoration: 'underline'
              }}
            >
              Clear Shopping Bag
            </button>
          )}
        </div>

        {/* Empty State */}
        {cart.length === 0 ? (
          <div 
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-gold)',
              borderRadius: 'var(--radius-sm)',
              padding: '5rem 2rem',
              textAlign: 'center',
              maxWidth: '680px',
              margin: '2rem auto',
              boxShadow: 'var(--shadow-gold)'
            }}
          >
            <div 
              style={{
                width: '74px',
                height: '74px',
                borderRadius: '50%',
                background: 'rgba(212, 175, 55, 0.1)',
                border: '1px solid var(--border-gold)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.5rem',
                color: 'var(--gold-400)'
              }}
            >
              <ShoppingBag size={32} />
            </div>

            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.7rem', color: 'var(--text-pure-white)', marginBottom: '0.75rem' }}>
              Your bag is currently empty
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', maxWidth: '420px', margin: '0 auto 2rem', lineHeight: '1.7' }}>
              Discover our handcrafted Sovereign Baguettes in Noir Black, Sahara Mocha, and Ivory Pearl.
            </p>

            <Link to="/shop" className="btn-gold" style={{ padding: '0.95rem 2.5rem', textDecoration: 'none' }}>
              EXPLORE BAG COLLECTION
            </Link>
          </div>
        ) : (
          /* Active Cart Layout */
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: '2.5rem', alignItems: 'flex-start' }}>
            {/* Left Column: Cart Items List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {cart.map((item) => {
                const colorName = typeof item.selectedColor === 'object' ? item.selectedColor?.name : item.selectedColor || 'Noir Black';
                const itemSubtotal = (Number(item.priceKes) || 5800) * item.quantity;

                return (
                  <div 
                    key={item.itemKey}
                    style={{
                      background: 'var(--bg-card)',
                      border: '1px solid var(--border-gold)',
                      borderRadius: 'var(--radius-xs)',
                      padding: '1.5rem',
                      display: 'grid',
                      gridTemplateColumns: '100px 1fr auto',
                      gap: '1.5rem',
                      alignItems: 'center',
                      boxShadow: '0 8px 25px rgba(0,0,0,0.6)'
                    }}
                  >
                    {/* Item Image */}
                    <div style={{ width: '100px', height: '115px', borderRadius: 'var(--radius-xs)', overflow: 'hidden', background: '#000', border: '1px solid var(--border-subtle)' }}>
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </div>

                    {/* Item Details */}
                    <div>
                      <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--gold-400)', fontWeight: '700' }}>
                        {item.categoryName || 'Designer Bags'}
                      </span>
                      <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.15rem', color: 'var(--text-pure-white)', margin: '4px 0' }}>
                        {item.name}
                      </h3>
                      <div style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
                        Colorway: <strong style={{ color: 'var(--gold-300)' }}>{colorName}</strong>
                      </div>

                      {/* Quantity Stepper & Remove */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <div 
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            background: 'var(--bg-black)',
                            border: '1px solid var(--border-subtle)',
                            borderRadius: 'var(--radius-xs)',
                            overflow: 'hidden'
                          }}
                        >
                          <button
                            onClick={() => updateQuantity(item.itemKey, -1)}
                            style={{ padding: '6px 12px', color: 'var(--text-secondary)', cursor: 'pointer', background: 'none', border: 'none' }}
                            title="Decrease quantity"
                          >
                            <Minus size={14} />
                          </button>
                          <span style={{ padding: '0 10px', fontSize: '0.9rem', fontWeight: '700', color: 'var(--text-pure-white)' }}>
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.itemKey, 1)}
                            style={{ padding: '6px 12px', color: 'var(--text-secondary)', cursor: 'pointer', background: 'none', border: 'none' }}
                            title="Increase quantity"
                          >
                            <Plus size={14} />
                          </button>
                        </div>

                        <button
                          onClick={() => {
                            removeFromCart(item.itemKey);
                            addToast(`Removed "${item.name}" from bag.`, 'info');
                          }}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            color: 'var(--text-muted)',
                            fontSize: '0.78rem',
                            cursor: 'pointer',
                            background: 'none',
                            border: 'none'
                          }}
                        >
                          <Trash2 size={14} /> Remove
                        </button>
                      </div>
                    </div>

                    {/* Subtotal */}
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ display: 'block', fontSize: '0.74rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Subtotal</span>
                      <span style={{ fontFamily: 'var(--font-serif)', fontSize: '1.3rem', fontWeight: '800', color: 'var(--gold-300)' }}>
                        {formatPrice(itemSubtotal)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Right Column: Order Summary & WhatsApp Ordering */}
            <div 
              style={{
                background: 'linear-gradient(160deg, #13121C 0%, #0A0A0E 100%)',
                border: '1px solid var(--border-gold)',
                borderRadius: 'var(--radius-xs)',
                padding: '2rem',
                position: 'sticky',
                top: '100px',
                boxShadow: '0 15px 40px rgba(0,0,0,0.7)'
              }}
            >
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.35rem', color: 'var(--text-pure-white)', marginBottom: '1.25rem' }}>
                Order Summary
              </h3>

              {/* Promo Code Box */}
              <div style={{ marginBottom: '1.5rem' }}>
                {promoCode ? (
                  <div 
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      background: 'rgba(212, 175, 55, 0.1)',
                      border: '1px solid var(--border-gold)',
                      padding: '0.65rem 0.9rem',
                      borderRadius: 'var(--radius-xs)',
                      fontSize: '0.82rem'
                    }}
                  >
                    <span style={{ color: 'var(--gold-300)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Tag size={14} /> Promo: <strong>{promoCode}</strong>
                    </span>
                    <button 
                      onClick={removePromoCode}
                      style={{ color: 'var(--text-muted)', fontSize: '0.75rem', textDecoration: 'underline', background: 'none', border: 'none', cursor: 'pointer' }}
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyPromo} style={{ display: 'flex', gap: '8px' }}>
                    <input
                      type="text"
                      placeholder="Promo Code (e.g. LUXE10)"
                      value={inputPromo}
                      onChange={(e) => setInputPromo(e.target.value)}
                      className="form-input"
                      style={{ flex: 1, padding: '0.6rem 0.85rem', fontSize: '0.84rem' }}
                    />
                    <button type="submit" className="btn-dark" style={{ padding: '0.6rem 1rem', fontSize: '0.8rem' }}>
                      Apply
                    </button>
                  </form>
                )}
                {promoError && (
                  <span style={{ color: '#FFA3A3', fontSize: '0.74rem', marginTop: '4px', display: 'block' }}>
                    {promoError}
                  </span>
                )}
              </div>

              {/* Pricing Totals */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.9rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '1.25rem', marginBottom: '1.75rem' }}>
                {discountAmountKes > 0 && (
                  <>
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                      <span>Subtotal</span>
                      <span>{formatPrice(subtotalKes)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--gold-300)' }}>
                      <span>Discount</span>
                      <span>- {formatPrice(discountAmountKes)}</span>
                    </div>
                  </>
                )}

                <div 
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'baseline',
                    borderTop: discountAmountKes > 0 ? '1px solid var(--border-gold)' : 'none',
                    paddingTop: discountAmountKes > 0 ? '0.75rem' : 0,
                    fontFamily: 'var(--font-serif)',
                    fontSize: '1.4rem',
                    fontWeight: '800',
                    color: 'var(--text-pure-white)'
                  }}
                >
                  <span>Total Amount:</span>
                  <span style={{ color: 'var(--gold-300)' }}>{formatPrice(grandTotalKes)}</span>
                </div>

                <span style={{ fontSize: '0.74rem', color: '#34D399', display: 'flex', alignItems: 'center', gap: '5px', marginTop: '4px' }}>
                  <Sparkles size={12} /> Complimentary Courier Delivery Across Kenya Included
                </span>
              </div>

              {/* PRIMARY ACTION: ORDER ON WHATSAPP */}
              <button
                onClick={handleOrderOnWhatsApp}
                style={{
                  width: '100%',
                  padding: '1.15rem 1.5rem',
                  fontSize: '0.95rem',
                  fontWeight: '800',
                  letterSpacing: '0.12em',
                  background: 'linear-gradient(135deg, #1b3824 0%, #128C7E 50%, #25D366 100%)',
                  border: '1px solid #25D366',
                  borderRadius: 'var(--radius-xs)',
                  color: '#fff',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  boxShadow: '0 8px 30px rgba(37,211,102,0.4), 0 0 15px rgba(212,175,55,0.2)',
                  transition: 'all 0.3s ease',
                  marginBottom: '1rem'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 12px 35px rgba(37,211,102,0.5), 0 0 20px rgba(212,175,55,0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 8px 30px rgba(37,211,102,0.4), 0 0 15px rgba(212,175,55,0.2)';
                }}
              >
                <WhatsAppIcon size={20} color="#fff" />
                <span>ORDER ON WHATSAPP</span>
                <ExternalLink size={15} />
              </button>

              {/* Order Flow Guarantee Notice */}
              <div 
                style={{ 
                  background: 'rgba(0,0,0,0.3)', 
                  border: '1px solid var(--border-subtle)', 
                  borderRadius: 'var(--radius-xs)', 
                  padding: '0.95rem', 
                  textAlign: 'center',
                  fontSize: '0.8rem', 
                  color: 'var(--text-muted)',
                  lineHeight: '1.5'
                }}
              >
                <div style={{ color: 'var(--gold-300)', fontWeight: '700', marginBottom: '4px' }}>
                  Direct Atelier WhatsApp: {OFFICIAL_DISPLAY_PHONE}
                </div>
                <span>Your full bag details & quantities will be pre-filled automatically in WhatsApp to finalize payment and courier dispatch directly with our team.</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
