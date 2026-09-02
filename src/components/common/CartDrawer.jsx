import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, ShieldCheck, Tag, ExternalLink } from 'lucide-react';
import { WhatsAppIcon } from './SocialIcons';
import { useCart } from '../../context/CartContext';
import { useProducts } from '../../context/ProductContext';
import { useToast } from './Toast';
import { getWhatsAppCartOrderUrl, OFFICIAL_DISPLAY_PHONE } from '../../utils/whatsapp';

export default function CartDrawer() {
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
    isCartOpen,
    closeCart,
    updateQuantity,
    removeFromCart,
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
      addToast('Your shopping bag is empty. Explore our collections.', 'gold');
      return;
    }
    if (reduceStock) {
      reduceStock(cart);
    }
    const url = getWhatsAppCartOrderUrl(cart, grandTotalKes);
    window.open(url, '_blank', 'noopener,noreferrer');
    closeCart();
  };

  return (
    <>
      <div 
        className={`drawer-backdrop ${isCartOpen ? 'open' : ''}`} 
        onClick={closeCart} 
      />
      
      <div className={`cart-drawer ${isCartOpen ? 'open' : ''}`}>
        {/* Header */}
        <div className="drawer-header">
          <div className="drawer-title">
            <ShoppingBag size={20} color="var(--gold-400)" />
            <span>Shopping Bag ({totalItemCount})</span>
          </div>
          <button className="drawer-close-btn" onClick={closeCart} title="Close bag">
            <X size={20} />
          </button>
        </div>

        {/* Item List */}
        <div className="cart-items-list">
          {cart.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem 1rem', color: 'var(--text-muted)' }}>
              <div 
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-gold)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1.5rem',
                  color: 'var(--gold-400)'
                }}
              >
                <ShoppingBag size={28} />
              </div>
              <h4 style={{ fontFamily: 'var(--font-serif)', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                Your Bag is Empty
              </h4>
              <p style={{ fontSize: '0.86rem', maxWidth: '280px', margin: '0 auto 1.5rem' }}>
                Discover our handcrafted Sovereign Baguette luxury pieces.
              </p>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.itemKey} className="cart-item">
                <div className="cart-item-image">
                  <img src={item.image} alt={item.name} />
                </div>

                <div className="cart-item-info">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <h4 className="cart-item-title">{item.name}</h4>
                      <div className="cart-item-meta">
                        Color: {typeof item.selectedColor === 'object' ? item.selectedColor?.name : item.selectedColor}
                      </div>
                    </div>
                    <button 
                      onClick={() => removeFromCart(item.itemKey)}
                      className="cart-item-remove"
                      title="Remove item"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>

                  <div className="cart-item-price">
                    {formatPrice(item.priceKes, item.priceUsd)}
                  </div>

                  <div 
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      background: 'var(--bg-black)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-xs)',
                      overflow: 'hidden'
                    }}
                  >
                    <button
                      onClick={() => updateQuantity(item.itemKey, -1)}
                      style={{ padding: '4px 8px', color: 'var(--text-secondary)', cursor: 'pointer', background: 'none', border: 'none' }}
                    >
                      <Minus size={12} />
                    </button>
                    <span style={{ padding: '0 6px', fontSize: '0.8rem', fontWeight: '600' }}>
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.itemKey, 1)}
                      style={{ padding: '4px 8px', color: 'var(--text-secondary)', cursor: 'pointer', background: 'none', border: 'none' }}
                    >
                      <Plus size={12} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer with Calculations & Checkout */}
        {cart.length > 0 && (
          <div className="cart-drawer-footer">
            {/* Promo Code Input */}
            <div>
              {promoCode ? (
                <div 
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    background: 'rgba(212, 175, 55, 0.1)',
                    border: '1px solid var(--border-gold)',
                    padding: '0.5rem 0.8rem',
                    borderRadius: 'var(--radius-xs)',
                    fontSize: '0.8rem'
                  }}
                >
                  <span style={{ color: 'var(--gold-300)', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <Tag size={14} /> Code Applied: <strong>{promoCode}</strong>
                  </span>
                  <button 
                    onClick={removePromoCode}
                    style={{ color: 'var(--text-muted)', fontSize: '0.75rem', textDecoration: 'underline', cursor: 'pointer', background: 'none', border: 'none' }}
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
                    style={{ flex: 1, padding: '0.55rem 0.8rem', fontSize: '0.82rem' }}
                  />
                  <button type="submit" className="btn-dark" style={{ padding: '0.55rem 1rem', fontSize: '0.78rem' }}>
                    Apply
                  </button>
                </form>
              )}
              {promoError && (
                <span style={{ color: '#FFA3A3', fontSize: '0.72rem', marginTop: '4px', display: 'block' }}>
                  {promoError}
                </span>
              )}
            </div>

            {/* Calculations: Subtotal = Total (ZERO DELIVERY FEE) */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.85rem' }}>
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
                  paddingTop: discountAmountKes > 0 ? '0.4rem' : 0,
                  borderTop: discountAmountKes > 0 ? '1px solid var(--border-subtle)' : 'none',
                  fontFamily: 'var(--font-serif)',
                  fontWeight: '700',
                  fontSize: '1.15rem',
                  color: 'var(--text-pure-white)'
                }}
              >
                <span>Total:</span>
                <span style={{ color: 'var(--gold-300)' }}>{formatPrice(grandTotalKes)}</span>
              </div>
            </div>

            {/* PRIMARY BUTTON: ORDER ON WHATSAPP */}
            <button
              onClick={handleOrderOnWhatsApp}
              style={{
                width: '100%',
                padding: '0.95rem 1.25rem',
                fontSize: '0.88rem',
                fontWeight: '800',
                letterSpacing: '0.1em',
                background: 'linear-gradient(135deg, #1b3824 0%, #128C7E 50%, #25D366 100%)',
                border: '1px solid #25D366',
                borderRadius: 'var(--radius-xs)',
                color: '#fff',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 6px 20px rgba(37,211,102,0.35)',
                marginBottom: '0.6rem',
                transition: 'all 0.2s ease'
              }}
            >
              <WhatsAppIcon size={18} color="#fff" />
              <span>ORDER ON WHATSAPP</span>
              <ExternalLink size={14} />
            </button>

            {/* Secondary: View Full Cart Page */}
            <button
              onClick={() => {
                closeCart();
                navigate('/cart');
              }}
              className="btn-dark"
              style={{ width: '100%', padding: '0.75rem', fontSize: '0.82rem', marginBottom: '0.75rem' }}
            >
              View Full Bag
            </button>

            <div style={{ textAlign: 'center', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
              Direct Concierge WhatsApp: {OFFICIAL_DISPLAY_PHONE}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
