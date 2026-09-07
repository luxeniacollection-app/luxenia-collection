import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  User, 
  ShoppingBag, 
  Package, 
  Clock, 
  CheckCircle, 
  Truck, 
  LogOut, 
  MapPin, 
  Phone, 
  Mail, 
  ArrowRight, 
  Crown, 
  ShieldCheck, 
  Edit3, 
  Save, 
  Sparkles,
  AlertCircle 
} from 'lucide-react';
import { useCustomerAuth } from '../../context/CustomerAuthContext';
import { useCart } from '../../context/CartContext';
import { useToast } from '../common/Toast';

export default function AccountPage() {
  const navigate = useNavigate();
  const { customer, isCustomerAuthenticated, customerOrders, customerLogout, updateCustomerProfile, openAuthModal } = useCustomerAuth();
  const { cart, totalItemCount, cartTotalKes, formatPrice } = useCart();
  const { addToast } = useToast();

  const [activeTab, setActiveTab] = useState('orders'); // 'orders' | 'basket' | 'profile'
  const [orderFilter, setOrderFilter] = useState('all'); // 'all' | 'in_progress' | 'delivered' | 'delayed'
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileData, setProfileData] = useState({
    fullName: customer?.fullName || '',
    phone: customer?.phone || '',
    address: customer?.address || '',
    city: customer?.city || 'Nairobi'
  });

  // Filter calculations for orders
  const inProgressCount = customerOrders.filter(o => 
    ['New Order', 'Order Confirmed', 'Processing', 'Ready for Delivery', 'Out for Delivery'].includes(o.status) ||
    !['Delivered', 'Cancelled', 'Delayed'].includes(o.status)
  ).length;
  const deliveredCount = customerOrders.filter(o => o.status === 'Delivered').length;
  const delayedCount = customerOrders.filter(o => o.status === 'Delayed').length;

  const filteredCustomerOrders = customerOrders.filter(order => {
    if (orderFilter === 'delivered') return order.status === 'Delivered';
    if (orderFilter === 'delayed') return order.status === 'Delayed';
    if (orderFilter === 'in_progress') {
      return ['New Order', 'Order Confirmed', 'Processing', 'Ready for Delivery', 'Out for Delivery'].includes(order.status) ||
        !['Delivered', 'Cancelled', 'Delayed'].includes(order.status);
    }
    return true;
  });

  const getCustomerStatusBadge = (status) => {
    switch (status) {
      case 'New Order':
        return { bg: 'rgba(59, 130, 246, 0.15)', color: '#60A5FA', border: 'rgba(59, 130, 246, 0.35)', icon: Clock, label: 'Order Received' };
      case 'Order Confirmed':
        return { bg: 'rgba(139, 92, 246, 0.15)', color: '#A78BFA', border: 'rgba(139, 92, 246, 0.35)', icon: CheckCircle, label: 'Order Confirmed' };
      case 'Processing':
        return { bg: 'rgba(212, 175, 55, 0.15)', color: 'var(--gold-300)', border: 'var(--border-gold)', icon: Sparkles, label: 'Processing in Atelier' };
      case 'Ready for Delivery':
        return { bg: 'rgba(6, 182, 212, 0.15)', color: '#22D3EE', border: 'rgba(6, 182, 212, 0.35)', icon: Package, label: 'Ready for Delivery' };
      case 'Out for Delivery':
        return { bg: 'rgba(245, 158, 11, 0.15)', color: '#FBBF24', border: 'rgba(245, 158, 11, 0.35)', icon: Truck, label: 'Out for Delivery' };
      case 'Delivered':
        return { bg: 'rgba(16, 185, 129, 0.15)', color: '#34D399', border: 'rgba(16, 185, 129, 0.35)', icon: CheckCircle, label: 'Delivered' };
      case 'Delayed':
        return { bg: 'rgba(239, 68, 68, 0.18)', color: '#F87171', border: 'rgba(239, 68, 68, 0.45)', icon: AlertCircle, label: 'Delayed in Transit' };
      case 'Cancelled':
        return { bg: 'rgba(156, 163, 175, 0.15)', color: '#9CA3AF', border: 'rgba(156, 163, 175, 0.3)', icon: AlertCircle, label: 'Cancelled' };
      default:
        return { bg: 'rgba(212, 175, 55, 0.15)', color: 'var(--gold-300)', border: 'var(--border-gold)', icon: CheckCircle, label: status || 'Order Placed' };
    }
  };

  // Sync profile data when customer changes
  React.useEffect(() => {
    if (customer) {
      setProfileData({
        fullName: customer.fullName || '',
        phone: customer.phone || '',
        address: customer.address || '',
        city: customer.city || 'Nairobi'
      });
    }
  }, [customer]);

  const handleSaveProfile = async (e) => {
    if (e) e.preventDefault();
    await updateCustomerProfile(profileData);
    setIsEditingProfile(false);
    addToast('Your delivery preferences have been updated.', 'gold');
  };


  // If not logged in, show prestige guest view
  if (!isCustomerAuthenticated) {
    return (
      <div style={{ minHeight: '80vh', background: 'radial-gradient(ellipse at 50% 20%, #151322 0%, #08080C 70%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '3rem 1.5rem' }}>
        <div style={{ maxWidth: '520px', width: '100%', textAlign: 'center', background: 'var(--bg-card)', border: '1px solid var(--border-gold)', borderRadius: 'var(--radius-sm)', padding: 'clamp(2rem, 6vw, 3.5rem)', boxShadow: '0 25px 60px rgba(0,0,0,0.85)' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(212,175,55,0.1)', border: '1px solid var(--border-gold)', padding: '4px 14px', borderRadius: 'var(--radius-full)', marginBottom: '1.5rem' }}>
            <Crown size={14} color="var(--gold-400)" />
            <span style={{ fontSize: '0.72rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--gold-300)', fontWeight: '700' }}>
              LUXE NIA PRIVATE CLIENT SUITE
            </span>
          </div>

          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', color: 'var(--text-pure-white)', margin: '0 0 0.75rem' }}>
            Client Sign In Required
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '2rem' }}>
            Sign in to view your bag purchases, live order delivery tracking, and saved shopping basket.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <button
              onClick={() => openAuthModal('login')}
              className="btn-gold"
              style={{ width: '100%', padding: '0.9rem', fontWeight: '700', fontSize: '0.9rem' }}
            >
              Sign In to Your Account
            </button>
            <button
              onClick={() => openAuthModal('register')}
              style={{
                width: '100%',
                padding: '0.85rem',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-primary)',
                borderRadius: 'var(--radius-xs)',
                cursor: 'pointer',
                fontSize: '0.86rem',
                fontWeight: '600'
              }}
            >
              Create New Client Account
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '85vh', background: '#08080C', padding: '3rem 1.5rem 6rem', color: 'var(--text-primary)' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* Top Profile Header Banner */}
        <div 
          style={{
            background: 'linear-gradient(135deg, rgba(26, 23, 38, 0.9) 0%, rgba(13, 12, 18, 0.95) 100%)',
            border: '1px solid var(--border-gold)',
            borderRadius: 'var(--radius-sm)',
            padding: '2rem',
            marginBottom: '2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1.25rem',
            boxShadow: '0 15px 40px rgba(0,0,0,0.6)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <div 
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #2A2536 0%, #151320 100%)',
                border: '2px solid var(--border-gold)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.5rem',
                fontFamily: 'var(--font-serif)',
                color: 'var(--gold-300)',
                fontWeight: '700'
              }}
            >
              {customer?.fullName ? customer.fullName.charAt(0).toUpperCase() : 'C'}
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '0.72rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--gold-400)', fontWeight: '700' }}>
                  LUXE NIA PRIVILEGED CLIENT
                </span>
                <span style={{ background: 'rgba(52,211,153,0.15)', color: '#34D399', fontSize: '0.68rem', padding: '2px 8px', borderRadius: '10px', fontWeight: '700' }}>
                  ACTIVE
                </span>
              </div>
              <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.75rem', color: 'var(--text-pure-white)', margin: '0.25rem 0' }}>
                {customer?.fullName || 'Client'}
              </h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.82rem', color: 'var(--text-muted)', flexWrap: 'wrap' }}>
                <span>{customer?.email}</span>
                {customer?.phone && <span>• {customer.phone}</span>}
                {customer?.city && <span>• {customer.city}, Kenya</span>}
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              customerLogout();
              addToast('Signed out of client account.', 'gold');
              navigate('/');
            }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: '#F87171',
              padding: '0.6rem 1.25rem',
              borderRadius: 'var(--radius-xs)',
              cursor: 'pointer',
              fontSize: '0.82rem',
              fontWeight: '600'
            }}
          >
            <LogOut size={14} />
            <span>Sign Out</span>
          </button>
        </div>

        {/* Navigation Tabs */}
        <div style={{ display: 'flex', gap: '0.75rem', borderBottom: '1px solid var(--border-subtle)', marginBottom: '2rem', overflowX: 'auto', paddingBottom: '4px' }}>
          <button
            onClick={() => setActiveTab('orders')}
            style={{
              background: 'transparent',
              border: 'none',
              borderBottom: activeTab === 'orders' ? '2px solid var(--gold-400)' : '2px solid transparent',
              color: activeTab === 'orders' ? 'var(--gold-300)' : 'var(--text-secondary)',
              padding: '0.75rem 1.25rem',
              fontSize: '0.9rem',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              whiteSpace: 'nowrap'
            }}
          >
            <Package size={16} />
            <span>My Bag Purchases ({customerOrders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('basket')}
            style={{
              background: 'transparent',
              border: 'none',
              borderBottom: activeTab === 'basket' ? '2px solid var(--gold-400)' : '2px solid transparent',
              color: activeTab === 'basket' ? 'var(--gold-300)' : 'var(--text-secondary)',
              padding: '0.75rem 1.25rem',
              fontSize: '0.9rem',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              whiteSpace: 'nowrap'
            }}
          >
            <ShoppingBag size={16} />
            <span>My Shopping Basket ({totalItemCount})</span>
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            style={{
              background: 'transparent',
              border: 'none',
              borderBottom: activeTab === 'profile' ? '2px solid var(--gold-400)' : '2px solid transparent',
              color: activeTab === 'profile' ? 'var(--gold-300)' : 'var(--text-secondary)',
              padding: '0.75rem 1.25rem',
              fontSize: '0.9rem',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              whiteSpace: 'nowrap'
            }}
          >
            <User size={16} />
            <span>Delivery & Profile Details</span>
          </button>
        </div>

        {/* TAB 1: MY BAG PURCHASES */}
        {activeTab === 'orders' && (
          <div>
            {/* Quick Order Status Filter Tabs */}
            {customerOrders.length > 0 && (
              <div 
                style={{ 
                  display: 'flex', 
                  gap: '8px', 
                  flexWrap: 'wrap', 
                  marginBottom: '1.5rem',
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-subtle)',
                  padding: '0.85rem 1.25rem',
                  borderRadius: 'var(--radius-xs)'
                }}
              >
                {[
                  { id: 'all', label: `All Orders (${customerOrders.length})` },
                  { id: 'in_progress', label: `In Progress (${inProgressCount})` },
                  { id: 'delivered', label: `Delivered (${deliveredCount})` },
                  { id: 'delayed', label: `Delayed (${delayedCount})` }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setOrderFilter(tab.id)}
                    style={{
                      background: orderFilter === tab.id ? 'var(--gold-400)' : 'rgba(255,255,255,0.05)',
                      color: orderFilter === tab.id ? '#08080A' : 'var(--text-secondary)',
                      border: 'none',
                      padding: '0.45rem 0.95rem',
                      borderRadius: 'var(--radius-xs)',
                      fontSize: '0.82rem',
                      fontWeight: '700',
                      cursor: 'pointer'
                    }}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            )}

            {customerOrders.length === 0 ? (
              <div 
                style={{
                  textAlign: 'center',
                  padding: '4rem 2rem',
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-sm)'
                }}
              >
                <Package size={48} color="var(--gold-400)" style={{ opacity: 0.5, marginBottom: '1rem' }} />
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', color: 'var(--text-pure-white)', margin: '0 0 0.5rem' }}>
                  No Bag Purchases Yet
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', maxWidth: '420px', margin: '0 auto 1.75rem' }}>
                  Your bespoke collection acquisitions will appear here with live courier dispatch and fulfillment tracking.
                </p>
                <Link to="/shop" className="btn-gold" style={{ padding: '0.75rem 2rem', textDecoration: 'none', display: 'inline-flex' }}>
                  Explore The Collection
                </Link>
              </div>
            ) : filteredCustomerOrders.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem 2rem', background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', color: 'var(--text-muted)' }}>
                No orders found under "{orderFilter.replace('_', ' ')}".
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {filteredCustomerOrders.map(order => {
                  const items = Array.isArray(order.items) ? order.items : [];
                  const badge = getCustomerStatusBadge(order.status);
                  const Icon = badge.icon;

                  return (
                    <div 
                      key={order.id}
                      style={{
                        background: 'linear-gradient(165deg, #13121E 0%, #0A0A0E 100%)',
                        border: `1px solid ${order.status === 'Delayed' ? 'rgba(239, 68, 68, 0.4)' : 'var(--border-gold)'}`,
                        borderRadius: 'var(--radius-sm)',
                        padding: '1.5rem',
                        boxShadow: '0 8px 30px rgba(0,0,0,0.5)'
                      }}
                    >
                      {/* Top Order Meta */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '1rem', marginBottom: '1.25rem' }}>
                        <div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--gold-400)', fontWeight: '700', letterSpacing: '0.08em' }}>
                            ORDER REFERENCE: #{order.id}
                          </div>
                          <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                            Placed on {order.date ? new Date(order.date).toLocaleDateString('en-KE', { dateStyle: 'medium' }) : 'Recent'} • {order.paymentMethod || 'M-Pesa Express'}
                          </div>
                        </div>

                        {/* Status Badge */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span 
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '6px',
                              padding: '5px 12px',
                              borderRadius: 'var(--radius-full)',
                              fontSize: '0.78rem',
                              fontWeight: '700',
                              textTransform: 'uppercase',
                              letterSpacing: '0.05em',
                              background: badge.bg,
                              color: badge.color,
                              border: `1px solid ${badge.border}`
                            }}
                          >
                            <Icon size={13} />
                            <span>{badge.label}</span>
                          </span>
                        </div>
                      </div>

                      {/* Delayed Notice Banner */}
                      {order.status === 'Delayed' && (
                        <div style={{ background: 'rgba(239, 68, 68, 0.12)', border: '1px solid rgba(239, 68, 68, 0.35)', borderRadius: 'var(--radius-xs)', padding: '0.65rem 0.9rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: '#FECACA' }}>
                          <AlertCircle size={16} color="#F87171" style={{ flexShrink: 0 }} />
                          <span>Delivery Notice: Your order is currently experiencing a courier transit delay. Our Nairobi atelier concierge is managing your priority delivery dispatch.</span>
                        </div>
                      )}

                      {/* Delivered Notice Banner */}
                      {order.status === 'Delivered' && (
                        <div style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: 'var(--radius-xs)', padding: '0.65rem 0.9rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: '#A7F3D0' }}>
                          <CheckCircle size={16} color="#34D399" style={{ flexShrink: 0 }} />
                          <span>Delivery Completed: This bespoke piece has been safely received. Enjoy your authentic Luxe Nia collection.</span>
                        </div>
                      )}

                      {/* Items Purchased */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.25rem' }}>
                        {items.map((item, idx) => (
                          <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                            <img 
                              src={item.image || '/images/products/luxe-baguette-noir-black.jpg'} 
                              alt={item.name}
                              style={{ width: '64px', height: '64px', objectFit: 'cover', borderRadius: '4px', border: '1px solid var(--border-gold)', flexShrink: 0 }}
                            />
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <h4 style={{ color: 'var(--text-pure-white)', fontSize: '0.95rem', margin: '0 0 2px' }}>
                                {item.name}
                              </h4>
                              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                                {item.color?.name ? `Color: ${item.color.name} • ` : ''}Quantity: {item.quantity}
                              </div>
                            </div>
                            <div style={{ textAlign: 'right', fontWeight: '700', color: 'var(--gold-300)', fontSize: '0.95rem' }}>
                              KSh {Number(item.priceKes * item.quantity).toLocaleString()}
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Bottom Footer Info: M-Pesa Receipt & Total Paid */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '1rem' }}>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                          {order.mpesaReceipt && (
                            <span>M-Pesa Receipt Code: <strong style={{ color: 'var(--text-primary)', fontFamily: 'monospace' }}>{order.mpesaReceipt}</strong></span>
                          )}
                          {order.shippingAddress?.city && (
                            <span> • Dispatch to: <strong style={{ color: 'var(--text-primary)' }}>{order.shippingAddress.city}</strong></span>
                          )}
                        </div>

                        <div style={{ textAlign: 'right' }}>
                          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Total Amount: </span>
                          <span style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', color: 'var(--gold-300)', fontWeight: '800' }}>
                            KSh {Number(order.total || 0).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: MY SHOPPING BASKET */}
        {activeTab === 'basket' && (
          <div>
            {cart.length === 0 ? (
              <div 
                style={{
                  textAlign: 'center',
                  padding: '4rem 2rem',
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-sm)'
                }}
              >
                <ShoppingBag size={48} color="var(--gold-400)" style={{ opacity: 0.5, marginBottom: '1rem' }} />
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', color: 'var(--text-pure-white)', margin: '0 0 0.5rem' }}>
                  Your Shopping Basket is Empty
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', maxWidth: '420px', margin: '0 auto 1.75rem' }}>
                  Explore our handcrafted leather pieces and add them to your shopping basket.
                </p>
                <Link to="/shop" className="btn-gold" style={{ padding: '0.75rem 2rem', textDecoration: 'none', display: 'inline-flex' }}>
                  View All Handbags
                </Link>
              </div>
            ) : (
              <div 
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-gold)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '2rem',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '1rem' }}>
                  <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.3rem', color: 'var(--text-pure-white)', margin: 0 }}>
                    Items Currently in Your Bag ({totalItemCount})
                  </h3>
                  <Link to="/cart" style={{ color: 'var(--gold-300)', textDecoration: 'none', fontSize: '0.84rem', fontWeight: '700', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <span>Open Full Cart</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '2rem' }}>
                  {cart.map(item => (
                    <div key={item.itemKey} style={{ display: 'flex', alignItems: 'center', gap: '14px', borderBottom: '1px solid rgba(255,255,255,0.04)', paddingBottom: '1rem' }}>
                      <img 
                        src={item.image || '/images/products/luxe-baguette-noir-black.jpg'} 
                        alt={item.name}
                        style={{ width: '64px', height: '64px', objectFit: 'cover', borderRadius: '4px', border: '1px solid var(--border-gold)' }}
                      />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <h4 style={{ color: 'var(--text-pure-white)', fontSize: '0.95rem', margin: '0 0 2px' }}>{item.name}</h4>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                          {item.selectedColor?.name ? `Tone: ${item.selectedColor.name} • ` : ''}Quantity: {item.quantity}
                        </div>
                      </div>
                      <div style={{ textAlign: 'right', fontWeight: '700', color: 'var(--gold-300)', fontSize: '0.95rem' }}>
                        {formatPrice(item.priceKes * item.quantity)}
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '1.5rem' }}>
                  <div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Subtotal (Complimentary Courier Included)</div>
                    <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', color: 'var(--gold-300)', fontWeight: '800' }}>
                      {formatPrice(cartTotalKes)}
                    </div>
                  </div>

                  <Link to="/cart" className="btn-gold" style={{ padding: '0.85rem 2.5rem', textDecoration: 'none', fontWeight: '700', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                    <span>Proceed to Checkout</span>
                    <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: SAVED DELIVERY & PROFILE DETAILS */}
        {activeTab === 'profile' && (
          <div 
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-gold)',
              borderRadius: 'var(--radius-sm)',
              padding: '2.5rem',
              maxWidth: '700px',
              boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '1rem' }}>
              <div>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.3rem', color: 'var(--text-pure-white)', margin: 0 }}>
                  Delivery & Contact Information
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', margin: '4px 0 0' }}>
                  These details will automatically autofill during checkout for expedited M-Pesa orders.
                </p>
              </div>

              {!isEditingProfile && (
                <button
                  onClick={() => setIsEditingProfile(true)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    background: 'rgba(212,175,55,0.12)',
                    border: '1px solid var(--border-gold)',
                    color: 'var(--gold-300)',
                    padding: '0.5rem 1rem',
                    borderRadius: 'var(--radius-xs)',
                    cursor: 'pointer',
                    fontSize: '0.8rem',
                    fontWeight: '700'
                  }}
                >
                  <Edit3 size={13} />
                  <span>Edit Info</span>
                </button>
              )}
            </div>

            {isEditingProfile ? (
              <form onSubmit={handleSaveProfile}>
                <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                  <label className="form-label" style={{ color: 'var(--gold-300)', fontSize: '0.84rem' }}>Full Legal Name</label>
                  <input
                    type="text"
                    required
                    value={profileData.fullName}
                    onChange={(e) => setProfileData({ ...profileData, fullName: e.target.value })}
                    className="form-input"
                  />
                </div>

                <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                  <label className="form-label" style={{ color: 'var(--gold-300)', fontSize: '0.84rem' }}>M-Pesa Contact Phone Number</label>
                  <input
                    type="tel"
                    value={profileData.phone}
                    onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                    className="form-input"
                    placeholder="07XX XXX XXX"
                  />
                </div>

                <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                  <label className="form-label" style={{ color: 'var(--gold-300)', fontSize: '0.84rem' }}>Delivery Address / Estate / Apartment</label>
                  <input
                    type="text"
                    value={profileData.address}
                    onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                    className="form-input"
                    placeholder="e.g. Kilimani, Wood Avenue Apt 4B"
                  />
                </div>

                <div className="form-group" style={{ marginBottom: '1.75rem' }}>
                  <label className="form-label" style={{ color: 'var(--gold-300)', fontSize: '0.84rem' }}>County / City</label>
                  <input
                    type="text"
                    value={profileData.city}
                    onChange={(e) => setProfileData({ ...profileData, city: e.target.value })}
                    className="form-input"
                    placeholder="Nairobi, Mombasa, Kisumu..."
                  />
                </div>

                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                  <button
                    type="button"
                    onClick={() => setIsEditingProfile(false)}
                    style={{ background: 'transparent', border: '1px solid var(--border-subtle)', color: 'var(--text-secondary)', padding: '0.65rem 1.25rem', borderRadius: 'var(--radius-xs)', cursor: 'pointer' }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-gold"
                    style={{ padding: '0.65rem 1.75rem', fontWeight: '700', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                  >
                    <Save size={15} />
                    <span>Save Delivery Info</span>
                  </button>
                </div>
              </form>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <User size={18} color="var(--gold-400)" />
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Name</div>
                    <div style={{ fontWeight: '600', color: 'var(--text-pure-white)' }}>{customer?.fullName || 'Not provided'}</div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Mail size={18} color="var(--gold-400)" />
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Email</div>
                    <div style={{ fontWeight: '600', color: 'var(--text-pure-white)' }}>{customer?.email}</div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Phone size={18} color="var(--gold-400)" />
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Primary Phone for Courier & M-Pesa</div>
                    <div style={{ fontWeight: '600', color: 'var(--text-pure-white)' }}>{customer?.phone || 'Add phone number for 1-click M-Pesa checkout'}</div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <MapPin size={18} color="var(--gold-400)" />
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Default Delivery Destination</div>
                    <div style={{ fontWeight: '600', color: 'var(--text-pure-white)' }}>
                      {customer?.address ? `${customer.address}, ${customer.city || 'Nairobi'}` : 'Add delivery address for instant courier dispatch'}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
