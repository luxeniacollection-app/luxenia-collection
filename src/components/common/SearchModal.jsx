import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, ArrowRight, Sparkles } from 'lucide-react';
import { useProducts } from '../../context/ProductContext';
import { useCart } from '../../context/CartContext';
import { initialProducts } from '../../data/products';

export default function SearchModal({ isOpen, onClose }) {
  const navigate = useNavigate();
  const { products: contextProducts } = useProducts();
  const { formatPrice } = useCart();
  const [searchTerm, setSearchTerm] = useState('');

  if (!isOpen) return null;

  const products = (Array.isArray(contextProducts) && contextProducts.length > 0)
    ? contextProducts
    : initialProducts;

  const filteredProducts = searchTerm.trim() === '' 
    ? [] 
    : products.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.subtitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.categoryName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );

  const handleSelectProduct = (productId) => {
    onClose();
    navigate(`/product/${productId}`);
  };

  return (
    <div className="modal-backdrop open" onClick={onClose}>
      <div 
        className="luxe-modal" 
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '640px', padding: '2rem' }}
      >
        <button className="modal-close-btn" onClick={onClose} aria-label="Close search">
          <X size={18} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.25rem' }}>
          <Sparkles size={16} color="var(--gold-400)" />
          <span style={{ fontSize: '0.74rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--gold-400)', fontWeight: '700' }}>
            LUXE NIA Search
          </span>
        </div>

        {/* Input */}
        <div style={{ position: 'relative', marginBottom: '1.5rem' }}>
          <input
            type="text"
            autoFocus
            placeholder="Search Noir Black, Sahara Mocha, Ivory Pearl Baguette..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="form-input"
            style={{
              width: '100%',
              paddingLeft: '3rem',
              paddingRight: '1rem',
              fontSize: '1rem',
              height: '52px'
            }}
          />
          <Search size={20} color="var(--gold-400)" style={{ position: 'absolute', left: '16px', top: '16px' }} />
        </div>

        {/* Suggested Searches */}
        {searchTerm.trim() === '' && (
          <div>
            <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '0.75rem' }}>
              Popular Leather Colorways
            </span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {['Noir Black', 'Sahara Mocha', 'Ivory Pearl', 'Baguette Flap Bag'].map(tag => (
                <button
                  key={tag}
                  onClick={() => setSearchTerm(tag)}
                  className="btn-dark"
                  style={{ padding: '0.4rem 0.9rem', fontSize: '0.78rem' }}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Results */}
        {searchTerm.trim() !== '' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                Found {filteredProducts.length} curated result{filteredProducts.length === 1 ? '' : 's'}
              </span>
            </div>

            {filteredProducts.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem 0', color: 'var(--text-muted)' }}>
                <p>No handbag pieces found matching "{searchTerm}".</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '350px', overflowY: 'auto' }}>
                {filteredProducts.map(prod => (
                  <div
                    key={prod.id}
                    onClick={() => handleSelectProduct(prod.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1rem',
                      padding: '0.75rem',
                      background: 'var(--bg-card)',
                      border: '1px solid var(--border-card)',
                      borderRadius: 'var(--radius-xs)',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                    className="product-card"
                  >
                    <div style={{ width: '50px', height: '60px', flexShrink: 0, borderRadius: '4px', overflow: 'hidden' }}>
                      <img 
                        src={prod.image} 
                        alt={prod.name} 
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                      />
                    </div>

                    <div style={{ flex: 1 }}>
                      <span style={{ fontSize: '0.68rem', color: 'var(--gold-400)', textTransform: 'uppercase' }}>
                        {prod.categoryName}
                      </span>
                      <h5 style={{ fontFamily: 'var(--font-serif)', color: 'var(--text-pure-white)', fontSize: '0.92rem', margin: '2px 0' }}>
                        {prod.name}
                      </h5>
                      <span style={{ fontSize: '0.82rem', color: 'var(--gold-300)', fontWeight: '700' }}>
                        {formatPrice(prod.priceKes, prod.priceUsd)}
                      </span>
                    </div>

                    <ArrowRight size={16} color="var(--gold-400)" />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
