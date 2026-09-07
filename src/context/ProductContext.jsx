import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { initialProducts, categories } from '../data/products';

const ProductContext = createContext();
const STORAGE_KEY_PRODUCTS = 'luxenia_dynamic_catalog_v7';
const STORAGE_KEY_DELETED = 'luxenia_deleted_product_ids';

function getDeletedIds() {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const raw = localStorage.getItem(STORAGE_KEY_DELETED);
      return new Set(raw ? JSON.parse(raw) : []);
    }
  } catch (e) {}
  return new Set();
}

// Merge cached / database products while strictly respecting deletions and preserving all edited fields
function mergeWithAuthenticCatalog(cachedList) {
  const deletedIds = getDeletedIds();

  // If cachedList is valid, filter out any deleted products
  const validList = Array.isArray(cachedList)
    ? cachedList.filter(p => p && p.id && !deletedIds.has(p.id) && !deletedIds.has(p.sku))
    : [];

  const existingMap = new Map();
  validList.forEach(p => {
    if (p && p.id) existingMap.set(p.id, p);
  });

  // Base list of authentic catalog bags that haven't been deleted
  const activeInitial = initialProducts.filter(p => !deletedIds.has(p.id) && !deletedIds.has(p.sku));

  const merged = activeInitial.map(authentic => {
    const cached = existingMap.get(authentic.id);
    if (cached) {
      return {
        ...authentic,
        ...cached,
        name: cached.name || authentic.name,
        priceKes: typeof cached.priceKes === 'number' ? cached.priceKes : authentic.priceKes,
        priceUsd: typeof cached.priceUsd === 'number' ? cached.priceUsd : authentic.priceUsd,
        description: cached.description !== undefined ? cached.description : authentic.description,
        shortDescription: cached.shortDescription !== undefined ? cached.shortDescription : authentic.shortDescription,
        subtitle: cached.subtitle !== undefined ? cached.subtitle : authentic.subtitle,
        image: cached.image || authentic.image,
        gallery: (Array.isArray(cached.gallery) && cached.gallery.length > 0) ? cached.gallery : authentic.gallery,
        status: (Number(cached.stock) === 0 || cached.status === 'out_of_stock') ? 'out_of_stock' : (cached.status || 'active'),
        stock: typeof cached.stock === 'number' ? cached.stock : authentic.stock,
        category: cached.category || authentic.category,
        categoryName: cached.categoryName || authentic.categoryName,
        details: Array.isArray(cached.details) && cached.details.length > 0 ? cached.details : authentic.details,
        material: cached.material || authentic.material,
        updatedAt: cached.updatedAt || authentic.updatedAt
      };
    }
    return authentic;
  });

  // Include any extra products added via Admin / CEO dashboard
  validList.forEach(p => {
    if (p && p.id && !activeInitial.some(a => a.id === p.id)) {
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
    const deletedIds = getDeletedIds();
    return initialProducts.filter(p => !deletedIds.has(p.id) && !deletedIds.has(p.sku));
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
      console.warn('Product live fetch error, using cached catalog:', err);
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
    // If ID was in deleted set, clean it out
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const deletedRaw = localStorage.getItem(STORAGE_KEY_DELETED);
        if (deletedRaw) {
          const deletedSet = new Set(JSON.parse(deletedRaw));
          if (productData.id) deletedSet.delete(productData.id);
          if (productData.sku) deletedSet.delete(productData.sku);
          localStorage.setItem(STORAGE_KEY_DELETED, JSON.stringify([...deletedSet]));
        }
      }
    } catch (e) {}

    let token = null;
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        token = localStorage.getItem('luxenia_ceo_token') || localStorage.getItem('luxenia_admin_token');
      }
    } catch (e) {}

    let createdProduct = null;
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify(productData)
      });

      const data = await res.json();
      if (res.ok && data.success && data.product) {
        createdProduct = data.product;
      }
    } catch (err) {
      console.warn('API POST failed, using local product addition:', err);
    }

    if (!createdProduct) {
      const timestamp = Date.now();
      const priceKes = Number(productData.priceKes) || 5800;
      createdProduct = {
        ...productData,
        id: productData.id || `prod-${timestamp.toString().slice(-6)}`,
        sku: productData.sku || `LN-HB-${timestamp.toString().slice(-4)}`,
        priceKes,
        priceUsd: Number(productData.priceUsd) || Math.round(priceKes / 130),
        stock: Number(productData.stock) >= 0 ? Number(productData.stock) : 10,
        status: productData.status || 'active',
        image: productData.image || '/images/products/luxe-baguette-noir-black.jpg',
        gallery: Array.isArray(productData.gallery) && productData.gallery.length > 0
          ? productData.gallery
          : [productData.image || '/images/products/luxe-baguette-noir-black.jpg'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
    }

    setProducts(prev => {
      const nextList = [createdProduct, ...prev.filter(p => p.id !== createdProduct.id)];
      try {
        if (typeof window !== 'undefined' && window.localStorage) {
          localStorage.setItem(STORAGE_KEY_PRODUCTS, JSON.stringify(nextList));
        }
      } catch (e) {}
      return nextList;
    });

    return createdProduct;
  };

  // Update Product (Admin / CEO)
  const updateProduct = async (id, updates) => {
    let token = null;
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        token = localStorage.getItem('luxenia_ceo_token') || localStorage.getItem('luxenia_admin_token');
      }
    } catch (e) {}

    // Optimistically update local state immediately so customer storefront reflects instantly
    let updatedSnapshot = null;
    setProducts(prev => {
      const nextList = prev.map(p => {
        if (p.id === id || p.sku === id) {
          const newStock = updates.stock !== undefined ? Number(updates.stock) : p.stock;
          let newStatus = updates.status !== undefined ? updates.status : p.status;
          if (newStock <= 0 && updates.status === undefined) {
            newStatus = 'out_of_stock';
          }

          const priceKes = updates.priceKes !== undefined ? Number(updates.priceKes) : p.priceKes;
          const priceUsd = updates.priceUsd !== undefined 
            ? Number(updates.priceUsd) 
            : (updates.priceKes !== undefined ? Math.round(priceKes / 130) : p.priceUsd);

          const updated = {
            ...p,
            ...updates,
            priceKes,
            priceUsd,
            stock: newStock,
            status: newStatus,
            description: updates.description !== undefined ? updates.description : p.description,
            shortDescription: updates.shortDescription !== undefined ? updates.shortDescription : p.shortDescription,
            subtitle: updates.subtitle !== undefined ? updates.subtitle : p.subtitle,
            image: updates.image || p.image,
            updatedAt: new Date().toISOString()
          };
          updatedSnapshot = updated;
          return updated;
        }
        return p;
      });

      try {
        if (typeof window !== 'undefined' && window.localStorage) {
          localStorage.setItem(STORAGE_KEY_PRODUCTS, JSON.stringify(nextList));
        }
      } catch (e) {}

      return nextList;
    });

    // Send update to backend API
    try {
      const res = await fetch(`/api/products/item?id=${encodeURIComponent(id)}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ id, ...updates })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success && data.product) {
          setProducts(prev => prev.map(p => (p.id === id || p.sku === id) ? { ...p, ...data.product } : p));
          return data.product;
        }
      }
    } catch (err) {
      console.warn('API update error, local state updated successfully:', err);
    }

    return updatedSnapshot;
  };

  // Delete Product (Admin / CEO)
  const deleteProduct = async (id) => {
    // 1. Record ID in deleted set so initialProducts never resurrects it
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const deletedRaw = localStorage.getItem(STORAGE_KEY_DELETED);
        const deletedSet = new Set(deletedRaw ? JSON.parse(deletedRaw) : []);
        deletedSet.add(id);
        localStorage.setItem(STORAGE_KEY_DELETED, JSON.stringify([...deletedSet]));
      }
    } catch (e) {}

    // 2. Remove immediately from local state and storage
    setProducts(prev => {
      const remaining = prev.filter(p => p.id !== id && p.sku !== id);
      try {
        if (typeof window !== 'undefined' && window.localStorage) {
          localStorage.setItem(STORAGE_KEY_PRODUCTS, JSON.stringify(remaining));
        }
      } catch (e) {}
      return remaining;
    });

    // 3. Call backend API to delete from database
    let token = null;
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        token = localStorage.getItem('luxenia_ceo_token') || localStorage.getItem('luxenia_admin_token');
      }
    } catch (e) {}

    try {
      await fetch(`/api/products/item?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ id })
      });
    } catch (err) {
      console.warn('API delete error, item deleted locally:', err);
    }

    return true;
  };

  // Toggle Stock Status (In Stock vs Out of Stock) helper
  const toggleStockStatus = async (id, targetStatus) => {
    const prod = products.find(p => p.id === id || p.sku === id);
    if (!prod) return;

    const isCurrentOut = prod.status === 'out_of_stock' || Number(prod.stock) <= 0;
    const shouldBeOut = targetStatus !== undefined 
      ? targetStatus === 'out_of_stock' 
      : !isCurrentOut;

    const newStatus = shouldBeOut ? 'out_of_stock' : 'active';
    const newStock = shouldBeOut ? 0 : (prod.stock > 0 ? prod.stock : 10);

    return updateProduct(id, { status: newStatus, stock: newStock });
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
        localStorage.removeItem(STORAGE_KEY_DELETED);
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
        toggleStockStatus,
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
