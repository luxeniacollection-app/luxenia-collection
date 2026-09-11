import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ShoppingBag, 
  Eye, 
  ExternalLink,
  Sparkles,
  Check,
  Crown,
  ShieldCheck
} from 'lucide-react';
import { WhatsAppIcon } from '../common/SocialIcons';
import { useProducts } from '../../context/ProductContext';
import { useCart } from '../../context/CartContext';
import { useToast } from '../common/Toast';
import { useWhatsAppOrder } from '../../context/WhatsAppOrderContext';
import { getWhatsAppProductOrderUrl, OFFICIAL_DISPLAY_PHONE } from '../../utils/whatsapp';
import { initialProducts } from '../../data/products';
import MonogramStudioModal from '../common/MonogramStudioModal';
import AuthenticityCertificateModal from '../common/AuthenticityCertificateModal';

export default function ShopPage({ onOpenQuickView }) {
  const navigate = useNavigate();
  const { products: contextProducts, categories, reduceStock } = useProducts();
  const { formatPrice, addToCart } = useCart();
  const { addToast } = useToast();
  const { openWhatsAppOrder } = useWhatsAppOrder();

  const [selectedCategory, setSelectedCategory] = useState('all');
  const [monogramProduct, setMonogramProduct] = useState(null);
  const [certificateProduct, setCertificateProduct] = useState(null);
  const [activeColorMap, setActiveColorMap] = useState({});

  // Fallback to initialProducts to guarantee products are always visible
  const allProducts = (Array.isArray(contextProducts) && contextProducts.length > 0) 
    ? contextProducts 
    : initialProducts;

  const filteredProducts = selectedCategory === 'all' 
    ? allProducts 
    : allProducts.filter(p => p.category === selectedCategory);

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
      product.sizes?.[0] || 'Classic Baguette (28cm)',
      chosenColor,
      1
    );
    addToast(`Added "${product.name}" to your shopping bag.`, 'gold');
  };

  return (
    <div className="shop-page" style={{ padding: '3.5rem 0 6rem', background: 'var(--bg-black)', minHeight: '85vh' }}>
      <div className="luxe-container">
        {/* Clean Luxury Title */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div 
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: 'rgba(212, 175, 55, 0.08)',
              border: '1px solid rgba(212, 175, 55, 0.3)',
              padding: '0.35rem 1.25rem',
              borderRadius: 'var(--radius-full)',
              marginBottom: '1rem'
            }}
          >
            <Crown size={13} color="var(--gold-400)" />
            <span 
              style={{ 
                fontSize: '0.74rem', 
                letterSpacing: '0.22em', 
                textTransform: 'uppercase', 
                color: 'var(--gold-300)', 
                fontWeight: '700'
              }}
            >
              NAIROBI ATELIER COLLECTION
            </span>
          </div>

          <h1 
            style={{ 
              fontSize: 'clamp(2.2rem, 4.5vw, 3.4rem)', 
              fontFamily: 'var(--font-serif)', 
              color: 'var(--text-pure-white)', 
              marginBottom: '0.75rem',
              letterSpacing: '0.04em'
            }}
          >
            The Handbag Collection
          </h1>

          <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', maxWidth: '640px', margin: '0 auto 1.75rem', lineHeight: '1.7' }}>
            Handcrafted in supple full-grain calf leather with authentic artisan detailing. Available in signature silhouettes and rich tones with express same-day Nairobi delivery.
          </p>

          {/* Custom Initials Banner Pill */}
          <div style={{ display: 'inline-flex', justifyContent: 'center' }}>
            <button
              onClick={() => setMonogramProduct(filteredProducts[0] || initialProducts[0])}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '0.65rem 1.75rem',
                background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.16) 0%, rgba(150, 109, 33, 0.08) 100%)',
                border: '1px solid var(--gold-400)',
                borderRadius: 'var(--radius-full)',
                color: 'var(--gold-300)',
                fontSize: '0.78rem',
                fontWeight: '700',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                cursor: 'pointer',
                boxShadow: '0 4px 15px rgba(212,175,55,0.15)',
                transition: 'all 0.25s ease'
              }}
            >
              <Sparkles size={14} color="var(--gold-400)" />
              <span>Add Custom Gold Initials to Any Bag</span>
              <Crown size={13} color="var(--gold-400)" />
            </button>
          </div>
        </div>

        {/* The Bags Grid */}
        <div 
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '2.5rem'
          }}
        >
          {filteredProducts.map(product => {
            const isOutOfStock = Number(product.stock) <= 0 || product.status === 'out_of_stock';
            const activeColor = activeColorMap[product.id] || product.colors?.[0] || null;
            const currentImg = activeColor?.image || product.image;

            return (
              <div 
                key={product.id} 
                className="product-card"
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-gold)',
                  borderRadius: 'var(--radius-xs)',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                  transition: 'all 0.3s ease'
                }}
              >
                {/* Product Image */}
                <div 
                  className="product-card-image-wrap"
                  onClick={() => navigate(`/product/${product.id}`)}
                  style={{ cursor: 'pointer', aspectRatio: '4/5', background: 'var(--bg-deep)', overflow: 'hidden', position: 'relative' }}
                >
                  <img 
                    src={currentImg} 
                    alt={product.name} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease' }} 
                  />

                  {/* Top Badges */}
                  <div style={{ position: 'absolute', top: '12px', left: '12px', zIndex: 2, display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    <span 
                      style={{
                        background: 'var(--bg-glass-heavy)',
                        border: '1px solid var(--border-gold)',
                        color: 'var(--gold-300)',
                        fontSize: '0.68rem',
                        fontWeight: '700',
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase',
                        padding: '4px 10px',
                        borderRadius: 'var(--radius-xs)',
                        backdropFilter: 'blur(6px)'
                      }}
                    >
                      {product.tags?.[0] || 'Atelier Drop'}
                    </span>
                  </div>

                  {/* Certificate Quick Badge */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setCertificateProduct(product);
                    }}
                    title="Inspect Authenticity Seal"
                    style={{
                      position: 'absolute',
                      top: '12px',
                      right: '12px',
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

                  {/* Quick Actions Hover */}
                  <div className="product-card-quick-actions" onClick={(e) => e.stopPropagation()}>
                    <button
                      className="btn-gold"
                      style={{ flex: 1, padding: '0.7rem', fontSize: '0.8rem' }}
                      onClick={() => onOpenQuickView && onOpenQuickView(product)}
                    >
                      <Eye size={15} /> Quick View
                    </button>
                    <button
                      className="btn-dark"
                      style={{ padding: '0.7rem 1.1rem', fontSize: '0.8rem' }}
                      onClick={() => navigate(`/product/${product.id}`)}
                    >
                      View Details
                    </button>
                  </div>
                </div>

                {/* Product Info & Actions */}
                <div style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                      <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--gold-400)', fontWeight: '700' }}>
                        {product.categoryName} • {product.sku}
                      </span>
                    </div>

                    <h3 
                      onClick={() => navigate(`/product/${product.id}`)}
                      style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', color: 'var(--text-pure-white)', margin: '0.35rem 0', cursor: 'pointer', lineHeight: '1.3' }}
                    >
                      {product.name}
                    </h3>

                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.15rem', lineHeight: '1.55' }}>
                      {product.subtitle}
                    </p>

                    {/* Color Swatch Previews with Direct Switcher */}
                    {product.colors && product.colors.length > 0 && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '1.25rem' }}>
                        {product.colors.map((c, cIdx) => {
                          const isSelected = (activeColor?.name === c.name);
                          return (
                            <button
                              type="button"
                              key={cIdx}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSelectColor(product.id, c);
                              }}
                              title={`${c.name} — Click to view`}
                              style={{
                                width: '20px',
                                height: '20px',
                                borderRadius: '50%',
                                backgroundColor: c.hex,
                                border: isSelected ? '2px solid #FFF' : '1px solid rgba(212,175,55,0.4)',
                                outline: isSelected ? '1px solid var(--gold-400)' : 'none',
                                cursor: 'pointer',
                                padding: 0
                              }}
                            />
                          );
                        })}
                        <span style={{ fontSize: '0.72rem', color: 'var(--gold-300)', marginLeft: '4px', fontWeight: '600' }}>
                          {activeColor?.name || product.colors[0].name}
                        </span>
                      </div>
                    )}
                  </div>

                  <div>
                    {/* Price Banner */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '1.15rem', padding: '0.65rem 0.95rem', background: 'rgba(212,175,55,0.08)', borderRadius: 'var(--radius-xs)', border: '1px solid var(--border-gold)' }}>
                      <span style={{ fontFamily: 'var(--font-serif)', fontSize: '1.35rem', fontWeight: '800', color: 'var(--gold-300)' }}>
                        {formatPrice(product.priceKes, product.priceUsd)}
                      </span>
                      {!isOutOfStock ? (
                        <span style={{ fontSize: '0.76rem', color: '#10B981', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Check size={12} /> In Stock ({product.stock})
                        </span>
                      ) : (
                        <span style={{ fontSize: '0.76rem', color: '#EF4444', fontWeight: '700', background: 'rgba(239, 68, 68, 0.15)', padding: '2px 8px', borderRadius: '4px', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
                          ✕ Out of Stock
                        </span>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {/* PRIMARY ACTION: ORDER ON WHATSAPP */}
                      {!isOutOfStock ? (
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
                            padding: '0.85rem 1rem',
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
                            boxShadow: '0 4px 15px rgba(37,211,102,0.35)',
                            transition: 'all 0.2s ease'
                          }}
                        >
                          <WhatsAppIcon size={16} color="#fff" />
                          <span>BUY ON WHATSAPP</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            const url = `https://wa.me/254795439545?text=${encodeURIComponent(`Hello LUXE NIA, I would like to inquire about restock timing for: ${product.name}`)}`;
                            window.open(url, '_blank', 'noopener,noreferrer');
                          }}
                          style={{
                            width: '100%',
                            padding: '0.85rem 1rem',
                            fontSize: '0.84rem',
                            background: 'rgba(255,255,255,0.05)',
                            border: '1px solid var(--border-subtle)',
                            color: 'var(--text-muted)',
                            borderRadius: 'var(--radius-xs)',
                            fontWeight: '700',
                            letterSpacing: '0.05em',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px'
                          }}
                        >
                          <WhatsAppIcon size={16} color="var(--text-muted)" />
                          <span>INQUIRE RE-STOCK</span>
                        </button>
                      )}

                      {/* Custom Initials Trigger Button */}
                      <button
                        onClick={() => setMonogramProduct(product)}
                        style={{
                          width: '100%',
                          padding: '0.65rem',
                          fontSize: '0.76rem',
                          background: 'rgba(212, 175, 55, 0.08)',
                          border: '1px solid var(--border-gold)',
                          borderRadius: 'var(--radius-xs)',
                          color: 'var(--gold-300)',
                          fontWeight: '700',
                          letterSpacing: '0.08em',
                          textTransform: 'uppercase',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px'
                        }}
                      >
                        <Sparkles size={13} />
                        <span>Add Your Gold Initials</span>
                      </button>

                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          onClick={() => handleQuickAdd(product)}
                          disabled={isOutOfStock}
                          className="btn-gold-outline"
                          style={{
                            flex: 1,
                            padding: '0.7rem',
                            fontSize: '0.8rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '6px',
                            opacity: isOutOfStock ? 0.45 : 1,
                            cursor: isOutOfStock ? 'not-allowed' : 'pointer'
                          }}
                        >
                          <ShoppingBag size={14} />
                          <span>{isOutOfStock ? 'Out of Stock' : 'Add to Bag'}</span>
                        </button>
                        <button
                          onClick={() => navigate(`/product/${product.id}`)}
                          className="btn-dark"
                          style={{ padding: '0.7rem 1.1rem', fontSize: '0.8rem' }}
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
      </div>

      {/* Global Modals Triggered in Shop */}
      <MonogramStudioModal
        isOpen={!!monogramProduct}
        defaultProduct={monogramProduct}
        onClose={() => setMonogramProduct(null)}
      />

      <AuthenticityCertificateModal
        isOpen={!!certificateProduct}
        product={certificateProduct}
        onClose={() => setCertificateProduct(null)}
      />
    </div>
  );
}
