import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { ProductProvider } from './context/ProductContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { AdminAuthProvider } from './context/AdminAuthContext';
import { ToastProvider } from './components/common/Toast';

// Common Components (Customer Storefront)
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import CartDrawer from './components/common/CartDrawer';
import QuickViewModal from './components/common/QuickViewModal';
import SearchModal from './components/common/SearchModal';
import WhatsAppConcierge from './components/common/WhatsAppConcierge';

// Public Pages (Customer Storefront)
import Home from './pages/Home';
import Shop from './pages/Shop';
import About from './pages/About';
import Contact from './pages/Contact';
import CartPage from './components/pages/CartPage';
import ProductDetailPage from './components/pages/ProductDetailPage';

// Private Admin / CEO Components
import AdminLoginPage from './components/admin/AdminLoginPage';
import AdminDashboard from './components/admin/AdminDashboard';
import AdminProtectedRoute from './components/admin/AdminProtectedRoute';

// Scroll to top helper on route change
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname]);

  return null;
}

function AppContent() {
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const location = useLocation();

  const isAdminRoute = location.pathname.toLowerCase().startsWith('/admin') || location.pathname.toLowerCase().startsWith('/ceo');

  // =========================================================================
  // PRIVATE LUXE NIA ADMIN PAGE (COMPLETELY SEPARATE FROM STOREFRONT)
  // =========================================================================
  if (isAdminRoute) {
    return (
      <div className="admin-suite-app" style={{ minHeight: '100vh', background: '#08080C' }}>
        <ScrollToTop />
        <Routes>
          {/* Private Admin Login */}
          <Route path="/admin-login" element={<AdminLoginPage />} />
          <Route path="/admin/login" element={<Navigate to="/admin-login" replace />} />
          <Route path="/ceo-login" element={<AdminLoginPage />} />

          {/* Protected Admin Dashboard Routes */}
          <Route 
            path="/admin" 
            element={
              <AdminProtectedRoute>
                <AdminDashboard initialTab="dashboard" />
              </AdminProtectedRoute>
            } 
          />
          <Route 
            path="/admin/dashboard" 
            element={
              <AdminProtectedRoute>
                <AdminDashboard initialTab="dashboard" />
              </AdminProtectedRoute>
            } 
          />
          <Route 
            path="/admin/products" 
            element={
              <AdminProtectedRoute>
                <AdminDashboard initialTab="products" />
              </AdminProtectedRoute>
            } 
          />
          <Route 
            path="/admin/add-product" 
            element={
              <AdminProtectedRoute>
                <AdminDashboard initialTab="add-product" />
              </AdminProtectedRoute>
            } 
          />
          <Route 
            path="/admin/add-bag" 
            element={<Navigate to="/admin/add-product" replace />} 
          />
          <Route 
            path="/admin/stock" 
            element={
              <AdminProtectedRoute>
                <AdminDashboard initialTab="stock" />
              </AdminProtectedRoute>
            } 
          />
          <Route 
            path="/admin/orders" 
            element={
              <AdminProtectedRoute>
                <AdminDashboard initialTab="orders" />
              </AdminProtectedRoute>
            } 
          />
          <Route 
            path="/admin/settings" 
            element={
              <AdminProtectedRoute>
                <AdminDashboard initialTab="settings" />
              </AdminProtectedRoute>
            } 
          />

          {/* CEO URL Aliases */}
          <Route path="/ceo" element={<Navigate to="/admin" replace />} />
          <Route path="/ceo/dashboard" element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="/ceo/products" element={<Navigate to="/admin/products" replace />} />
          <Route path="/ceo/add-bag" element={<Navigate to="/admin/add-product" replace />} />
          <Route path="/ceo/stock" element={<Navigate to="/admin/stock" replace />} />
          <Route path="/ceo/orders" element={<Navigate to="/admin/orders" replace />} />
          <Route path="/ceo/settings" element={<Navigate to="/admin/settings" replace />} />
          <Route path="/ceo/*" element={<Navigate to="/admin" replace />} />

          {/* Admin Fallback */}
          <Route 
            path="/admin/*" 
            element={
              <AdminProtectedRoute>
                <AdminDashboard />
              </AdminProtectedRoute>
            } 
          />
        </Routes>
      </div>
    );
  }

  // =========================================================================
  // PUBLIC CUSTOMER STOREFRONT (CLEAN, NO ADMIN CONTROLS VISIBLE)
  // Home → Shop → Product → Cart → Order
  // =========================================================================
  return (
    <div className="app-layout" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <ScrollToTop />

      {/* Global Navigation Header */}
      <Header onOpenSearch={() => setIsSearchOpen(true)} />

      {/* Main Page View Routes */}
      <main style={{ flex: 1 }}>
        <Routes>
          <Route 
            path="/" 
            element={<Home />} 
          />
          <Route 
            path="/shop" 
            element={<Shop onOpenQuickView={(product) => setQuickViewProduct(product)} />} 
          />
          <Route 
            path="/cart" 
            element={<CartPage />} 
          />
          <Route 
            path="/about" 
            element={<About />} 
          />
          <Route 
            path="/contact" 
            element={<Contact />} 
          />
          <Route 
            path="/checkout" 
            element={<Navigate to="/cart" replace />} 
          />
          <Route 
            path="/order-confirmation" 
            element={<Navigate to="/shop" replace />} 
          />
          <Route 
            path="/product/:id" 
            element={<ProductDetailPage />} 
          />
          <Route 
            path="*" 
            element={<Home />} 
          />
        </Routes>
      </main>

      {/* Global Luxury Footer */}
      <Footer />

      {/* Slide-out Cart Drawer Preview */}
      <CartDrawer />

      {/* Global Quick View Modal */}
      <QuickViewModal
        product={quickViewProduct}
        isOpen={!!quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />

      {/* Global Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />

      {/* Floating WhatsApp Concierge */}
      <WhatsAppConcierge />
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <AdminAuthProvider>
        <ProductProvider>
          <CartProvider>
            <WishlistProvider>
              <BrowserRouter>
                <AppContent />
              </BrowserRouter>
            </WishlistProvider>
          </CartProvider>
        </ProductProvider>
      </AdminAuthProvider>
    </ToastProvider>
  );
}
