import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard,
  Package, 
  PlusCircle, 
  Boxes, 
  ShoppingBag, 
  Settings, 
  LogOut, 
  Search, 
  Edit3, 
  Trash2, 
  Upload, 
  Image as ImageIcon, 
  Check, 
  X, 
  AlertCircle, 
  ShieldCheck, 
  ExternalLink, 
  DollarSign, 
  Layers, 
  Sparkles, 
  RefreshCw,
  Eye,
  Sliders,
  ChevronDown,
  ArrowUpRight,
  TrendingUp,
  Tag,
  Phone,
  Mail,
  MapPin,
  Clock,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Filter,
  Save,
  MessageCircle,
  Smartphone,
  CreditCard,
  Building
} from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { useProducts } from '../../context/ProductContext';
import { useToast } from '../common/Toast';
import Logo from '../common/Logo';
import { sampleInitialOrders, brandInfo } from '../../data/mockData';

export default function AdminDashboard({ initialTab }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { adminUser, logout, getAuthHeaders } = useAdminAuth();
  const { products, refreshProducts, addProduct, updateProduct, deleteProduct } = useProducts();
  const { addToast } = useToast();

  // Determine active tab from prop, URL pathname, or default to 'dashboard'
  const getTabFromPath = () => {
    const path = location.pathname.toLowerCase();
    if (path.includes('/ceo/products') || path.includes('/admin/products')) return 'products';
    if (path.includes('/ceo/add-bag') || path.includes('/ceo/add-product') || path.includes('/admin/add-product')) return 'add-product';
    if (path.includes('/ceo/stock') || path.includes('/admin/stock')) return 'stock';
    if (path.includes('/ceo/orders') || path.includes('/admin/orders')) return 'orders';
    if (path.includes('/ceo/settings') || path.includes('/admin/settings')) return 'settings';
    return initialTab || 'dashboard';
  };

  const [activeTab, setActiveTab] = useState(getTabFromPath);

  // Sync tab state when URL changes
  useEffect(() => {
    setActiveTab(getTabFromPath());
  }, [location.pathname, initialTab]);

  // Tab switcher helper
  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    if (tabId === 'dashboard') navigate('/admin');
    else if (tabId === 'add-product') navigate('/admin/add-product');
    else navigate(`/admin/${tabId}`);
  };

  // Filters & Search for Products Tab
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [viewMode, setViewMode] = useState('table'); // 'table' | 'grid'
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Stock Tab Filters
  const [stockFilter, setStockFilter] = useState('all'); // 'all' | 'low' | 'out' | 'in'
  const [stockSearchTerm, setStockSearchTerm] = useState('');

  // Orders Tab State
  const [ordersSearchTerm, setOrdersSearchTerm] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('all');
  const [ordersList, setOrdersList] = useState(() => {
    try {
      const saved = localStorage.getItem('luxenia_orders_history');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return sampleInitialOrders;
  });

  // Settings Tab State
  const [settingsData, setSettingsData] = useState(() => {
    try {
      const saved = localStorage.getItem('luxenia_atelier_settings');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return {
      storeName: 'Luxe Nia Collections',
      tagline: 'Timeless Opulence & Contemporary African Luxury',
      atelierAddress: 'The Penthouse Suite, Delta Corner Tower, Westlands, Nairobi',
      phone: '+254 795 439 545',
      whatsappPhone: '0795439545',
      email: 'luxeniacollection@gmail.com',
      mpesaPaybill: '888222',
      mpesaTill: '9876543',
      supportHours: 'Monday – Sunday: 8:00 AM – 10:00 PM EAT',
      currency: 'KES',
      usdRate: 130,
      deliveryFee: 0,
      shippingNotes: 'Complimentary Same-Day Dispatch in Nairobi / 24-48h Countrywide'
    };
  });

  // Modal States for Product Form / Delete
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deletingProduct, setDeletingProduct] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  // Product Form State
  const initialForm = {
    name: '',
    subtitle: 'Haute Maroquinerie',
    category: 'handbags',
    categoryName: 'Designer Bags',
    priceKes: 5800,
    priceUsd: 45,
    sku: '',
    material: 'Supple Full-Grain Calf Leather',
    stock: 10,
    status: 'active', // 'active' | 'draft' | 'out_of_stock'
    isFeatured: true,
    isNew: true,
    image: '',
    gallery: [],
    shortDescription: '',
    description: '',
    detailsText: "Handcrafted from full-grain calf leather in Nairobi\nSolid antique gold-tone luxury hardware\nIncludes Luxe Nia dust bag and authenticity certificate",
    sizesText: 'Classic Baguette (28cm)',
    colors: [
      { name: 'Noir Black', hex: '#0A0A0C', borderHex: '#D4AF37', image: '' }
    ]
  };

  const [formData, setFormData] = useState(initialForm);
  const [imagePreview, setImagePreview] = useState('');
  const fileInputRef = useRef(null);

  // Refresh products on mount
  useEffect(() => {
    handleRefresh();
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refreshProducts();
      addToast('Catalog synchronized with database.', 'gold');
    } catch (e) {
      addToast('Failed to sync catalog.', 'error');
    } finally {
      setIsRefreshing(false);
    }
  };

  // Open Add Modal or navigate to Add tab
  const openAddModal = () => {
    setEditingProduct(null);
    setFormData({
      ...initialForm,
      sku: `LN-HB-${Date.now().toString().slice(-4)}`
    });
    setImagePreview('');
    setIsFormModalOpen(true);
  };

  // Open Edit Modal
  const openEditModal = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name || '',
      subtitle: product.subtitle || '',
      category: product.category || 'handbags',
      categoryName: product.categoryName || 'Designer Bags',
      priceKes: product.priceKes || 5800,
      priceUsd: product.priceUsd || Math.round((product.priceKes || 5800) / 130),
      sku: product.sku || '',
      material: product.material || 'Supple Full-Grain Calf Leather',
      stock: product.stock !== undefined ? product.stock : 10,
      status: product.status || 'active',
      isFeatured: product.isFeatured ?? true,
      isNew: product.isNew ?? false,
      image: product.image || '',
      gallery: product.gallery || [product.image],
      shortDescription: product.shortDescription || '',
      description: product.description || '',
      detailsText: Array.isArray(product.details) ? product.details.join('\n') : '',
      sizesText: Array.isArray(product.sizes) ? product.sizes.join(', ') : 'Classic Baguette (28cm)',
      colors: Array.isArray(product.colors) && product.colors.length > 0
        ? product.colors
        : [{ name: 'Noir Black', hex: '#0A0A0C', borderHex: '#D4AF37', image: product.image || '' }]
    });
    setImagePreview(product.image || '');
    setIsFormModalOpen(true);
  };

  // Handle Image File Selection & Direct Upload
  const handleImageFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      addToast('Please select a valid image file (JPEG, PNG, WebP).', 'error');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      addToast('Image size cannot exceed 10MB.', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = async () => {
      const base64Data = reader.result;
      setImagePreview(base64Data);

      // Upload directly to server storage API
      setIsUploadingImage(true);
      try {
        const res = await fetch('/api/upload', {
          method: 'POST',
          headers: getAuthHeaders(),
          body: JSON.stringify({
            image: base64Data,
            name: formData.name || 'bag'
          })
        });

        const data = await res.json();
        if (res.ok && data.success && data.imageUrl) {
          setFormData(prev => ({
            ...prev,
            image: data.imageUrl,
            gallery: [data.imageUrl, ...(prev.gallery?.filter(g => g !== data.imageUrl) || [])]
          }));
          addToast('Product photo uploaded to server storage.', 'gold');
        } else {
          setFormData(prev => ({ ...prev, image: base64Data }));
        }
      } catch (err) {
        console.warn('Direct upload error, falling back to base64:', err);
        setFormData(prev => ({ ...prev, image: base64Data }));
      } finally {
        setIsUploadingImage(false);
      }
    };
    reader.readAsDataURL(file);
  };

  // Color Manager Helpers
  const addColorOption = () => {
    setFormData(prev => ({
      ...prev,
      colors: [
        ...prev.colors,
        { name: 'New Colorway', hex: '#D4AF37', borderHex: '#D4AF37', image: prev.image || '' }
      ]
    }));
  };

  const updateColorOption = (index, field, value) => {
    setFormData(prev => {
      const updated = [...prev.colors];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, colors: updated };
    });
  };

  const removeColorOption = (index) => {
    setFormData(prev => ({
      ...prev,
      colors: prev.colors.filter((_, idx) => idx !== index)
    }));
  };

  // Submit Product Form (Add or Edit)
  const handleSaveProduct = async (e) => {
    if (e) e.preventDefault();
    if (!formData.name.trim()) {
      addToast('Product name is required.', 'error');
      return;
    }
    if (!formData.priceKes) {
      addToast('Price in KSh is required.', 'error');
      return;
    }

    setIsSubmitting(true);

    const payload = {
      ...formData,
      priceKes: Number(formData.priceKes),
      priceUsd: Number(formData.priceUsd) || Math.round(Number(formData.priceKes) / 130),
      stock: Number(formData.stock),
      details: formData.detailsText.split('\n').map(d => d.trim()).filter(Boolean),
      sizes: formData.sizesText.split(',').map(s => s.trim()).filter(Boolean),
      image: formData.image || imagePreview || '/images/products/luxe-baguette-noir-black.jpg'
    };

    try {
      if (editingProduct) {
        await updateProduct(editingProduct.id, payload);
        addToast(`"${payload.name}" updated successfully.`, 'gold');
      } else {
        await addProduct(payload);
        addToast(`"${payload.name}" added to collection.`, 'gold');
      }
      setIsFormModalOpen(false);
      if (activeTab === 'add-product') {
        handleTabChange('products');
      }
    } catch (err) {
      addToast('Error saving product.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete product handler
  const handleConfirmDelete = async () => {
    if (!deletingProduct) return;
    setIsSubmitting(true);
    try {
      await deleteProduct(deletingProduct.id);
      addToast(`"${deletingProduct.name}" removed from catalog.`, 'gold');
      setDeletingProduct(null);
    } catch (e) {
      addToast('Failed to delete product.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Quick Stock adjustments from stock tab
  const handleAdjustStock = async (product, delta) => {
    const current = Number(product.stock) || 0;
    const newStock = Math.max(0, current + delta);
    const newStatus = newStock === 0 ? 'out_of_stock' : product.status === 'out_of_stock' ? 'active' : product.status;
    try {
      await updateProduct(product.id, { stock: newStock, status: newStatus });
      addToast(`Stock for ${product.name} updated to ${newStock}.`, 'gold');
    } catch (e) {
      addToast('Failed to update stock.', 'error');
    }
  };

  const handleSetStockDirect = async (product, exactValue) => {
    const val = Math.max(0, Number(exactValue) || 0);
    const newStatus = val === 0 ? 'out_of_stock' : product.status === 'out_of_stock' ? 'active' : product.status;
    try {
      await updateProduct(product.id, { stock: val, status: newStatus });
      addToast(`Stock for ${product.name} set to ${val}.`, 'gold');
    } catch (e) {
      addToast('Failed to update stock.', 'error');
    }
  };

  // Order status update
  const handleUpdateOrderStatus = (orderId, newStatus) => {
    const updated = ordersList.map(ord => {
      if (ord.id === orderId) {
        return { ...ord, status: newStatus };
      }
      return ord;
    });
    setOrdersList(updated);
    try {
      localStorage.setItem('luxenia_orders_history', JSON.stringify(updated));
    } catch (e) {}
    addToast(`Order ${orderId} marked as ${newStatus}.`, 'gold');
  };

  // Save Settings
  const handleSaveSettings = (e) => {
    if (e) e.preventDefault();
    try {
      localStorage.setItem('luxenia_atelier_settings', JSON.stringify(settingsData));
      addToast('Atelier settings saved successfully.', 'gold');
    } catch (e) {
      addToast('Failed to save settings.', 'error');
    }
  };

  // Metric Stats Calculations
  const totalProductsCount = products.length;
  const activeProductsCount = products.filter(p => p.status === 'active').length;
  const lowStockCount = products.filter(p => (Number(p.stock) || 0) > 0 && (Number(p.stock) || 0) <= 3).length;
  const outOfStockCount = products.filter(p => (Number(p.stock) || 0) === 0).length;
  const totalInventoryKes = products.reduce((acc, p) => acc + ((Number(p.priceKes) || 0) * (Number(p.stock) || 0)), 0);
  const totalOrdersRevenue = ordersList.reduce((acc, ord) => acc + (Number(ord.total) || 0), 0);

  // Filtered Products for Products Tab
  const filteredProducts = products.filter(p => {
    const matchesSearch = searchTerm.trim() === '' || 
      p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.sku?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.categoryName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.material?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
    const matchesStatus = selectedStatus === 'all' || p.status === selectedStatus;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Filtered Products for Stock Tab
  const filteredStockProducts = products.filter(p => {
    const matchesSearch = stockSearchTerm.trim() === '' ||
      p.name?.toLowerCase().includes(stockSearchTerm.toLowerCase()) ||
      p.sku?.toLowerCase().includes(stockSearchTerm.toLowerCase());

    const stockNum = Number(p.stock) || 0;
    let matchesFilter = true;
    if (stockFilter === 'low') matchesFilter = stockNum > 0 && stockNum <= 3;
    else if (stockFilter === 'out') matchesFilter = stockNum === 0;
    else if (stockFilter === 'in') matchesFilter = stockNum > 3;

    return matchesSearch && matchesFilter;
  });

  // Filtered Orders for Orders Tab
  const filteredOrders = ordersList.filter(ord => {
    const matchesSearch = ordersSearchTerm.trim() === '' ||
      ord.id?.toLowerCase().includes(ordersSearchTerm.toLowerCase()) ||
      ord.customerName?.toLowerCase().includes(ordersSearchTerm.toLowerCase()) ||
      ord.shippingAddress?.fullName?.toLowerCase().includes(ordersSearchTerm.toLowerCase()) ||
      ord.mpesaPhone?.includes(ordersSearchTerm) ||
      ord.mpesaReceipt?.toLowerCase().includes(ordersSearchTerm.toLowerCase());

    const ordStatus = (ord.status || '').toLowerCase();
    let matchesStatus = true;
    if (orderStatusFilter === 'Verification Pending') {
      matchesStatus = ordStatus.includes('pending') || ordStatus.includes('verification');
    } else if (orderStatusFilter === 'Paid / Confirmed') {
      matchesStatus = ordStatus.includes('paid') || ordStatus.includes('confirmed');
    } else if (orderStatusFilter !== 'all') {
      matchesStatus = ordStatus === orderStatusFilter.toLowerCase();
    }

    return matchesSearch && matchesStatus;
  });

  // Navigation Items Definition
  const navMenuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, badge: null },
    { id: 'products', label: 'Products', icon: Package, badge: totalProductsCount },
    { id: 'add-product', label: 'Add Product', icon: PlusCircle, badge: null, isAction: true },
    { id: 'stock', label: 'Manage Stock', icon: Boxes, badge: (lowStockCount + outOfStockCount) > 0 ? `${lowStockCount + outOfStockCount}` : null, badgeColor: outOfStockCount > 0 ? '#EF4444' : '#F59E0B' },
    { id: 'orders', label: 'Orders', icon: ShoppingBag, badge: ordersList.length },
    { id: 'settings', label: 'Settings', icon: Settings, badge: null }
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#07070A', color: 'var(--text-primary)', fontFamily: 'var(--font-sans)', display: 'flex', flexDirection: 'column' }}>
      
      {/* =================================================================
          1. TOP LUXURY ADMIN HEADER
          ================================================================= */}
      <header 
        style={{
          background: 'linear-gradient(180deg, #13121E 0%, #09090D 100%)',
          borderBottom: '1px solid var(--border-gold)',
          padding: '1rem 2rem',
          position: 'sticky',
          top: 0,
          zIndex: 50,
          boxShadow: '0 4px 30px rgba(0,0,0,0.85)'
        }}
      >
        <div style={{ maxWidth: '1440px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          
          {/* Brand & Portal Title */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <Logo size="sm" />
            <div style={{ borderLeft: '1px solid var(--border-subtle)', paddingLeft: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ShieldCheck size={16} color="var(--gold-400)" />
                <span style={{ fontFamily: 'var(--font-serif)', fontSize: '1.15rem', color: 'var(--text-pure-white)', fontWeight: '700', letterSpacing: '0.04em' }}>
                  LUXE NIA Administrator Suite
                </span>
                <span style={{ background: 'rgba(212,175,55,0.15)', color: 'var(--gold-300)', fontSize: '0.68rem', padding: '2px 8px', borderRadius: '10px', border: '1px solid var(--border-gold)', fontWeight: '700' }}>
                  ADMIN ACCESS
                </span>
              </div>
              <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                {adminUser?.name || 'Administrator'} ({adminUser?.email || 'admin@luxenia.com'})
              </span>
            </div>
          </div>

          {/* Right Global Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            {/* View Customer Storefront */}
            <Link
              to="/shop"
              target="_blank"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-xs)',
                color: 'var(--text-secondary)',
                padding: '0.55rem 1rem',
                fontSize: '0.82rem',
                textDecoration: 'none',
                transition: 'all 0.2s ease'
              }}
            >
              <Eye size={15} color="var(--gold-400)" />
              <span>View Customer Shop</span>
              <ArrowUpRight size={13} />
            </Link>

            {/* Refresh Sync */}
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                background: 'rgba(212,175,55,0.1)',
                border: '1px solid var(--border-gold)',
                borderRadius: 'var(--radius-xs)',
                color: 'var(--gold-300)',
                padding: '0.55rem 1rem',
                fontSize: '0.82rem',
                cursor: 'pointer',
                fontWeight: '600'
              }}
              title="Sync latest products from database"
            >
              <RefreshCw size={14} className={isRefreshing ? 'animate-spin' : ''} />
              <span>Sync</span>
            </button>

            {/* Logout Button */}
            <button
              onClick={() => {
                logout();
                navigate('/admin-login');
                addToast('Logged out of admin session.', 'gold');
              }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                background: 'rgba(239,68,68,0.12)',
                border: '1px solid rgba(239,68,68,0.35)',
                borderRadius: 'var(--radius-xs)',
                color: '#F87171',
                padding: '0.55rem 1.1rem',
                fontSize: '0.82rem',
                cursor: 'pointer',
                fontWeight: '600'
              }}
            >
              <LogOut size={14} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* =================================================================
          2. LUXURY ATELIER NAVIGATION BAR (PRIMARY MENU BUTTONS)
          ================================================================= */}
      <nav 
        style={{
          background: 'rgba(18, 17, 28, 0.95)',
          borderBottom: '1px solid rgba(212, 175, 55, 0.25)',
          padding: '0.65rem 2rem',
          backdropFilter: 'blur(10px)',
          position: 'sticky',
          top: '73px',
          zIndex: 40
        }}
      >
        <div 
          style={{
            maxWidth: '1440px',
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            overflowX: 'auto',
            paddingBottom: '2px'
          }}
        >
          {navMenuItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  if (item.id === 'add-product') {
                    openAddModal();
                  } else {
                    handleTabChange(item.id);
                  }
                }}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '0.65rem 1.25rem',
                  borderRadius: 'var(--radius-xs)',
                  fontSize: '0.88rem',
                  fontWeight: isActive ? '700' : '500',
                  letterSpacing: '0.04em',
                  cursor: 'pointer',
                  border: isActive 
                    ? '1px solid var(--gold-400)' 
                    : item.isAction 
                      ? '1px solid rgba(212,175,55,0.4)' 
                      : '1px solid transparent',
                  background: isActive 
                    ? 'linear-gradient(135deg, rgba(212,175,55,0.22) 0%, rgba(212,175,55,0.08) 100%)' 
                    : item.isAction 
                      ? 'rgba(212,175,55,0.1)' 
                      : 'transparent',
                  color: isActive ? 'var(--gold-300)' : item.isAction ? 'var(--gold-400)' : 'var(--text-secondary)',
                  transition: 'all 0.2s ease',
                  whiteSpace: 'nowrap'
                }}
              >
                <Icon size={16} color={isActive ? 'var(--gold-400)' : item.isAction ? 'var(--gold-400)' : 'currentColor'} />
                <span>{item.label}</span>
                {item.badge !== null && (
                  <span 
                    style={{
                      background: item.badgeColor || (isActive ? 'var(--gold-400)' : 'rgba(255,255,255,0.12)'),
                      color: item.badgeColor ? '#fff' : isActive ? '#000' : '#fff',
                      fontSize: '0.68rem',
                      fontWeight: '700',
                      padding: '1px 6px',
                      borderRadius: '10px',
                      marginLeft: '2px'
                    }}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          {/* Direct Logout Tab Button */}
          <button
            onClick={() => {
              logout();
              navigate('/admin-login');
              addToast('Logged out of admin session.', 'gold');
            }}
            style={{
              marginLeft: 'auto',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '0.65rem 1rem',
              borderRadius: 'var(--radius-xs)',
              fontSize: '0.84rem',
              fontWeight: '600',
              cursor: 'pointer',
              border: '1px solid rgba(239,68,68,0.25)',
              background: 'transparent',
              color: '#F87171',
              transition: 'all 0.2s ease'
            }}
          >
            <LogOut size={14} />
            <span>Logout</span>
          </button>
        </div>
      </nav>

      {/* =================================================================
          3. MAIN CONTENT CONTAINER (SWITCHES ACCORDING TO ACTIVE TAB)
          ================================================================= */}
      <main style={{ maxWidth: '1440px', margin: '0 auto', padding: '2.5rem 2rem 5rem', flex: 1, width: '100%' }}>

        {/* -------------------------------------------------------------
            TAB 1: DASHBOARD OVERVIEW
            ------------------------------------------------------------- */}
        {activeTab === 'dashboard' && (
          <div>
            {/* Greeting & Headline */}
            <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.25rem' }}>
                  <Sparkles size={16} color="var(--gold-400)" />
                  <span style={{ fontSize: '0.74rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--gold-400)', fontWeight: '700' }}>
                    ATELIER METRICS & PERFORMANCE
                  </span>
                </div>
                <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', color: 'var(--text-pure-white)', margin: 0 }}>
                  Atelier Executive Overview
                </h1>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button
                  onClick={openAddModal}
                  className="btn-gold"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '0.65rem 1.25rem', fontSize: '0.85rem' }}
                >
                  <PlusCircle size={16} />
                  <span>Add New Product</span>
                </button>
                <button
                  onClick={() => handleTabChange('stock')}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '0.65rem 1.25rem',
                    fontSize: '0.85rem',
                    background: 'rgba(212,175,55,0.1)',
                    border: '1px solid var(--border-gold)',
                    color: 'var(--gold-300)',
                    borderRadius: 'var(--radius-xs)',
                    cursor: 'pointer'
                  }}
                >
                  <Boxes size={16} />
                  <span>Manage Stock</span>
                </button>
              </div>
            </div>

            {/* Metric Stat Cards */}
            <div 
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: '1.25rem',
                marginBottom: '2.5rem'
              }}
            >
              {/* Total Catalog Items */}
              <div 
                onClick={() => handleTabChange('products')}
                style={{
                  background: 'linear-gradient(145deg, #13121C 0%, #09090D 100%)',
                  border: '1px solid var(--border-gold)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '1.5rem',
                  boxShadow: '0 8px 25px rgba(0,0,0,0.6)',
                  cursor: 'pointer',
                  transition: 'transform 0.2s ease'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <span style={{ fontSize: '0.74rem', textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--text-muted)' }}>
                    Total Catalog Items
                  </span>
                  <Package size={18} color="var(--gold-400)" />
                </div>
                <div style={{ fontSize: '2.2rem', fontFamily: 'var(--font-serif)', color: 'var(--text-pure-white)', fontWeight: '700' }}>
                  {totalProductsCount}
                </div>
                <span style={{ fontSize: '0.74rem', color: 'var(--gold-300)' }}>
                  {activeProductsCount} active in storefront →
                </span>
              </div>

              {/* Active in Storefront */}
              <div 
                onClick={() => handleTabChange('products')}
                style={{
                  background: 'linear-gradient(145deg, #102619 0%, #09140D 100%)',
                  border: '1px solid rgba(52,211,153,0.3)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '1.5rem',
                  boxShadow: '0 8px 25px rgba(0,0,0,0.6)',
                  cursor: 'pointer'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <span style={{ fontSize: '0.74rem', textTransform: 'uppercase', letterSpacing: '0.12em', color: 'rgba(255,255,255,0.6)' }}>
                    Active in Storefront
                  </span>
                  <Eye size={18} color="#34D399" />
                </div>
                <div style={{ fontSize: '2.2rem', fontFamily: 'var(--font-serif)', color: '#fff', fontWeight: '700' }}>
                  {activeProductsCount}
                </div>
                <span style={{ fontSize: '0.74rem', color: '#34D399' }}>
                  Visible to shoppers at /shop
                </span>
              </div>

              {/* Low Stock Alerts */}
              <div 
                onClick={() => handleTabChange('stock')}
                style={{
                  background: 'linear-gradient(145deg, #261b12 0%, #140d07 100%)',
                  border: '1px solid rgba(245,158,11,0.35)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '1.5rem',
                  boxShadow: '0 8px 25px rgba(0,0,0,0.6)',
                  cursor: 'pointer'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <span style={{ fontSize: '0.74rem', textTransform: 'uppercase', letterSpacing: '0.12em', color: 'rgba(255,255,255,0.6)' }}>
                    Stock Alerts (≤3 Units)
                  </span>
                  <AlertCircle size={18} color="#FBBF24" />
                </div>
                <div style={{ fontSize: '2.2rem', fontFamily: 'var(--font-serif)', color: '#fff', fontWeight: '700' }}>
                  {lowStockCount + outOfStockCount}
                </div>
                <span style={{ fontSize: '0.74rem', color: '#FBBF24' }}>
                  {outOfStockCount > 0 ? `${outOfStockCount} out of stock` : 'Requires artisan replenishment'} →
                </span>
              </div>

              {/* Total Stock Valuation */}
              <div 
                style={{
                  background: 'linear-gradient(145deg, #1B1826 0%, #0A0A0E 100%)',
                  border: '1px solid var(--border-gold)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '1.5rem',
                  boxShadow: '0 8px 25px rgba(0,0,0,0.6)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <span style={{ fontSize: '0.74rem', textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--text-muted)' }}>
                    Stock Valuation
                  </span>
                  <DollarSign size={18} color="var(--gold-400)" />
                </div>
                <div style={{ fontSize: '1.75rem', fontFamily: 'var(--font-serif)', color: 'var(--gold-300)', fontWeight: '700' }}>
                  KSh {totalInventoryKes.toLocaleString()}
                </div>
                <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                  Total live retail inventory value
                </span>
              </div>

              {/* Orders Processed */}
              <div 
                onClick={() => handleTabChange('orders')}
                style={{
                  background: 'linear-gradient(145deg, #17152A 0%, #0D0B18 100%)',
                  border: '1px solid rgba(168,85,247,0.3)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '1.5rem',
                  boxShadow: '0 8px 25px rgba(0,0,0,0.6)',
                  cursor: 'pointer'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <span style={{ fontSize: '0.74rem', textTransform: 'uppercase', letterSpacing: '0.12em', color: 'rgba(255,255,255,0.6)' }}>
                    Orders Managed
                  </span>
                  <ShoppingBag size={18} color="#C084FC" />
                </div>
                <div style={{ fontSize: '2.2rem', fontFamily: 'var(--font-serif)', color: '#fff', fontWeight: '700' }}>
                  {ordersList.length}
                </div>
                <span style={{ fontSize: '0.74rem', color: '#C084FC' }}>
                  KSh {totalOrdersRevenue.toLocaleString()} volume →
                </span>
              </div>
            </div>

            {/* 2-Column Dashboard Grid: Low Stock Alert & Recent Orders */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.75rem', marginBottom: '2.5rem' }}>
              
              {/* Low Stock Urgent Actions */}
              <div 
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-card)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '1.75rem'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <AlertTriangle size={18} color="var(--gold-400)" />
                    <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.15rem', color: 'var(--text-pure-white)', margin: 0 }}>
                      Stock Urgency Monitor
                    </h3>
                  </div>
                  <button
                    onClick={() => handleTabChange('stock')}
                    style={{ background: 'transparent', border: 'none', color: 'var(--gold-300)', fontSize: '0.8rem', cursor: 'pointer' }}
                  >
                    View All Stock →
                  </button>
                </div>

                {products.filter(p => (Number(p.stock) || 0) <= 3).length === 0 ? (
                  <div style={{ padding: '2rem', textAlign: 'center', color: '#34D399', fontSize: '0.88rem' }}>
                    <CheckCircle2 size={32} style={{ margin: '0 auto 0.5rem' }} />
                    All atelier handbag inventory levels are healthy.
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {products.filter(p => (Number(p.stock) || 0) <= 3).map(prod => (
                      <div 
                        key={prod.id}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          background: 'rgba(255,255,255,0.03)',
                          border: '1px solid var(--border-subtle)',
                          borderRadius: 'var(--radius-xs)',
                          padding: '0.75rem 1rem'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <img 
                            src={prod.image || '/images/products/luxe-baguette-noir-black.jpg'} 
                            alt={prod.name}
                            style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px', border: '1px solid var(--border-gold)' }}
                          />
                          <div>
                            <div style={{ fontSize: '0.86rem', fontWeight: '600', color: 'var(--text-pure-white)' }}>{prod.name}</div>
                            <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>SKU: {prod.sku} • Stock: <strong style={{ color: prod.stock === 0 ? '#EF4444' : '#F59E0B' }}>{prod.stock} left</strong></div>
                          </div>
                        </div>

                        <button
                          onClick={() => handleAdjustStock(prod, 5)}
                          style={{
                            background: 'rgba(212,175,55,0.15)',
                            border: '1px solid var(--border-gold)',
                            color: 'var(--gold-300)',
                            borderRadius: 'var(--radius-xs)',
                            padding: '4px 10px',
                            fontSize: '0.75rem',
                            fontWeight: '700',
                            cursor: 'pointer'
                          }}
                        >
                          +5 Restock
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Recent Orders Overview */}
              <div 
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-card)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '1.75rem'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <ShoppingBag size={18} color="var(--gold-400)" />
                    <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.15rem', color: 'var(--text-pure-white)', margin: 0 }}>
                      Latest Customer Orders
                    </h3>
                  </div>
                  <button
                    onClick={() => handleTabChange('orders')}
                    style={{ background: 'transparent', border: 'none', color: 'var(--gold-300)', fontSize: '0.8rem', cursor: 'pointer' }}
                  >
                    View All Orders →
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {ordersList.slice(0, 3).map(ord => (
                    <div 
                      key={ord.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        background: 'rgba(255,255,255,0.03)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: 'var(--radius-xs)',
                        padding: '0.75rem 1rem'
                      }}
                    >
                      <div>
                        <div style={{ fontSize: '0.86rem', fontWeight: '600', color: 'var(--text-pure-white)' }}>
                          {ord.id} • {ord.customerName || ord.shippingAddress?.fullName || 'Valued Client'}
                        </div>
                        <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                          KSh {Number(ord.total).toLocaleString()} • {ord.items?.length || 1} item(s) • {new Date(ord.date).toLocaleDateString()}
                        </div>
                      </div>

                      <span 
                        style={{
                          background: ord.status === 'Delivered' ? 'rgba(52,211,153,0.15)' : 'rgba(212,175,55,0.15)',
                          color: ord.status === 'Delivered' ? '#34D399' : 'var(--gold-300)',
                          border: `1px solid ${ord.status === 'Delivered' ? 'rgba(52,211,153,0.4)' : 'var(--border-gold)'}`,
                          padding: '3px 10px',
                          borderRadius: '12px',
                          fontSize: '0.72rem',
                          fontWeight: '700'
                        }}
                      >
                        {ord.status || 'Delivered'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Navigation Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
              <div 
                onClick={() => handleTabChange('products')}
                style={{
                  background: 'linear-gradient(135deg, rgba(22,20,32,0.8) 0%, rgba(12,12,16,0.9) 100%)',
                  border: '1px solid var(--border-gold)',
                  borderRadius: 'var(--radius-xs)',
                  padding: '1.5rem',
                  cursor: 'pointer'
                }}
              >
                <Package size={22} color="var(--gold-400)" style={{ marginBottom: '0.5rem' }} />
                <h4 style={{ color: 'var(--text-pure-white)', margin: '0 0 0.25rem', fontFamily: 'var(--font-serif)' }}>Manage Handbag Catalog</h4>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: 0 }}>Add, edit, price, and publish luxury pieces to the live collection.</p>
              </div>

              <div 
                onClick={() => handleTabChange('stock')}
                style={{
                  background: 'linear-gradient(135deg, rgba(22,20,32,0.8) 0%, rgba(12,12,16,0.9) 100%)',
                  border: '1px solid var(--border-gold)',
                  borderRadius: 'var(--radius-xs)',
                  padding: '1.5rem',
                  cursor: 'pointer'
                }}
              >
                <Boxes size={22} color="var(--gold-400)" style={{ marginBottom: '0.5rem' }} />
                <h4 style={{ color: 'var(--text-pure-white)', margin: '0 0 0.25rem', fontFamily: 'var(--font-serif)' }}>Live Stock Controller</h4>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: 0 }}>Adjust unit quantities, restock batches, and track low stock warnings.</p>
              </div>

              <div 
                onClick={() => handleTabChange('settings')}
                style={{
                  background: 'linear-gradient(135deg, rgba(22,20,32,0.8) 0%, rgba(12,12,16,0.9) 100%)',
                  border: '1px solid var(--border-gold)',
                  borderRadius: 'var(--radius-xs)',
                  padding: '1.5rem',
                  cursor: 'pointer'
                }}
              >
                <Settings size={22} color="var(--gold-400)" style={{ marginBottom: '0.5rem' }} />
                <h4 style={{ color: 'var(--text-pure-white)', margin: '0 0 0.25rem', fontFamily: 'var(--font-serif)' }}>Atelier & Payment Settings</h4>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: 0 }}>Configure M-Pesa paybill/till, WhatsApp hotline, and delivery rates.</p>
              </div>
            </div>
          </div>
        )}

        {/* -------------------------------------------------------------
            TAB 2: PRODUCTS (CATALOG MANAGEMENT)
            ------------------------------------------------------------- */}
        {activeTab === 'products' && (
          <div>
            {/* Header Controls */}
            <div 
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-card)',
                borderRadius: 'var(--radius-sm)',
                padding: '1.5rem 2rem',
                marginBottom: '1.75rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '1.25rem'
              }}
            >
              {/* Search & Filters */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', flex: 1 }}>
                <div style={{ position: 'relative', minWidth: '260px', flex: 1, maxWidth: '380px' }}>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search bags by name, SKU, leather..."
                    className="form-input"
                    style={{ paddingLeft: '2.5rem', height: '42px', fontSize: '0.85rem' }}
                  />
                  <Search size={16} color="var(--gold-400)" style={{ position: 'absolute', left: '12px', top: '13px' }} />
                </div>

                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="form-select"
                  style={{ width: 'auto', height: '42px', fontSize: '0.84rem' }}
                >
                  <option value="all">All Categories</option>
                  <option value="handbags">Designer Bags</option>
                  <option value="clutches">Evening Clutches</option>
                  <option value="crossbody">Crossbody Bags</option>
                  <option value="wallets">Small Leather Goods</option>
                </select>

                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="form-select"
                  style={{ width: 'auto', height: '42px', fontSize: '0.84rem' }}
                >
                  <option value="all">All Statuses</option>
                  <option value="active">Active Storefront</option>
                  <option value="draft">Draft / Hidden</option>
                  <option value="out_of_stock">Out of Stock</option>
                </select>
              </div>

              {/* Add Product Button */}
              <button
                onClick={openAddModal}
                className="btn-gold"
                style={{
                  padding: '0.75rem 1.5rem',
                  fontSize: '0.88rem',
                  fontWeight: '700',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <PlusCircle size={18} />
                <span>ADD NEW PRODUCT</span>
              </button>
            </div>

            {/* Products Table */}
            <div 
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-card)',
                borderRadius: 'var(--radius-sm)',
                overflow: 'hidden',
                boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
              }}
            >
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
                  <thead>
                    <tr style={{ background: '#0D0C14', borderBottom: '1px solid var(--border-gold)', color: 'var(--gold-300)', fontSize: '0.76rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                      <th style={{ padding: '1rem 1.25rem' }}>Product Item</th>
                      <th style={{ padding: '1rem 1rem' }}>SKU</th>
                      <th style={{ padding: '1rem 1rem' }}>Price (KSh / KES)</th>
                      <th style={{ padding: '1rem 1rem' }}>Stock Level</th>
                      <th style={{ padding: '1rem 1rem' }}>Status</th>
                      <th style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.length === 0 ? (
                      <tr>
                        <td colSpan="6" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                          No products found matching the current search and filters.
                        </td>
                      </tr>
                    ) : (
                      filteredProducts.map(prod => (
                        <tr 
                          key={prod.id} 
                          style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', transition: 'background 0.2s ease' }}
                          onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(212,175,55,0.04)'}
                          onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                        >
                          {/* Item Info & Image */}
                          <td style={{ padding: '1rem 1.25rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                              <img 
                                src={prod.image || '/images/products/luxe-baguette-noir-black.jpg'} 
                                alt={prod.name}
                                style={{ width: '52px', height: '52px', objectFit: 'cover', borderRadius: '4px', border: '1px solid var(--border-gold)' }}
                              />
                              <div>
                                <div style={{ fontWeight: '700', color: 'var(--text-pure-white)', fontSize: '0.92rem' }}>{prod.name}</div>
                                <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>{prod.subtitle || prod.categoryName}</div>
                              </div>
                            </div>
                          </td>

                          {/* SKU */}
                          <td style={{ padding: '1rem 1rem', color: 'var(--text-secondary)', fontFamily: 'monospace', fontSize: '0.82rem' }}>
                            {prod.sku || 'LN-HB-GEN'}
                          </td>

                          {/* Price */}
                          <td style={{ padding: '1rem 1rem' }}>
                            <div style={{ fontWeight: '700', color: 'var(--gold-300)' }}>KSh {Number(prod.priceKes || 0).toLocaleString()}</div>
                            <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>KES {Number(prod.priceKes || 0).toLocaleString()}</div>
                          </td>

                          {/* Stock */}
                          <td style={{ padding: '1rem 1rem' }}>
                            <span 
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '6px',
                                background: prod.stock > 5 ? 'rgba(52,211,153,0.15)' : prod.stock > 0 ? 'rgba(245,158,11,0.15)' : 'rgba(239,68,68,0.15)',
                                color: prod.stock > 5 ? '#34D399' : prod.stock > 0 ? '#FBBF24' : '#F87171',
                                border: `1px solid ${prod.stock > 5 ? 'rgba(52,211,153,0.3)' : prod.stock > 0 ? 'rgba(245,158,11,0.3)' : 'rgba(239,68,68,0.3)'}`,
                                padding: '3px 8px',
                                borderRadius: '10px',
                                fontSize: '0.75rem',
                                fontWeight: '700'
                              }}
                            >
                              {prod.stock} units
                            </span>
                          </td>

                          {/* Status */}
                          <td style={{ padding: '1rem 1rem' }}>
                            <span 
                              style={{
                                display: 'inline-block',
                                padding: '4px 10px',
                                borderRadius: 'var(--radius-full)',
                                fontSize: '0.72rem',
                                fontWeight: '700',
                                textTransform: 'uppercase',
                                letterSpacing: '0.05em',
                                background: prod.status === 'active' ? 'rgba(52,211,153,0.15)' : prod.status === 'draft' ? 'rgba(156,163,175,0.15)' : 'rgba(239,68,68,0.15)',
                                color: prod.status === 'active' ? '#34D399' : prod.status === 'draft' ? '#9CA3AF' : '#F87171',
                                border: `1px solid ${prod.status === 'active' ? 'rgba(52,211,153,0.3)' : prod.status === 'draft' ? 'rgba(156,163,175,0.3)' : 'rgba(239,68,68,0.3)'}`
                              }}
                            >
                              {prod.status === 'active' ? 'Storefront Live' : prod.status === 'draft' ? 'Draft' : 'Out of Stock'}
                            </span>
                          </td>

                          {/* Actions */}
                          <td style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>
                            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                              <button
                                onClick={() => openEditModal(prod)}
                                style={{
                                  background: 'rgba(212,175,55,0.1)',
                                  border: '1px solid var(--border-gold)',
                                  color: 'var(--gold-300)',
                                  borderRadius: 'var(--radius-xs)',
                                  padding: '6px 10px',
                                  fontSize: '0.76rem',
                                  cursor: 'pointer',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '4px'
                                }}
                                title="Edit Product"
                              >
                                <Edit3 size={13} />
                                <span>Edit</span>
                              </button>

                              <button
                                onClick={() => setDeletingProduct(prod)}
                                style={{
                                  background: 'rgba(239,68,68,0.1)',
                                  border: '1px solid rgba(239,68,68,0.3)',
                                  color: '#F87171',
                                  borderRadius: 'var(--radius-xs)',
                                  padding: '6px 8px',
                                  fontSize: '0.76rem',
                                  cursor: 'pointer'
                                }}
                                title="Delete Product"
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* -------------------------------------------------------------
            TAB 3: ADD PRODUCT (FULL FORM VIEW)
            ------------------------------------------------------------- */}
        {activeTab === 'add-product' && (
          <div style={{ maxWidth: '900px', margin: '0 auto' }}>
            <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.75rem', color: 'var(--text-pure-white)', margin: '0 0 0.25rem' }}>
                  Add Handbag to Luxe Nia Collection
                </h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.86rem', margin: 0 }}>
                  Publish a new handcrafted leather creation with high-resolution photography and specifications.
                </p>
              </div>
              <button
                onClick={() => handleTabChange('products')}
                style={{ background: 'transparent', border: '1px solid var(--border-subtle)', color: 'var(--text-secondary)', padding: '0.55rem 1rem', borderRadius: 'var(--radius-xs)', cursor: 'pointer', fontSize: '0.84rem' }}
              >
                Back to Catalog
              </button>
            </div>

            <form onSubmit={handleSaveProduct} style={{ background: 'var(--bg-card)', border: '1px solid var(--border-gold)', borderRadius: 'var(--radius-sm)', padding: '2.5rem', boxShadow: '0 15px 40px rgba(0,0,0,0.6)' }}>
              
              {/* Product Basic Details */}
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.25rem', marginBottom: '1.25rem' }}>
                <div className="form-group">
                  <label className="form-label" style={{ color: 'var(--gold-300)', fontSize: '0.84rem' }}>Product Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. The Sovereign Baguette — Emerald Noir"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" style={{ color: 'var(--gold-300)', fontSize: '0.84rem' }}>SKU Reference</label>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <input
                      type="text"
                      value={formData.sku}
                      onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                      className="form-input"
                      placeholder="LN-HB-008"
                    />
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, sku: `LN-HB-${Date.now().toString().slice(-4)}` })}
                      style={{ background: 'rgba(212,175,55,0.15)', border: '1px solid var(--border-gold)', color: 'var(--gold-300)', padding: '0 10px', borderRadius: 'var(--radius-xs)', fontSize: '0.72rem', cursor: 'pointer' }}
                    >
                      Auto
                    </button>
                  </div>
                </div>
              </div>

              {/* Subtitle & Category */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.25rem' }}>
                <div className="form-group">
                  <label className="form-label" style={{ color: 'var(--gold-300)', fontSize: '0.84rem' }}>Atelier Tagline / Subtitle</label>
                  <input
                    type="text"
                    value={formData.subtitle}
                    onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                    className="form-input"
                    placeholder="Supple Calfskin with Polished Gold Hardware"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" style={{ color: 'var(--gold-300)', fontSize: '0.84rem' }}>Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => {
                      const catName = e.target.value === 'handbags' ? 'Designer Bags' : e.target.value === 'clutches' ? 'Evening Clutches' : e.target.value === 'crossbody' ? 'Crossbody Bags' : 'Small Leather Goods';
                      setFormData({ ...formData, category: e.target.value, categoryName: catName });
                    }}
                    className="form-select"
                  >
                    <option value="handbags">Designer Bags</option>
                    <option value="clutches">Evening Clutches</option>
                    <option value="crossbody">Crossbody Bags</option>
                    <option value="wallets">Small Leather Goods</option>
                  </select>
                </div>
              </div>

              {/* Pricing & Stock */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.25rem' }}>
                <div className="form-group">
                  <label className="form-label" style={{ color: 'var(--gold-300)', fontSize: '0.84rem' }}>Price in KSh (KES) *</label>
                  <input
                    type="number"
                    required
                    min="100"
                    value={formData.priceKes}
                    onChange={(e) => {
                      const kes = Number(e.target.value);
                      setFormData({ ...formData, priceKes: kes, priceUsd: Math.round(kes / 130) });
                    }}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" style={{ color: 'var(--gold-300)', fontSize: '0.84rem' }}>Initial Stock (Units)</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                    className="form-input"
                  />
                </div>
              </div>

              {/* Image Upload Area */}
              <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                <label className="form-label" style={{ color: 'var(--gold-300)', fontSize: '0.84rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <ImageIcon size={14} />
                  <span>Handbag Photo</span>
                </label>

                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  {imagePreview && (
                    <div style={{ width: '90px', height: '90px', borderRadius: '4px', border: '1px solid var(--border-gold)', overflow: 'hidden', flexShrink: 0 }}>
                      <img src={imagePreview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                  )}

                  <div style={{ flex: 1 }}>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleImageFileChange}
                      accept="image/*"
                      style={{ display: 'none' }}
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploadingImage}
                      style={{
                        width: '100%',
                        padding: '0.85rem',
                        border: '1px dashed var(--border-gold)',
                        background: 'rgba(212,175,55,0.06)',
                        color: 'var(--gold-300)',
                        borderRadius: 'var(--radius-xs)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        fontSize: '0.85rem',
                        marginBottom: '0.5rem'
                      }}
                    >
                      <Upload size={16} />
                      <span>{isUploadingImage ? 'Uploading Image...' : 'Click to Upload High-Res Image from Computer'}</span>
                    </button>
                    <input
                      type="text"
                      value={formData.image}
                      onChange={(e) => {
                        setFormData({ ...formData, image: e.target.value });
                        setImagePreview(e.target.value);
                      }}
                      placeholder="Or enter direct image URL (/images/products/...)"
                      className="form-input"
                      style={{ fontSize: '0.82rem', height: '38px' }}
                    />
                  </div>
                </div>
              </div>

              {/* Description & Craftsmanship */}
              <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                <label className="form-label" style={{ color: 'var(--gold-300)', fontSize: '0.84rem' }}>Atelier Craftsmanship Details (1 per line)</label>
                <textarea
                  rows="3"
                  value={formData.detailsText}
                  onChange={(e) => setFormData({ ...formData, detailsText: e.target.value })}
                  className="form-input"
                  style={{ resize: 'vertical' }}
                />
              </div>

              {/* Submit Action */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '1.5rem' }}>
                <button
                  type="button"
                  onClick={() => handleTabChange('products')}
                  style={{ background: 'transparent', border: '1px solid var(--border-subtle)', color: 'var(--text-secondary)', padding: '0.75rem 1.5rem', borderRadius: 'var(--radius-xs)', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-gold"
                  style={{ padding: '0.75rem 2rem', fontWeight: '700', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
                >
                  <Save size={16} />
                  <span>{isSubmitting ? 'SAVING...' : 'PUBLISH TO LIVE CATALOG'}</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* -------------------------------------------------------------
            TAB 4: MANAGE STOCK (INVENTORY CONTROL SUITE)
            ------------------------------------------------------------- */}
        {activeTab === 'stock' && (
          <div>
            {/* Header */}
            <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.25rem' }}>
                  <Boxes size={16} color="var(--gold-400)" />
                  <span style={{ fontSize: '0.74rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--gold-400)', fontWeight: '700' }}>
                    INVENTORY & WAREHOUSE CONTROL
                  </span>
                </div>
                <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', color: 'var(--text-pure-white)', margin: 0 }}>
                  Manage Handbag Stock Levels
                </h1>
              </div>

              {/* Sync & Quick Info */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <button
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                  className="btn-gold"
                  style={{ padding: '0.65rem 1.25rem', fontSize: '0.85rem', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                >
                  <RefreshCw size={14} className={isRefreshing ? 'animate-spin' : ''} />
                  <span>Sync Stock</span>
                </button>
              </div>
            </div>

            {/* Quick Filter Tabs */}
            <div 
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-card)',
                borderRadius: 'var(--radius-sm)',
                padding: '1.25rem 1.75rem',
                marginBottom: '1.75rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '1rem'
              }}
            >
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <button
                  onClick={() => setStockFilter('all')}
                  style={{
                    background: stockFilter === 'all' ? 'var(--gold-400)' : 'rgba(255,255,255,0.06)',
                    color: stockFilter === 'all' ? '#000' : 'var(--text-secondary)',
                    border: 'none',
                    padding: '0.5rem 1rem',
                    borderRadius: 'var(--radius-xs)',
                    fontSize: '0.82rem',
                    fontWeight: '700',
                    cursor: 'pointer'
                  }}
                >
                  All Bags ({products.length})
                </button>
                <button
                  onClick={() => setStockFilter('low')}
                  style={{
                    background: stockFilter === 'low' ? '#F59E0B' : 'rgba(245,158,11,0.12)',
                    color: stockFilter === 'low' ? '#000' : '#FBBF24',
                    border: '1px solid rgba(245,158,11,0.3)',
                    padding: '0.5rem 1rem',
                    borderRadius: 'var(--radius-xs)',
                    fontSize: '0.82rem',
                    fontWeight: '700',
                    cursor: 'pointer'
                  }}
                >
                  Low Stock ≤ 3 ({lowStockCount})
                </button>
                <button
                  onClick={() => setStockFilter('out')}
                  style={{
                    background: stockFilter === 'out' ? '#EF4444' : 'rgba(239,68,68,0.12)',
                    color: stockFilter === 'out' ? '#fff' : '#F87171',
                    border: '1px solid rgba(239,68,68,0.3)',
                    padding: '0.5rem 1rem',
                    borderRadius: 'var(--radius-xs)',
                    fontSize: '0.82rem',
                    fontWeight: '700',
                    cursor: 'pointer'
                  }}
                >
                  Out of Stock ({outOfStockCount})
                </button>
                <button
                  onClick={() => setStockFilter('in')}
                  style={{
                    background: stockFilter === 'in' ? '#10B981' : 'rgba(16,185,129,0.12)',
                    color: stockFilter === 'in' ? '#000' : '#34D399',
                    border: '1px solid rgba(16,185,129,0.3)',
                    padding: '0.5rem 1rem',
                    borderRadius: 'var(--radius-xs)',
                    fontSize: '0.82rem',
                    fontWeight: '700',
                    cursor: 'pointer'
                  }}
                >
                  In Stock &gt; 3 ({products.length - lowStockCount - outOfStockCount})
                </button>
              </div>

              {/* Search */}
              <div style={{ position: 'relative', minWidth: '240px' }}>
                <input
                  type="text"
                  value={stockSearchTerm}
                  onChange={(e) => setStockSearchTerm(e.target.value)}
                  placeholder="Filter stock by name or SKU..."
                  className="form-input"
                  style={{ paddingLeft: '2.3rem', height: '38px', fontSize: '0.84rem' }}
                />
                <Search size={14} color="var(--gold-400)" style={{ position: 'absolute', left: '10px', top: '12px' }} />
              </div>
            </div>

            {/* Inventory Table */}
            <div 
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-card)',
                borderRadius: 'var(--radius-sm)',
                overflow: 'hidden'
              }}
            >
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
                  <thead>
                    <tr style={{ background: '#0D0C14', borderBottom: '1px solid var(--border-gold)', color: 'var(--gold-300)', fontSize: '0.76rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                      <th style={{ padding: '1rem 1.25rem' }}>Handbag</th>
                      <th style={{ padding: '1rem 1rem' }}>SKU</th>
                      <th style={{ padding: '1rem 1rem' }}>Price</th>
                      <th style={{ padding: '1rem 1rem' }}>Current Stock</th>
                      <th style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>Quick Adjustments</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredStockProducts.length === 0 ? (
                      <tr>
                        <td colSpan="5" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                          No products found for selected stock criteria.
                        </td>
                      </tr>
                    ) : (
                      filteredStockProducts.map(prod => {
                        const stockNum = Number(prod.stock) || 0;
                        return (
                          <tr 
                            key={prod.id} 
                            style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', transition: 'background 0.2s ease' }}
                          >
                            <td style={{ padding: '1rem 1.25rem' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <img 
                                  src={prod.image || '/images/products/luxe-baguette-noir-black.jpg'} 
                                  alt={prod.name}
                                  style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '4px', border: '1px solid var(--border-gold)' }}
                                />
                                <div>
                                  <div style={{ fontWeight: '700', color: 'var(--text-pure-white)' }}>{prod.name}</div>
                                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{prod.material || 'Full-Grain Calf Leather'}</div>
                                </div>
                              </div>
                            </td>

                            <td style={{ padding: '1rem 1rem', fontFamily: 'monospace', color: 'var(--text-secondary)' }}>
                              {prod.sku}
                            </td>

                            <td style={{ padding: '1rem 1rem', fontWeight: '700', color: 'var(--gold-300)' }}>
                              KSh {Number(prod.priceKes).toLocaleString()}
                            </td>

                            {/* Stock Indicator */}
                            <td style={{ padding: '1rem 1rem' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <input
                                  type="number"
                                  min="0"
                                  value={stockNum}
                                  onChange={(e) => handleSetStockDirect(prod, e.target.value)}
                                  className="form-input"
                                  style={{ width: '70px', height: '36px', textAlign: 'center', fontWeight: '700', fontSize: '0.9rem' }}
                                />
                                <span 
                                  style={{
                                    fontSize: '0.74rem',
                                    fontWeight: '700',
                                    padding: '3px 8px',
                                    borderRadius: '8px',
                                    background: stockNum > 5 ? 'rgba(52,211,153,0.15)' : stockNum > 0 ? 'rgba(245,158,11,0.15)' : 'rgba(239,68,68,0.15)',
                                    color: stockNum > 5 ? '#34D399' : stockNum > 0 ? '#FBBF24' : '#F87171'
                                  }}
                                >
                                  {stockNum > 5 ? 'In Stock' : stockNum > 0 ? 'Low' : 'Empty'}
                                </span>
                              </div>
                            </td>

                            {/* Stepper Buttons */}
                            <td style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>
                              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                                <button
                                  onClick={() => handleAdjustStock(prod, -5)}
                                  style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)', padding: '5px 8px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.74rem' }}
                                  title="Decrease by 5"
                                >
                                  -5
                                </button>
                                <button
                                  onClick={() => handleAdjustStock(prod, -1)}
                                  style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)', padding: '5px 8px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.74rem' }}
                                  title="Decrease by 1"
                                >
                                  -1
                                </button>
                                <button
                                  onClick={() => handleAdjustStock(prod, 1)}
                                  style={{ background: 'rgba(212,175,55,0.15)', border: '1px solid var(--border-gold)', color: 'var(--gold-300)', padding: '5px 8px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.74rem', fontWeight: '700' }}
                                  title="Increase by 1"
                                >
                                  +1
                                </button>
                                <button
                                  onClick={() => handleAdjustStock(prod, 5)}
                                  style={{ background: 'rgba(212,175,55,0.15)', border: '1px solid var(--border-gold)', color: 'var(--gold-300)', padding: '5px 8px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.74rem', fontWeight: '700' }}
                                  title="Increase by 5"
                                >
                                  +5
                                </button>
                                <button
                                  onClick={() => handleAdjustStock(prod, 10)}
                                  style={{ background: 'rgba(212,175,55,0.25)', border: '1px solid var(--gold-400)', color: 'var(--gold-300)', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.74rem', fontWeight: '700' }}
                                  title="Restock batch of 10"
                                >
                                  +10
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* -------------------------------------------------------------
            TAB 5: ORDERS (CUSTOMER ORDERS MANAGEMENT)
            ------------------------------------------------------------- */}
        {activeTab === 'orders' && (
          <div>
            {/* Header */}
            <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.25rem' }}>
                  <ShoppingBag size={16} color="var(--gold-400)" />
                  <span style={{ fontSize: '0.74rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--gold-400)', fontWeight: '700' }}>
                    CLIENT ORDERS & FULFILLMENT
                  </span>
                </div>
                <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', color: 'var(--text-pure-white)', margin: 0 }}>
                  Customer Orders & Courier Dispatch
                </h1>
              </div>

              {/* Total Orders Metric */}
              <div style={{ background: 'rgba(212,175,55,0.1)', border: '1px solid var(--border-gold)', padding: '0.6rem 1.25rem', borderRadius: 'var(--radius-xs)' }}>
                <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>Total Orders: </span>
                <strong style={{ color: 'var(--gold-300)' }}>{ordersList.length}</strong>
              </div>
            </div>

            {/* Filter & Search Bar */}
            <div 
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-card)',
                borderRadius: 'var(--radius-sm)',
                padding: '1.25rem 1.75rem',
                marginBottom: '1.75rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '1rem'
              }}
            >
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {['all', 'Verification Pending', 'Paid / Confirmed', 'Processing', 'Dispatched', 'Delivered'].map(status => (
                  <button
                    key={status}
                    onClick={() => setOrderStatusFilter(status)}
                    style={{
                      background: orderStatusFilter === status ? 'var(--gold-400)' : 'rgba(255,255,255,0.06)',
                      color: orderStatusFilter === status ? '#000' : 'var(--text-secondary)',
                      border: 'none',
                      padding: '0.5rem 1rem',
                      borderRadius: 'var(--radius-xs)',
                      fontSize: '0.82rem',
                      fontWeight: '700',
                      cursor: 'pointer'
                    }}
                  >
                    {status === 'all' ? 'All Orders' : status}
                  </button>
                ))}
              </div>

              <div style={{ position: 'relative', minWidth: '260px' }}>
                <input
                  type="text"
                  value={ordersSearchTerm}
                  onChange={(e) => setOrdersSearchTerm(e.target.value)}
                  placeholder="Search order ID, client name, phone..."
                  className="form-input"
                  style={{ paddingLeft: '2.3rem', height: '38px', fontSize: '0.84rem' }}
                />
                <Search size={14} color="var(--gold-400)" style={{ position: 'absolute', left: '10px', top: '12px' }} />
              </div>
            </div>

            {/* Orders List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {filteredOrders.length === 0 ? (
                <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-card)', borderRadius: 'var(--radius-sm)', padding: '4rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                  No customer orders match the current filter.
                </div>
              ) : (
                filteredOrders.map(ord => {
                  const isVerificationPending = (ord.status || '').toLowerCase().includes('pending') || (ord.status || '').toLowerCase().includes('verification');
                  const isPaid = (ord.status || '').toLowerCase().includes('paid') || (ord.status || '').toLowerCase().includes('confirmed');

                  return (
                    <div 
                      key={ord.id}
                      style={{
                        background: 'var(--bg-card)',
                        border: isVerificationPending ? '1px solid rgba(245, 158, 11, 0.4)' : isPaid ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid var(--border-card)',
                        borderRadius: 'var(--radius-sm)',
                        padding: '1.75rem',
                        boxShadow: '0 8px 25px rgba(0,0,0,0.5)',
                        position: 'relative'
                      }}
                    >
                      {/* Top Row: Order ID, Date, Status */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '1rem', marginBottom: '1.25rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <span style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', color: 'var(--text-pure-white)', fontWeight: '700' }}>
                            {ord.id}
                          </span>
                          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                            {new Date(ord.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                          </span>

                          {isVerificationPending && (
                            <span style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#F59E0B', border: '1px solid rgba(245, 158, 11, 0.4)', padding: '2px 8px', borderRadius: '4px', fontSize: '0.72rem', fontWeight: '700' }}>
                              ⚠️ Verification Pending
                            </span>
                          )}
                          {isPaid && (
                            <span style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10B981', border: '1px solid rgba(16, 185, 129, 0.4)', padding: '2px 8px', borderRadius: '4px', fontSize: '0.72rem', fontWeight: '700' }}>
                              ✓ Payment Verified
                            </span>
                          )}
                        </div>

                        {/* Status Dropdown */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Status:</span>
                          <select
                            value={ord.status || 'Payment Verification Pending'}
                            onChange={(e) => handleUpdateOrderStatus(ord.id, e.target.value)}
                            className="form-select"
                            style={{
                              width: 'auto',
                              height: '34px',
                              fontSize: '0.82rem',
                              fontWeight: '700',
                              borderColor: isPaid ? '#10B981' : isVerificationPending ? '#F59E0B' : 'var(--gold-400)'
                            }}
                          >
                            <option value="Payment Verification Pending">Payment Verification Pending</option>
                            <option value="Paid / Confirmed">Paid / Confirmed</option>
                            <option value="Processing">Processing / Inspection</option>
                            <option value="Dispatched">Dispatched / En Route</option>
                            <option value="Delivered">Delivered & Completed</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </div>
                      </div>

                      {/* Middle: Client Info & Ordered Items */}
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.25rem' }}>
                        {/* Client Delivery Details */}
                        <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: 'var(--radius-xs)', border: '1px solid var(--border-subtle)' }}>
                          <div style={{ fontSize: '0.74rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--gold-300)', marginBottom: '0.5rem', fontWeight: '700' }}>
                            Client Delivery Details
                          </div>
                          <div style={{ color: 'var(--text-pure-white)', fontWeight: '600', marginBottom: '0.25rem' }}>
                            {ord.customerName || ord.shippingAddress?.fullName || 'Valued Client'}
                          </div>
                          <div style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '0.25rem' }}>
                            <Phone size={13} color="var(--gold-400)" />
                            <span>{ord.mpesaPhone || ord.shippingAddress?.phone || '0795439545'}</span>
                            <a 
                              href={`https://wa.me/${(ord.mpesaPhone || '254795439545').replace(/\D/g, '')}?text=Hello%20${encodeURIComponent(ord.customerName || 'Client')},%20regarding%20your%20Luxe%20Nia%20Order%20${ord.id}...`}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{ color: '#34D399', fontSize: '0.74rem', marginLeft: '6px', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '3px' }}
                            >
                              <MessageCircle size={12} />
                              <span>Chat</span>
                            </a>
                          </div>
                          <div style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <MapPin size={13} color="var(--gold-400)" />
                            <span>{ord.deliveryLocation || ord.shippingAddress?.deliveryLocation || 'Kenya (Delivery details confirmed on WhatsApp)'}</span>
                          </div>
                        </div>

                        {/* Payment & Verification Box */}
                        <div style={{ background: isVerificationPending ? 'rgba(245, 158, 11, 0.05)' : 'rgba(212,175,55,0.04)', padding: '1rem', borderRadius: 'var(--radius-xs)', border: isVerificationPending ? '1px solid rgba(245, 158, 11, 0.4)' : '1px solid var(--border-gold)' }}>
                          <div style={{ fontSize: '0.74rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--gold-300)', marginBottom: '0.5rem', fontWeight: '700', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span>M-PESA Payment Verification</span>
                            <span style={{ color: '#00E676', fontFamily: 'var(--font-mono, monospace)' }}>0795439545</span>
                          </div>
                          <div style={{ fontSize: '1.25rem', fontFamily: 'var(--font-serif)', color: 'var(--gold-300)', fontWeight: '700', marginBottom: '0.4rem' }}>
                            KSh {Number(ord.total).toLocaleString()}
                          </div>

                          {isVerificationPending ? (
                            <div style={{ marginTop: '0.5rem' }}>
                              <div style={{ fontSize: '0.76rem', color: '#FCD34D', marginBottom: '0.6rem', lineHeight: '1.4' }}>
                                ⚠️ Check your M-PESA statement for <strong>KSh {Number(ord.total).toLocaleString()}</strong> before confirming. Do not rely on customer screenshots.
                              </div>
                              <button
                                onClick={() => handleUpdateOrderStatus(ord.id, 'Paid / Confirmed')}
                                style={{
                                  background: 'linear-gradient(135deg, #065F46 0%, #10B981 100%)',
                                  border: 'none',
                                  color: '#fff',
                                  padding: '6px 14px',
                                  borderRadius: 'var(--radius-xs)',
                                  fontSize: '0.78rem',
                                  fontWeight: '700',
                                  cursor: 'pointer',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '6px',
                                  boxShadow: '0 2px 8px rgba(160,185,129,0.3)'
                                }}
                              >
                                <span>✓ Verify & Mark as Paid</span>
                              </button>
                            </div>
                          ) : (
                            <div style={{ fontSize: '0.78rem', color: '#10B981', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
                              ✓ Payment Verified & Confirmed on M-PESA statement
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Ordered Items Row */}
                      <div>
                        <div style={{ fontSize: '0.74rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                          Items Ordered ({ord.items?.length || 1})
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
                          {(ord.items || []).map((item, idx) => (
                            <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(255,255,255,0.03)', padding: '6px 12px', borderRadius: '4px', border: '1px solid var(--border-subtle)' }}>
                              <img src={item.image || '/images/products/luxe-baguette-noir-black.jpg'} alt={item.name} style={{ width: '32px', height: '32px', objectFit: 'cover', borderRadius: '3px' }} />
                              <div style={{ fontSize: '0.82rem' }}>
                                <strong style={{ color: 'var(--text-pure-white)' }}>{item.name}</strong> × {item.quantity || 1}
                                <div style={{ fontSize: '0.72rem', color: 'var(--gold-300)' }}>KSh {Number(item.priceKes || ord.total).toLocaleString()}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* -------------------------------------------------------------
            TAB 6: SETTINGS (ATELIER CONFIGURATION)
            ------------------------------------------------------------- */}
        {activeTab === 'settings' && (
          <div style={{ maxWidth: '850px', margin: '0 auto' }}>
            <div style={{ marginBottom: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.25rem' }}>
                <Settings size={16} color="var(--gold-400)" />
                <span style={{ fontSize: '0.74rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--gold-400)', fontWeight: '700' }}>
                  ATELIER CONFIGURATION & PAYMENTS
                </span>
              </div>
              <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', color: 'var(--text-pure-white)', margin: 0 }}>
                Storefront & Atelier Settings
              </h1>
            </div>

            <form onSubmit={handleSaveSettings} style={{ background: 'var(--bg-card)', border: '1px solid var(--border-gold)', borderRadius: 'var(--radius-sm)', padding: '2.5rem', boxShadow: '0 15px 40px rgba(0,0,0,0.6)' }}>
              
              {/* Brand Identity */}
              <h3 style={{ fontFamily: 'var(--font-serif)', color: 'var(--gold-300)', fontSize: '1.15rem', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.5rem' }}>
                1. Brand Identity & Atelier Location
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.25rem' }}>
                <div className="form-group">
                  <label className="form-label" style={{ color: 'var(--gold-300)', fontSize: '0.84rem' }}>Storefront Name</label>
                  <input
                    type="text"
                    value={settingsData.storeName}
                    onChange={(e) => setSettingsData({ ...settingsData, storeName: e.target.value })}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" style={{ color: 'var(--gold-300)', fontSize: '0.84rem' }}>Brand Tagline</label>
                  <input
                    type="text"
                    value={settingsData.tagline}
                    onChange={(e) => setSettingsData({ ...settingsData, tagline: e.target.value })}
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: '2rem' }}>
                <label className="form-label" style={{ color: 'var(--gold-300)', fontSize: '0.84rem' }}>Physical Atelier Address</label>
                <input
                  type="text"
                  value={settingsData.atelierAddress}
                  onChange={(e) => setSettingsData({ ...settingsData, atelierAddress: e.target.value })}
                  className="form-input"
                />
              </div>

              {/* Contact & Concierge Channels */}
              <h3 style={{ fontFamily: 'var(--font-serif)', color: 'var(--gold-300)', fontSize: '1.15rem', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.5rem' }}>
                2. Concierge & Client Communications
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.25rem' }}>
                <div className="form-group">
                  <label className="form-label" style={{ color: 'var(--gold-300)', fontSize: '0.84rem' }}>WhatsApp Concierge Number</label>
                  <input
                    type="text"
                    value={settingsData.whatsappPhone}
                    onChange={(e) => setSettingsData({ ...settingsData, whatsappPhone: e.target.value })}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" style={{ color: 'var(--gold-300)', fontSize: '0.84rem' }}>Official Support Email</label>
                  <input
                    type="email"
                    value={settingsData.email}
                    onChange={(e) => setSettingsData({ ...settingsData, email: e.target.value })}
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: '2rem' }}>
                <label className="form-label" style={{ color: 'var(--gold-300)', fontSize: '0.84rem' }}>Operating Hours</label>
                <input
                  type="text"
                  value={settingsData.supportHours}
                  onChange={(e) => setSettingsData({ ...settingsData, supportHours: e.target.value })}
                  className="form-input"
                />
              </div>

              {/* Payment & Currency Settings */}
              <h3 style={{ fontFamily: 'var(--font-serif)', color: 'var(--gold-300)', fontSize: '1.15rem', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.5rem' }}>
                3. Financial & M-Pesa Settings
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.25rem', marginBottom: '1.5rem' }}>
                <div className="form-group">
                  <label className="form-label" style={{ color: 'var(--gold-300)', fontSize: '0.84rem' }}>M-Pesa Paybill</label>
                  <input
                    type="text"
                    value={settingsData.mpesaPaybill}
                    onChange={(e) => setSettingsData({ ...settingsData, mpesaPaybill: e.target.value })}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" style={{ color: 'var(--gold-300)', fontSize: '0.84rem' }}>M-Pesa Till Number</label>
                  <input
                    type="text"
                    value={settingsData.mpesaTill}
                    onChange={(e) => setSettingsData({ ...settingsData, mpesaTill: e.target.value })}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" style={{ color: 'var(--gold-300)', fontSize: '0.84rem' }}>Delivery Fee (KSh)</label>
                  <input
                    type="number"
                    value={settingsData.deliveryFee}
                    onChange={(e) => setSettingsData({ ...settingsData, deliveryFee: Number(e.target.value) })}
                    className="form-input"
                  />
                </div>
              </div>

              {/* Save Button */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid var(--border-subtle)', paddingTop: '1.5rem' }}>
                <button
                  type="submit"
                  className="btn-gold"
                  style={{ padding: '0.85rem 2.25rem', fontWeight: '700', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
                >
                  <Save size={16} />
                  <span>SAVE ATELIER SETTINGS</span>
                </button>
              </div>
            </form>
          </div>
        )}
      </main>

      {/* =================================================================
          4. MODAL: EDIT / ADD PRODUCT DIALOG
          ================================================================= */}
      {isFormModalOpen && (
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.85)',
            backdropFilter: 'blur(8px)',
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem'
          }}
        >
          <div 
            style={{
              width: '100%',
              maxWidth: '800px',
              maxHeight: '90vh',
              overflowY: 'auto',
              background: '#0D0C14',
              border: '1px solid var(--border-gold)',
              borderRadius: 'var(--radius-sm)',
              padding: '2.5rem',
              boxShadow: '0 25px 60px rgba(0,0,0,0.9)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '1rem' }}>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', color: 'var(--text-pure-white)', margin: 0 }}>
                {editingProduct ? `Edit: ${editingProduct.name}` : 'Add Handbag to Collection'}
              </h3>
              <button
                onClick={() => setIsFormModalOpen(false)}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveProduct}>
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.25rem', marginBottom: '1.25rem' }}>
                <div className="form-group">
                  <label className="form-label" style={{ color: 'var(--gold-300)', fontSize: '0.84rem' }}>Product Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" style={{ color: 'var(--gold-300)', fontSize: '0.84rem' }}>SKU</label>
                  <input
                    type="text"
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    className="form-input"
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.25rem' }}>
                <div className="form-group">
                  <label className="form-label" style={{ color: 'var(--gold-300)', fontSize: '0.84rem' }}>Subtitle</label>
                  <input
                    type="text"
                    value={formData.subtitle}
                    onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" style={{ color: 'var(--gold-300)', fontSize: '0.84rem' }}>Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="form-select"
                  >
                    <option value="handbags">Designer Bags</option>
                    <option value="clutches">Evening Clutches</option>
                    <option value="crossbody">Crossbody Bags</option>
                    <option value="wallets">Small Leather Goods</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.25rem' }}>
                <div className="form-group">
                  <label className="form-label" style={{ color: 'var(--gold-300)', fontSize: '0.84rem' }}>Price (KSh) *</label>
                  <input
                    type="number"
                    required
                    value={formData.priceKes}
                    onChange={(e) => {
                      const kes = Number(e.target.value);
                      setFormData({ ...formData, priceKes: kes, priceUsd: Math.round(kes / 130) });
                    }}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" style={{ color: 'var(--gold-300)', fontSize: '0.84rem' }}>Stock Units</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                <label className="form-label" style={{ color: 'var(--gold-300)', fontSize: '0.84rem' }}>Image URL or Upload</label>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <input
                    type="text"
                    value={formData.image}
                    onChange={(e) => {
                      setFormData({ ...formData, image: e.target.value });
                      setImagePreview(e.target.value);
                    }}
                    placeholder="/images/products/..."
                    className="form-input"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    style={{ background: 'rgba(212,175,55,0.15)', border: '1px solid var(--border-gold)', color: 'var(--gold-300)', padding: '0 14px', borderRadius: 'var(--radius-xs)', fontSize: '0.78rem', cursor: 'pointer', whiteSpace: 'nowrap' }}
                  >
                    Upload File
                  </button>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem' }}>
                <button
                  type="button"
                  onClick={() => setIsFormModalOpen(false)}
                  style={{ background: 'transparent', border: '1px solid var(--border-subtle)', color: 'var(--text-secondary)', padding: '0.7rem 1.25rem', borderRadius: 'var(--radius-xs)', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-gold"
                  style={{ padding: '0.7rem 1.75rem', fontWeight: '700' }}
                >
                  {isSubmitting ? 'SAVING...' : 'SAVE PRODUCT'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =================================================================
          5. MODAL: DELETE CONFIRMATION DIALOG
          ================================================================= */}
      {deletingProduct && (
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.85)',
            backdropFilter: 'blur(8px)',
            zIndex: 110,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem'
          }}
        >
          <div 
            style={{
              width: '100%',
              maxWidth: '450px',
              background: '#0F0E16',
              border: '1px solid rgba(239,68,68,0.4)',
              borderRadius: 'var(--radius-sm)',
              padding: '2rem',
              textAlign: 'center',
              boxShadow: '0 20px 50px rgba(0,0,0,0.9)'
            }}
          >
            <AlertTriangle size={40} color="#EF4444" style={{ margin: '0 auto 1rem' }} />
            <h3 style={{ fontFamily: 'var(--font-serif)', color: 'var(--text-pure-white)', marginBottom: '0.5rem' }}>
              Remove from Collection?
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginBottom: '1.75rem' }}>
              Are you sure you wish to delete <strong>"{deletingProduct.name}"</strong>? This will remove the piece from the active catalogue and storefront.
            </p>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
              <button
                onClick={() => setDeletingProduct(null)}
                style={{ background: 'transparent', border: '1px solid var(--border-subtle)', color: 'var(--text-secondary)', padding: '0.65rem 1.25rem', borderRadius: 'var(--radius-xs)', cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={isSubmitting}
                style={{ background: '#DC2626', border: 'none', color: '#fff', padding: '0.65rem 1.5rem', borderRadius: 'var(--radius-xs)', fontWeight: '700', cursor: 'pointer' }}
              >
                {isSubmitting ? 'DELETING...' : 'CONFIRM DELETE'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
