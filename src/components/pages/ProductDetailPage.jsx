import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ShoppingBag, 
  Sparkles, 
  Check, 
  Truck, 
  ShieldCheck, 
  Crown, 
  Star, 
  ChevronDown, 
  ChevronUp, 
  ArrowLeft,
  ArrowRight,
  Plus, 
  Minus, 
  MessageCircle,
  Smartphone,
  ExternalLink
} from 'lucide-react';
import { WhatsAppIcon } from '../common/SocialIcons';
import { useProducts } from '../../context/ProductContext';
import { useCart } from '../../context/CartContext';
import { useToast } from '../common/Toast';
import { useWhatsAppOrder } from '../../context/WhatsAppOrderContext';
import { getWhatsAppProductOrderUrl, OFFICIAL_DISPLAY_PHONE } from '../../utils/whatsapp';
import { initialProducts } from '../../data/products';

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products: contextProducts, reduceStock } = useProducts();
  const { addToCart, formatPrice } = useCart();
  const { addToast } = useToast();
  const { openWhatsAppOrder } = useWhatsAppOrder();

  const products = (Array.isArray(contextProducts) && contextProducts.length > 0)
    ? contextProducts
    : initialProducts;

  const product = products.find(p => p.id === id || p.sku === id) || products[0] || initialProducts[0];

  const [selectedColor, setSelectedColor] = useState(product?.colors?.[0] || null);
  const [selectedSize, setSelectedSize] = useState(product?.sizes?.[0] || 'Classic Baguette (28cm)');
  const [activeImage, setActiveImage] = useState(product?.image || null);
  const [quantity, setQuantity] = useState(1);
  const [activeAccordion, setActiveAccordion] = useState('details');

  useEffect(() => {
    if (product) {
      setSelectedColor(product.colors?.[0] || null);
      setSelectedSize(product.sizes?.[0] || 'Classic Baguette (28cm)');
      setActiveImage(product.image || null);
      setQuantity(1);
    }
  }, [product]);

  if (!product) {
    return (
      <div style={{ padding: '6rem 0', textAlign: 'center', background: '#08080A', minHeight: '75vh' }}>
        <h2 style={{ fontFamily: 'var(--font-serif)', color: 'var(--text-pure-white)' }}>Product Not Found</h2>
        <Link to="/shop" className="btn-gold" style={{ marginTop: '1.5rem', display: 'inline-block' }}>
          Back to Shop
        </Link>
      </div>
    );
  }

  const isOutOfStock = Number(product.stock) <= 0 || product.status === 'out_of_stock';

  const handleAddToCart = () => {
    if (isOutOfStock) {
      addToast(`"${product.name}" is currently out of stock.`, 'error');
      return;
    }
    addToCart({ ...product, image: activeImage || product.image }, selectedSize, selectedColor, quantity);
    addToast(`Added ${quantity}x "${product.name}" to your shopping bag.`, 'gold');
  };

  const handleOrderOnWhatsApp = () => {
    if (isOutOfStock) {
      const url = `https://wa.me/254795439545?text=${encodeURIComponent(`Hello LUXE NIA, I would like to inquire about restock timing for: ${product.name}`)}`;
      window.open(url, '_blank', 'noopener,noreferrer');
      return;
    }
    openWhatsAppOrder({
      bagName: product.name,
      quantity,
      bagPrice: product.priceKes,
      totalPrice: (Number(product.priceKes) || 5800) * quantity,
      image: activeImage || product.image,
      color: selectedColor?.name
    });
  };

  const otherBags = products.filter(p => p.id !== product.id);

  return (
    <div className="product-detail-page" style={{ padding: '3rem 0 6rem', background: 'var(--bg-black)' }}>
      <div className="luxe-container">
        {/* Breadcrumb Navigation */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2.5rem', fontSize: '0.85rem', flexWrap: 'wrap' }}>
          <Link to="/shop" style={{ color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <ArrowLeft size={14} /> Back to Shop
          </Link>
          <span style={{ color: 'var(--text-muted)' }}>/</span>
          <span style={{ color: 'var(--gold-400)' }}>The Sovereign Baguette</span>
          <span style={{ color: 'var(--text-muted)' }}>/</span>
          <span style={{ color: 'var(--text-primary)' }}>{product.name}</span>
        </div>

        {/* Product Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: '4rem', alignItems: 'flex-start', marginBottom: '5rem' }}>
          {/* Left Column: Visual Presentation */}
          <div>
            <div 
              style={{
                width: '100%',
                aspectRatio: '4/5',
                background: 'var(--bg-card)',
                border: '1px solid var(--border-gold)',
                borderRadius: 'var(--radius-xs)',
                overflow: 'hidden',
                position: 'relative',
                boxShadow: 'var(--shadow-gold)'
              }}
            >
              <img 
                src={activeImage || product.image} 
                alt={product.name} 
                style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease' }} 
              />

              <div style={{ position: 'absolute', top: '16px', left: '16px' }}>
                <span className="badge-new">Authentic Atelier Piece</span>
              </div>
            </div>

            {/* Gallery Angle Thumbnails */}
            {product.gallery && product.gallery.length > 1 && (
              <div style={{ display: 'flex', gap: '12px', marginTop: '1.25rem', overflowX: 'auto', paddingBottom: '4px' }}>
                {product.gallery.map((imgUrl, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(imgUrl)}
                    style={{
                      width: '78px',
                      height: '88px',
                      borderRadius: 'var(--radius-xs)',
                      overflow: 'hidden',
                      border: (activeImage || product.image) === imgUrl ? '2px solid var(--gold-400)' : '1px solid var(--border-subtle)',
                      background: 'var(--bg-card)',
                      cursor: 'pointer',
                      padding: 0,
                      flexShrink: 0,
                      boxShadow: (activeImage || product.image) === imgUrl ? '0 0 12px rgba(212,175,55,0.45)' : 'none',
                      transition: 'all 0.2s ease',
                      opacity: (activeImage || product.image) === imgUrl ? 1 : 0.7
                    }}
                    title={`View color / angle ${idx + 1}`}
                  >
                    <img src={imgUrl} alt={`${product.name} angle ${idx + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </button>
                ))}
              </div>
            )}

            {/* Atelier Verification Guarantee Box */}
            <div 
              style={{
                marginTop: '1.5rem',
                background: 'var(--bg-card)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-xs)',
                padding: '1.25rem',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem'
              }}
            >
              <ShieldCheck size={28} color="var(--gold-400)" style={{ flexShrink: 0 }} />
              <div>
                <h5 style={{ fontSize: '0.9rem', color: 'var(--text-pure-white)', marginBottom: '2px' }}>LUXE NIA Atelier Guarantee</h5>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>
                  100% full-grain calf leather, gold-tone hardware, and signature gold-foil dust bag included.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Details & Buying Controls */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.74rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--gold-400)', fontWeight: '700' }}>
                {product.categoryName} • SKU: {product.sku}
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--gold-400)', fontSize: '0.85rem' }}>
                <Star size={14} fill="var(--gold-400)" />
                <span style={{ fontWeight: '700' }}>{product.rating}</span>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.76rem' }}>({product.reviewCount} reviews)</span>
              </div>
            </div>

            <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(1.8rem, 3.5vw, 2.4rem)', color: 'var(--text-pure-white)', marginBottom: '0.4rem', lineHeight: '1.25' }}>
              {product.name}
            </h1>

            <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', marginBottom: '1.75rem', fontFamily: 'var(--font-editorial)' }}>
              {product.subtitle}
            </p>

            {/* Price Banner */}
            <div 
              style={{
                display: 'flex',
                alignItems: 'baseline',
                justifyContent: 'space-between',
                padding: '1.25rem 1.5rem',
                background: 'rgba(212, 175, 55, 0.08)',
                border: '1px solid var(--border-gold)',
                borderRadius: 'var(--radius-xs)',
                marginBottom: '2rem',
                flexWrap: 'wrap',
                gap: '12px'
              }}
            >
              <span style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', fontWeight: '800', color: 'var(--gold-300)' }}>
                {formatPrice(product.priceKes, product.priceUsd)}
              </span>
              {!isOutOfStock ? (
                <span style={{ color: '#10B981', fontSize: '0.86rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Check size={16} /> In Stock ({product.stock} available)
                </span>
              ) : (
                <span style={{ color: '#EF4444', fontSize: '0.86rem', fontWeight: '700', background: 'rgba(239, 68, 68, 0.15)', padding: '4px 12px', borderRadius: '4px', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
                  ✕ Currently Out of Stock
                </span>
              )}
            </div>

            {/* Color Palette Switcher */}
            {product.colors && product.colors.length > 0 && (
              <div style={{ marginBottom: '1.75rem' }}>
                <span style={{ fontSize: '0.84rem', textTransform: 'uppercase', color: 'var(--text-secondary)', letterSpacing: '0.05em', display: 'block', marginBottom: '0.6rem' }}>
                  Available Leather Colorway: <strong style={{ color: 'var(--gold-300)' }}>{selectedColor?.name || 'Standard'}</strong>
                </span>
                <div style={{ display: 'flex', gap: '12px' }}>
                  {product.colors.map(col => (
                    <button
                      key={col.name}
                      onClick={() => {
                        setSelectedColor(col);
                        if (col.image) setActiveImage(col.image);
                      }}
                      title={col.name}
                      style={{
                        width: '38px',
                        height: '38px',
                        borderRadius: '50%',
                        backgroundColor: col.hex,
                        border: selectedColor?.name === col.name ? '2px solid var(--gold-300)' : '1px solid rgba(255,255,255,0.2)',
                        boxShadow: selectedColor?.name === col.name ? '0 0 14px rgba(212,175,55,0.6)' : 'none',
                        cursor: 'pointer',
                        transform: selectedColor?.name === col.name ? 'scale(1.1)' : 'scale(1)',
                        transition: 'all 0.2s ease'
                      }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Sizing Info */}
            <div style={{ marginBottom: '2rem' }}>
              <span style={{ fontSize: '0.84rem', textTransform: 'uppercase', color: 'var(--text-secondary)', letterSpacing: '0.05em', display: 'block', marginBottom: '0.6rem' }}>
                Dimensions & Fit
              </span>
              <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-xs)', padding: '0.75rem 1rem', fontSize: '0.85rem', color: 'var(--text-primary)' }}>
                Classic East-West Baguette Profile (28cm Width × 13cm Height × 8cm Depth) • 48cm Adjustable Strap
              </div>
            </div>

              {/* Quantity Stepper & Add to Bag */}
              <div style={{ display: 'flex', gap: '12px', marginBottom: '1rem' }}>
                <div 
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-xs)',
                    padding: '0 8px',
                    opacity: isOutOfStock ? 0.45 : 1
                  }}
                >
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={isOutOfStock}
                    style={{ padding: '8px', color: 'var(--text-secondary)', background: 'none', border: 'none', cursor: isOutOfStock ? 'not-allowed' : 'pointer' }}
                    aria-label="Decrease quantity"
                  >
                    <Minus size={14} />
                  </button>
                  <span style={{ padding: '0 12px', fontSize: '0.95rem', fontWeight: '700', color: 'var(--text-pure-white)' }}>
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    disabled={isOutOfStock || quantity >= (product.stock || 99)}
                    style={{ padding: '8px', color: 'var(--text-secondary)', background: 'none', border: 'none', cursor: isOutOfStock ? 'not-allowed' : 'pointer' }}
                    aria-label="Increase quantity"
                  >
                    <Plus size={14} />
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  disabled={isOutOfStock}
                  className="btn-gold-outline"
                  style={{
                    flex: 1,
                    padding: '1rem',
                    fontSize: '0.88rem',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    opacity: isOutOfStock ? 0.45 : 1,
                    cursor: isOutOfStock ? 'not-allowed' : 'pointer'
                  }}
                >
                  <ShoppingBag size={18} />
                  <span>{isOutOfStock ? 'Out of Stock' : 'Add To Shopping Bag'}</span>
                </button>
              </div>

              {/* PRIMARY ACTION: ORDER ON WHATSAPP */}
              {!isOutOfStock ? (
                <button
                  onClick={handleOrderOnWhatsApp}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px',
                    padding: '1.2rem 1.5rem',
                    background: 'linear-gradient(135deg, #1b3824 0%, #128C7E 50%, #25D366 100%)',
                    border: '1px solid #25D366',
                    borderRadius: 'var(--radius-xs)',
                    color: '#fff',
                    fontSize: '1rem',
                    fontWeight: '800',
                    letterSpacing: '0.1em',
                    cursor: 'pointer',
                    marginBottom: '1.75rem',
                    boxShadow: '0 8px 30px rgba(37,211,102,0.4), 0 0 15px rgba(212,175,55,0.2)',
                    transition: 'all 0.3s ease'
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
                  <ExternalLink size={16} />
                </button>
              ) : (
                <button
                  onClick={() => {
                    const url = `https://wa.me/254795439545?text=${encodeURIComponent(`Hello LUXE NIA, I would like to inquire about restock timing for: ${product.name}`)}`;
                    window.open(url, '_blank', 'noopener,noreferrer');
                  }}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px',
                    padding: '1.15rem 1.5rem',
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-xs)',
                    color: 'var(--text-muted)',
                    fontSize: '0.92rem',
                    fontWeight: '700',
                    letterSpacing: '0.05em',
                    cursor: 'pointer',
                    marginBottom: '1.75rem'
                  }}
                >
                  <WhatsAppIcon size={18} color="var(--text-muted)" />
                  <span>INQUIRE RE-STOCK / SOLD OUT</span>
                </button>
              )}

            {/* Information Accordions */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', borderTop: '1px solid var(--border-subtle)', paddingTop: '1.5rem' }}>
              <div style={{ borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
                <button
                  onClick={() => setActiveAccordion(activeAccordion === 'details' ? '' : 'details')}
                  style={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontFamily: 'var(--font-serif)',
                    fontSize: '0.95rem',
                    color: 'var(--text-pure-white)',
                    padding: '0.5rem 0'
                  }}
                >
                  <span>Atelier Leather Craftsmanship & Details</span>
                  {activeAccordion === 'details' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
                {activeAccordion === 'details' && (
                  <div style={{ padding: '0.5rem 0 1rem', fontSize: '0.86rem', color: 'var(--text-secondary)', lineHeight: '1.7' }}>
                    <p style={{ marginBottom: '0.75rem' }}>{product.description}</p>
                    <ul style={{ paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      {product.details?.map((det, idx) => (
                        <li key={idx}>{det}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div style={{ borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
                <button
                  onClick={() => setActiveAccordion(activeAccordion === 'shipping' ? '' : 'shipping')}
                  style={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontFamily: 'var(--font-serif)',
                    fontSize: '0.95rem',
                    color: 'var(--text-pure-white)',
                    padding: '0.5rem 0'
                  }}
                >
                  <span>Delivery & Concierge Ordering</span>
                  {activeAccordion === 'shipping' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
                {activeAccordion === 'shipping' && (
                  <div style={{ padding: '0.5rem 0 1rem', fontSize: '0.86rem', color: 'var(--text-secondary)', lineHeight: '1.7' }}>
                    <p>• <strong>Same-Day Nairobi Delivery:</strong> Orders confirmed before 2:00 PM are dispatched same-day via secure courier.</p>
                    <p>• <strong>Countrywide Kenya:</strong> 24–48 hours door-to-door hand-delivery across all counties.</p>
                    <p>• <strong>Direct Concierge Ordering:</strong> Finalize your order details, payment preference, and delivery destination directly with our atelier team on WhatsApp (+254 795 439 545).</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Other Bag Colors */}
        {otherBags.length > 0 && (
          <section style={{ borderTop: '1px solid var(--border-gold)', paddingTop: '4rem' }}>
            <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
              <span style={{ fontSize: '0.74rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--gold-400)', fontWeight: '700' }}>
                Alternative Colorways
              </span>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', color: 'var(--text-pure-white)', marginTop: '0.3rem' }}>
                More From The Sovereign Baguette Series
              </h3>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
              {otherBags.map(bag => (
                <div key={bag.id} className="product-card" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-gold)' }}>
                  <div 
                    className="product-card-image-wrap"
                    onClick={() => navigate(`/product/${bag.id}`)}
                    style={{ cursor: 'pointer', aspectRatio: '4/5' }}
                  >
                    <img src={bag.image} alt={bag.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <div className="product-card-info" style={{ padding: '1.5rem' }}>
                    <span className="product-category-label">{bag.categoryName}</span>
                    <h4 
                      className="product-title"
                      onClick={() => navigate(`/product/${bag.id}`)}
                      style={{ cursor: 'pointer' }}
                    >
                      {bag.name}
                    </h4>
                    <div className="product-price-row" style={{ marginTop: '1rem' }}>
                      <span className="product-price-kes">{formatPrice(bag.priceKes, bag.priceUsd)}</span>
                      <button
                        onClick={() => navigate(`/product/${bag.id}`)}
                        className="btn-gold"
                        style={{ padding: '0.5rem 1rem', fontSize: '0.78rem' }}
                      >
                        View Colorway
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
