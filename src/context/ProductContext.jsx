import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { initialProducts, categories } from '../data/products';

const ProductContext = createContext();
const STORAGE_KEY_PRODUCTS = 'luxenia_dynamic_catalog_v7';

// Merge cached products with initialProducts to guarantee all authentic bags exist
function mergeWithAuthenticCatalog(cachedList) {
  if (!Array.isArray(cachedList) || cachedList.length === 0) {
    return initialProducts;
  }

  const existingMap = new Map();
  cachedList.forEach(p => {
    if (p && p.id) existingMap.set(p.id, p);
  });

  // Ensure all 5 authentic bags exist while respecting database overrides
  const merged = initialProducts.map(authentic => {
    const cached = existingMap.get(authentic.id);
    if (cached) {
      return {
        ...authentic,
        ...cached,
        name: cached.name || authentic.name,
        priceKes: typeof cached.priceKes === 'number' ? cached.priceKes : authentic.priceKes,
        priceUsd: typeof cached.priceUsd === 'number' ? cached.priceUsd : authentic.priceUsd,
        image: cached.image || authentic.image,
        gallery: (Array.isArray(cached.gallery) && cached.gallery.length > 0) ? cached.gallery : authentic.gallery,
        status: (Number(cached.stock) === 0 || cached.status === 'out_of_stock') ? 'out_of_stock' : (cached.status || 'active'),
        stock: typeof cached.stock === 'number' ? cached.stock : authentic.stock
      };
    }
    return authentic;
  });

  // Include any extra products added via CEO / Admin dashboard
  cachedList.forEach(p => {
    if (p && p.id && !initialProducts.some(a => a.id === p.id)) {
      merged.push(p);
    }
  });

  return merged;
}

export function ProductProvider({ children }) {
  const [products, setProducts] = useState(() => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const saved = localStorage.getItem(STORAGE_KEY_PRODUCTS);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            return mergeWithAuthenticCatalog(parsed);
          }
        }
      }
    } catch (e) {
      console.warn('Failed to load local cached products:', e);
    }
    return initialProducts;
  });

  const [isLoading, setIsLoading] = useState(false);

  // Fetch live products from database API
  const refreshProducts = useCallback(async () => {
    setIsLoading(true);
    try {
      let token = null;
      try {
        if (typeof window !== 'undefined' && window.localStorage) {
          token = localStorage.getItem('luxenia_ceo_token') || localStorage.getItem('luxenia_admin_token');
        }
      } catch (e) {}

      const headers = {};
      let url = '/api/products';
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
        url = '/api/products?includeInactive=true';
      }

      const res = await fetch(url, { headers });
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.products) && data.products.length > 0) {
          const merged = mergeWithAuthenticCatalog(data.products);
          setProducts(merged);
          try {
            if (typeof window !== 'undefined' && window.localStorage) {
              localStorage.setItem(STORAGE_KEY_PRODUCTS, JSON.stringify(merged));
            }
          } catch (e) {}
          return merged;
        }
      }
    } catch (err) {
      console.warn('Product live fetch error, using authentic catalog:', err);
    } finally {
      setIsLoading(false);
    }
    return products;
  }, [products]);

  // Initial fetch on mount
  useEffect(() => {
    refreshProducts();
  }, []);

  // Persist products to localStorage
  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && window.localStorage && products.length > 0) {
        localStorage.setItem(STORAGE_KEY_PRODUCTS, JSON.stringify(products));
      }
    } catch (e) {
      console.error('Failed to save products to localStorage', e);
    }
  }, [products]);

  // Add Product (Admin / CEO)
  const addProduct = async (productData) => {
    let token = null;
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        token = localStorage.getItem('luxenia_ceo_token') || localStorage.getItem('luxenia_admin_token');
      }
    } catch (e) {}

    const res = await fetch('/api/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      },
      body: JSON.stringify(productData)
    });

    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.error || 'Failed to add product.');
    }

    const created = data.product;
    setProducts(prev => [created, ...prev.filter(p => p.id !== created.id)]);
    return created;
  };

  // Update Product (Admin / CEO)
  const updateProduct = async (id, updates) => {
    let token = null;
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        token = localStorage.getItem('luxenia_ceo_token') || localStorage.getItem('luxenia_admin_token');
      }
    } catch (e) {}

    const res = await fetch(`/api/products/item?id=${encodeURIComponent(id)}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      },
      body: JSON.stringify({ id, ...updates })
    });

    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.error || 'Failed to update product.');
    }

    const updated = data.product;
    setProducts(prev => prev.map(p => p.id === id ? updated : p));
    return updated;
  };

  // Delete Product (Admin / CEO)
  const deleteProduct = async (id) => {
    let token = null;
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        token = localStorage.getItem('luxenia_ceo_token') || localStorage.getItem('luxenia_admin_token');
      }
    } catch (e) {}

    const res = await fetch(`/api/products/item?id=${encodeURIComponent(id)}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      },
      body: JSON.stringify({ id })
    });

    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.error || 'Failed to delete product.');
    }

    setProducts(prev => prev.filter(p => p.id !== id));
    return true;
  };

  // Reduce Stock on Order Placement
  const reduceStock = async (orderItems) => {
    if (!Array.isArray(orderItems) || orderItems.length === 0) return;

    // Optimistically update local state immediately
    setProducts(prev => {
      const updatedList = prev.map(prod => {
        const orderItem = orderItems.find(i => (i.id === prod.id || i.sku === prod.sku));
        if (orderItem) {
          const currentStock = Number(prod.stock) >= 0 ? Number(prod.stock) : 10;
          const qty = Number(orderItem.quantity) || 1;
          const newStock = Math.max(0, currentStock - qty);
          return {
            ...prod,
            stock: newStock,
            status: newStock === 0 ? 'out_of_stock' : prod.status
          };
        }
        return prod;
      });

      try {
        if (typeof window !== 'undefined' && window.localStorage) {
          localStorage.setItem(STORAGE_KEY_PRODUCTS, JSON.stringify(updatedList));
        }
      } catch (e) {}

      return updatedList;
    });

    // Call API to persist stock reduction to database
    try {
      const res = await fetch('/api/products/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: orderItems.map(item => ({
            id: item.id || item.productId,
            quantity: Number(item.quantity) || 1
          }))
        })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.products)) {
          const merged = mergeWithAuthenticCatalog(data.products);
          setProducts(merged);
          try {
            if (typeof window !== 'undefined' && window.localStorage) {
              localStorage.setItem(STORAGE_KEY_PRODUCTS, JSON.stringify(merged));
            }
          } catch (e) {}
        }
      }
    } catch (err) {
      console.warn('Could not reach /api/products/order, stock updated locally:', err);
    }
  };

  const getProductById = (id) => {
    return products.find(p => p.id === id || p.sku === id) || initialProducts.find(p => p.id === id || p.sku === id) || null;
  };

  const resetToDefaultCatalog = () => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.removeItem(STORAGE_KEY_PRODUCTS);
      }
    } catch (e) {}
    setProducts(initialProducts);
  };

  return (
    <ProductContext.Provider
      value={{
        products: (Array.isArray(products) && products.length > 0) ? products : initialProducts,
        categories,
        isLoading,
        refreshProducts,
        addProduct,
        updateProduct,
        deleteProduct,
        reduceStock,
        getProductById,
        resetToDefaultCatalog
      }}
    >
      {children}
    </ProductContext.Provider>
  );
}

export function useProducts() {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
}
