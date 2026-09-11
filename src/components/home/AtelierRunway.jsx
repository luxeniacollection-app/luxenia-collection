import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ShoppingBag, 
  Crown, 
  Sparkles, 
  ArrowRight, 
  Eye, 
  ShieldCheck, 
  Check, 
  Sparkle
} from 'lucide-react';
import { WhatsAppIcon } from '../common/SocialIcons';
import { useCart } from '../../context/CartContext';
import { useProducts } from '../../context/ProductContext';
import { useToast } from '../common/Toast';
import { useWhatsAppOrder } from '../../context/WhatsAppOrderContext';
import { initialProducts } from '../../data/products';

export default function AtelierRunway({ onOpenMonogramStudio, onOpenCertificate }) {
  const navigate = useNavigate();
  const { products: contextProducts } = useProducts();
  const { addToCart, formatPrice } = useCart();
  const { addToast } = useToast();
  const { openWhatsAppOrder } = useWhatsAppOrder();

  const products = (Array.isArray(contextProducts) && contextProducts.length > 0)
    ? contextProducts
    : initialProducts;

  const [activeSilhouette, setActiveSilhouette] = useState('all');
  // Store dynamic active color/image per product card
  const [activeColorMap, setActiveColorMap] = useState({});

  const filterOptions = [
    { id: 'all', label: 'All Silhouettes' },
    { id: 'baguette', label: 'The Baguette Flap' },
    { id: 'satchel', label: 'The Grand Satchel' },
    { id: 'tote', label: 'The Carryall Tote' }
  ];

  const filteredProducts = products.filter(p => {
    if (activeSilhouette === 'all') return true;
    if (activeSilhouette === 'baguette') return p.name.toLowerCase().includes('baguette');
    if (activeSilhouette === 'satchel') return p.name.toLowerCase().includes('satchel');
    if (activeSilhouette === 'tote') return p.name.toLowerCase().includes('carryall') || p.name.toLowerCase().includes('tote');
    return true;
  });

  const handleSelectColor = (productId, colorObj) => {
    setActiveColorMap(prev => ({
      ...prev,
      [productId]: colorObj
    }));
  };

  const handleQuickAdd = (product) => {
    const isOutOfStock = Number(product.stock) <= 0 || product.status === 'out_of_stock';
    if (isOutOfStock) {
      addToast(`"${product.name}" is currently out of stock.`, 'error');
      return;
    }
    const chosenColor = activeColorMap[product.id] || product.colors?.[0] || null;
    addToCart(
      { ...product, image: chosenColor?.image || product.image },
      product.sizes?.[0] || 'Classic Size',
      chosenColor,
      1
    );
    addToast(`Added "${product.name}" to your shopping bag.`, 'gold');
  };

  return (
    <section 
      className="atelier-runway-section"
      style={{
        padding: '7.5rem 1.5rem 6.5rem',
        background: 'radial-gradient(ellipse at 50% 10%, rgba(22, 19, 32, 0.7) 0%, rgba(10, 9, 15, 0.95) 65%, #07060A 100%)',
        position: 'relative',
        borderBottom: '1px solid rgba(212, 175, 55, 0.2)'
      }}
    >
      <div className="luxe-container" style={{ maxWidth: '1300px', margin: '0 auto' }}>
        {/* Editorial Runway Header */}
        <div style={{ textAlign: 'center', maxWidth: '820px', margin: '0 auto 3.5rem' }}>
          <div 
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: 'rgba(212, 175, 55, 0.08)',
              border: '1px solid rgba(212, 175, 55, 0.35)',
              padding: '0.4rem 1.35rem',
              borderRadius: 'var(--radius-full)',
              marginBottom: '1.25rem'
            }}
          >
            <Crown size={14} color="var(--gold-400)" />
            <span style={{ fontSize: '0.74rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--gold-300)', fontWeight: '700' }}>
              FEATURED HANDBAG COLLECTION
            </span>
          </div>

          <h2 
            style={{ 
              fontFamily: 'var(--font-serif)', 
              fontSize: 'clamp(2.4rem, 5vw, 3.8rem)', 
              color: 'var(--text-pure-white)', 
              fontWeight: '700',
              letterSpacing: '0.04em',
              lineHeight: 1.15
            }}
          >
            Signature Silhouettes
          </h2>

          <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', marginTop: '1rem', lineHeight: '1.8' }}>
            Direct from our Nairobi atelier. Sculpted from full-grain calfskin with antique gold fixtures and complimentary personal monogramming.
          </p>

          {/* Silhouette Filter Buttons */}
          <div 
            style={{
              display: 'inline-flex',
              gap: '8px',
              marginTop: '2.5rem',
              background: 'rgba(15, 13, 22, 0.8)',
              padding: '6px',
              borderRadius: 'var(--radius-full)',
              border: '1px solid var(--border-gold)',
              flexWrap: 'wrap',
              justifyContent: 'center'
            }}
          >
            {filterOptions.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveSilhouette(tab.id)}
                style={{
                  padding: '0.55rem 1.4rem',
                  borderRadius: 'var(--radius-full)',
                  background: activeSilhouette === tab.id ? 'var(--gold-gradient)' : 'transparent',
                  color: activeSilhouette === tab.id ? '#08070E' : 'var(--text-secondary)',
                  fontWeight: activeSilhouette === tab.id ? '800' : '600',
                  fontSize: '0.78rem',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.25s ease'
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Runway Product Showcase Cards Grid */}
        <div 
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
            gap: '2.5rem'
          }}
          className="runway-grid"
        >
          {filteredProducts.map(product => {
            const activeColor = activeColorMap[product.id] || product.colors?.[0] || null;
            const currentImg = activeColor?.image || product.image;
            const isOutOfStock = Number(product.stock) <= 0 || product.status === 'out_of_stock';

            return (
              <div 
                key={product.id}
                className="runway-card product-card"
                style={{
                  background: 'linear-gradient(165deg, rgba(22, 19, 32, 0.85) 0%, rgba(11, 10, 16, 0.95) 100%)',
                  border: '1px solid rgba(212, 175, 55, 0.35)',
                  borderRadius: 'var(--radius-xs)',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative',
                  boxShadow: '0 15px 40px rgba(0,0,0,0.6)',
                  transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)'
                }}
              >
                {/* Image Stage */}
                <div 
                  style={{
                    position: 'relative',
                    aspectRatio: '4/4.8',
                    overflow: 'hidden',
                    background: '#0c0b12',
                    cursor: 'pointer'
                  }}
                  onClick={() => navigate(`/product/${product.id}`)}
                >
                  <img 
                    src={currentImg} 
                    alt={product.name}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transition: 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)'
                    }}
                    className="runway-img"
                  />

                  {/* Top Badges */}
                  <div style={{ position: 'absolute', top: '14px', left: '14px', display: 'flex', flexDirection: 'column', gap: '6px', zIndex: 2 }}>
                    <span 
                      style={{
                        background: 'rgba(8, 7, 12, 0.85)',
                        border: '1px solid var(--border-gold)',
                        color: 'var(--gold-300)',
                        fontSize: '0.68rem',
                        fontWeight: '700',
                        letterSpacing: '0.12em',
                        textTransform: 'uppercase',
                        padding: '4px 10px',
                        borderRadius: 'var(--radius-xs)',
                        backdropFilter: 'blur(8px)'
                      }}
                    >
                      {product.tags?.[0] || 'Atelier Signature'}
                    </span>
                  </div>

                  {/* Certificate Quick Badge (Top Right) */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onOpenCertificate) onOpenCertificate(product);
                    }}
                    title="Inspect Authenticity Seal"
                    style={{
                      position: 'absolute',
                      top: '14px',
                      right: '14px',
                      background: 'rgba(12, 10, 18, 0.85)',
                      border: '1px solid var(--border-gold)',
                      borderRadius: '50%',
                      width: '32px',
                      height: '32px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--gold-400)',
                      cursor: 'pointer',
                      zIndex: 3
                    }}
                  >
                    <ShieldCheck size={16} />
                  </button>

                  {/* Monogram Hover Pill */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onOpenMonogramStudio) onOpenMonogramStudio(product);
                    }}
                    style={{
                      position: 'absolute',
                      bottom: '12px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      background: 'rgba(8, 7, 14, 0.9)',
                      border: '1px solid var(--gold-400)',
                      padding: '5px 14px',
                      borderRadius: 'var(--radius-full)',
                      color: 'var(--gold-300)',
                      fontSize: '0.72rem',
                      fontWeight: '700',
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      cursor: 'pointer',
                      zIndex: 3,
                      boxShadow: '0 4px 15px rgba(0,0,0,0.6)'
                    }}
                  >
                    <Sparkles size={12} />
                    <span>Add Your Gold Initials</span>
                  </button>
                </div>

                {/* Card Info & Actions */}
                <div style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
                  <div>
                    {/* Silhouette & SKU */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                      <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--gold-400)', fontWeight: '700' }}>
                        {product.categoryName} • {product.sku}
                      </span>
                    </div>

                    {/* Product Name */}
                    <h3 
                      onClick={() => navigate(`/product/${product.id}`)}
                      style={{ 
                        fontFamily: 'var(--font-serif)', 
                        fontSize: '1.28rem', 
                        color: 'var(--text-pure-white)', 
                        margin: '0.35rem 0', 
                        cursor: 'pointer', 
                        lineHeight: '1.3' 
                      }}
                    >
                      {product.name}
                    </h3>

                    <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', marginBottom: '1.25rem', lineHeight: '1.55' }}>
                      {product.subtitle}
                    </p>

                    {/* Interactive Color Swatch Pills */}
                    {product.colors && product.colors.length > 0 && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.5rem' }}>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                          Colorways:
                        </span>
                        {product.colors.map((col, cIdx) => {
                          const isSelected = (activeColor?.name === col.name);
                          return (
                            <button
                              type="button"
                              key={cIdx}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSelectColor(product.id, col);
                              }}
                              title={`${col.name} — Click to view`}
                              style={{
                                width: '24px',
                                height: '24px',
                                borderRadius: '50%',
                                backgroundColor: col.hex,
                                border: isSelected ? '2px solid #FFF' : '1px solid rgba(212,175,55,0.5)',
                                outline: isSelected ? '2px solid var(--gold-400)' : 'none',
                                cursor: 'pointer',
                                padding: 0,
                                transform: isSelected ? 'scale(1.15)' : 'scale(1)',
                                transition: 'all 0.2s ease',
                                position: 'relative',
                                zIndex: 5
                              }}
                            />
                          );
                        })}
                        <span style={{ fontSize: '0.74rem', color: 'var(--gold-300)', fontWeight: '600', marginLeft: '4px' }}>
                          {activeColor?.name || product.colors[0].name}
                        </span>
                      </div>
                    )}
                  </div>

                  <div>
                    {/* Price & Stock Badge */}
                    <div 
                      style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'baseline', 
                        marginBottom: '1.25rem', 
                        padding: '0.75rem 1rem', 
                        background: 'rgba(212,175,55,0.08)', 
                        borderRadius: 'var(--radius-xs)', 
                        border: '1px solid var(--border-gold)' 
                      }}
                    >
                      <span style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', fontWeight: '800', color: 'var(--gold-300)' }}>
                        {formatPrice(product.priceKes, product.priceUsd)}
                      </span>
                      {!isOutOfStock ? (
                        <span style={{ fontSize: '0.76rem', color: '#10B981', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Check size={12} /> In Stock ({product.stock})
                        </span>
                      ) : (
                        <span style={{ fontSize: '0.76rem', color: '#EF4444', fontWeight: '700' }}>
                          ✕ Out of Stock
                        </span>
                      )}
                    </div>

                    {/* Actions: Direct WhatsApp + Add to Bag */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <button
                        onClick={() => {
                          openWhatsAppOrder({
                            bagName: `${product.name} (${activeColor?.name || 'Classic'})`,
                            quantity: 1,
                            bagPrice: product.priceKes,
                            totalPrice: product.priceKes,
                            image: currentImg,
                            color: activeColor?.name
                          });
                        }}
                        style={{
                          width: '100%',
                          padding: '0.9rem',
                          fontSize: '0.84rem',
                          background: 'linear-gradient(135deg, #1b3824 0%, #128C7E 50%, #25D366 100%)',
                          border: '1px solid #25D366',
                          color: '#fff',
                          borderRadius: 'var(--radius-xs)',
                          fontWeight: '800',
                          letterSpacing: '0.08em',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '8px',
                          boxShadow: '0 4px 15px rgba(37,211,102,0.3)',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        <WhatsAppIcon size={16} color="#fff" />
                        <span>BUY ON WHATSAPP</span>
                      </button>

                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          onClick={() => handleQuickAdd(product)}
                          disabled={isOutOfStock}
                          className="btn-gold-outline"
                          style={{
                            flex: 1,
                            padding: '0.75rem',
                            fontSize: '0.8rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '6px'
                          }}
                        >
                          <ShoppingBag size={14} />
                          <span>{isOutOfStock ? 'Out of Stock' : 'Add to Bag'}</span>
                        </button>
                        <button
                          onClick={() => navigate(`/product/${product.id}`)}
                          className="btn-dark"
                          style={{ padding: '0.75rem 1.25rem', fontSize: '0.8rem' }}
                        >
                          Details
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Runway CTA */}
        <div style={{ textAlign: 'center', marginTop: '4.5rem' }}>
          <Link
            to="/shop"
            className="btn-gold"
            style={{
              padding: '1.2rem 3.5rem',
              fontSize: '0.95rem',
              letterSpacing: '0.16em',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '12px',
              boxShadow: '0 10px 35px rgba(212, 175, 55, 0.4)'
            }}
          >
            <span>EXPLORE FULL ATELIER CATALOG</span>
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
}
