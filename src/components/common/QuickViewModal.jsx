import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Star, Check, ShoppingBag, ArrowRight, ExternalLink } from 'lucide-react';
import { WhatsAppIcon } from './SocialIcons';
import { useCart } from '../../context/CartContext';
import { useProducts } from '../../context/ProductContext';
import { useToast } from './Toast';
import { useWhatsAppOrder } from '../../context/WhatsAppOrderContext';
import { getWhatsAppProductOrderUrl, OFFICIAL_DISPLAY_PHONE } from '../../utils/whatsapp';

export default function QuickViewModal({ product, isOpen, onClose }) {
  const navigate = useNavigate();
  const { reduceStock } = useProducts();
  const { addToCart, formatPrice } = useCart();
  const { addToast } = useToast();
  const { openWhatsAppOrder } = useWhatsAppOrder();

  const [selectedSize, setSelectedSize] = useState(product?.sizes?.[0] || 'Classic Baguette (28cm)');
  const [selectedColor, setSelectedColor] = useState(product?.colors?.[0] || null);
  const [activeImage, setActiveImage] = useState(product?.image || null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (product) {
      setSelectedSize(product.sizes?.[0] || 'Classic Baguette (28cm)');
      setSelectedColor(product.colors?.[0] || null);
      setActiveImage(product.image || null);
      setQuantity(1);
    }
  }, [product?.id]);

  if (!isOpen || !product) return null;

  const isOutOfStock = Number(product.stock) <= 0 || product.status === 'out_of_stock';

  const handleAddToCart = () => {
    if (isOutOfStock) {
      addToast(`"${product.name}" is currently out of stock.`, 'error');
      return;
    }
    addToCart({ ...product, image: activeImage || product.image }, selectedSize, selectedColor, quantity);
    addToast(`Added "${product.name}" to your shopping bag.`, 'gold');
    onClose();
  };

  const handleOrderOnWhatsApp = () => {
    if (isOutOfStock) {
      const url = `https://wa.me/254795439545?text=${encodeURIComponent(`Hello LUXE NIA, I would like to inquire about restock timing for: ${product.name}`)}`;
      window.open(url, '_blank', 'noopener,noreferrer');
      onClose();
      return;
    }
    openWhatsAppOrder({
      bagName: product.name,
      quantity,
      bagPrice: product.priceKes,
      totalPrice: (Number(product.priceKes) || 5800) * quantity,
      image: activeImage || product.image
    });
    onClose();
  };

  const handleFullDetail = () => {
    onClose();
    navigate(`/product/${product.id}`);
  };

  return (
    <div className="modal-backdrop open" onClick={onClose}>
      <div 
        className="luxe-modal" 
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '820px', padding: 0, overflow: 'hidden' }}
      >
        <button className="modal-close-btn" onClick={onClose} style={{ zIndex: 10 }} aria-label="Close preview">
          <X size={18} />
        </button>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', minHeight: '480px' }}>
          {/* Left Media Column */}
          <div style={{ background: '#07070A', position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <img 
              src={activeImage || product.image} 
              alt={product.name} 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
            />

            {/* Badges */}
            <div style={{ position: 'absolute', top: '16px', left: '16px', zIndex: 2 }}>
              <span className="badge-new">Atelier Drop</span>
            </div>

            {/* Micro Gallery Bar */}
            {product.gallery && product.gallery.length > 1 && (
              <div style={{ position: 'absolute', bottom: '12px', display: 'flex', gap: '6px', zIndex: 2, background: 'rgba(0,0,0,0.6)', padding: '4px 8px', borderRadius: '20px', backdropFilter: 'blur(6px)' }}>
                {product.gallery.map((imgUrl, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(imgUrl)}
                    style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      overflow: 'hidden',
                      border: (activeImage || product.image) === imgUrl ? '2px solid var(--gold-400)' : '1px solid rgba(255,255,255,0.3)',
                      padding: 0,
                      cursor: 'pointer'
                    }}
                  >
                    <img src={imgUrl} alt={`Thumbnail ${idx}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Product Details Column */}
          <div style={{ padding: '2.25rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', background: 'var(--bg-deep)' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                <span style={{ fontSize: '0.74rem', textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--gold-400)' }}>
                  {product.categoryName} • {product.sku}
                </span>

                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', color: 'var(--gold-300)' }}>
                  <Star size={14} fill="var(--gold-400)" color="var(--gold-400)" />
                  <span style={{ fontWeight: '600' }}>{product.rating}</span>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.72rem' }}>({product.reviewCount})</span>
                </div>
              </div>

              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.35rem', color: 'var(--text-pure-white)', marginBottom: '0.35rem' }}>
                {product.name}
              </h3>

              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
                {product.subtitle}
              </p>

              {/* Price */}
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: '10px', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--gold-300)', fontFamily: 'var(--font-serif)' }}>
                  {formatPrice(product.priceKes, product.priceUsd)}
                </span>
                {!isOutOfStock ? (
                  <span style={{ fontSize: '0.78rem', color: '#10B981', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: '700' }}>
                    <Check size={14} /> In Stock ({product.stock})
                  </span>
                ) : (
                  <span style={{ fontSize: '0.76rem', color: '#EF4444', fontWeight: '700', background: 'rgba(239, 68, 68, 0.15)', padding: '2px 8px', borderRadius: '4px', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
                    ✕ Out of Stock
                  </span>
                )}
              </div>

              {/* Color Select */}
              {product.colors && product.colors.length > 0 && (
                <div style={{ marginBottom: '1.25rem' }}>
                  <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-secondary)', letterSpacing: '0.05em', display: 'block', marginBottom: '0.5rem' }}>
                    Colorway: <strong style={{ color: 'var(--text-primary)' }}>{selectedColor?.name || 'Standard'}</strong>
                  </span>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {product.colors.map(col => (
                      <button
                        key={col.name}
                        onClick={() => {
                          setSelectedColor(col);
                          if (col.image) setActiveImage(col.image);
                        }}
                        title={col.name}
                        style={{
                          width: '28px',
                          height: '28px',
                          borderRadius: '50%',
                          backgroundColor: col.hex,
                          border: selectedColor?.name === col.name ? '2px solid var(--gold-300)' : '1px solid rgba(255,255,255,0.2)',
                          boxShadow: selectedColor?.name === col.name ? '0 0 10px rgba(212,175,55,0.6)' : 'none',
                          cursor: 'pointer'
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div>
              {/* PRIMARY ACTION: ORDER ON WHATSAPP */}
              {!isOutOfStock ? (
                <button
                  onClick={handleOrderOnWhatsApp}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    padding: '0.85rem 1rem',
                    background: 'linear-gradient(135deg, #1b3824 0%, #128C7E 50%, #25D366 100%)',
                    border: '1px solid #25D366',
                    borderRadius: 'var(--radius-xs)',
                    color: '#fff',
                    fontSize: '0.86rem',
                    fontWeight: '800',
                    letterSpacing: '0.08em',
                    cursor: 'pointer',
                    marginBottom: '0.65rem',
                    boxShadow: '0 4px 18px rgba(37,211,102,0.35)',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <WhatsAppIcon size={17} color="#fff" />
                  <span>ORDER ON WHATSAPP</span>
                </button>
              ) : (
                <button
                  onClick={handleOrderOnWhatsApp}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    padding: '0.85rem 1rem',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-xs)',
                    color: 'var(--text-muted)',
                    fontSize: '0.84rem',
                    fontWeight: '700',
                    letterSpacing: '0.05em',
                    cursor: 'pointer',
                    marginBottom: '0.65rem'
                  }}
                >
                  <WhatsAppIcon size={17} color="var(--text-muted)" />
                  <span>INQUIRE RE-STOCK / SOLD OUT</span>
                </button>
              )}

              {/* Secondary: Add to bag */}
              <button
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className="btn-gold-outline"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  marginBottom: '0.75rem',
                  fontSize: '0.82rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  opacity: isOutOfStock ? 0.45 : 1,
                  cursor: isOutOfStock ? 'not-allowed' : 'pointer'
                }}
              >
                <ShoppingBag size={15} />
                <span>{isOutOfStock ? 'Out of Stock' : 'Add To Shopping Bag'}</span>
              </button>

              <button
                onClick={handleFullDetail}
                style={{
                  width: '100%',
                  textAlign: 'center',
                  fontSize: '0.78rem',
                  color: 'var(--gold-400)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '5px',
                  padding: '0.3rem',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                <span>View Full Product Dossier</span>
                <ArrowRight size={13} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
