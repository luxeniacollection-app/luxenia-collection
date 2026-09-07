import React, { createContext, useContext, useState, useEffect } from 'react';

const CustomerAuthContext = createContext();

const STORAGE_KEY_CUSTOMER = 'luxenia_customer_user';
const STORAGE_KEY_CUSTOMER_TOKEN = 'luxenia_customer_token';
const STORAGE_KEY_CUSTOMER_ORDERS = 'luxenia_customer_orders_';

export function CustomerAuthProvider({ children }) {
  const [customer, setCustomer] = useState(() => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const saved = localStorage.getItem(STORAGE_KEY_CUSTOMER);
        return saved ? JSON.parse(saved) : null;
      }
    } catch (e) {
      return null;
    }
    return null;
  });

  const [customerToken, setCustomerToken] = useState(() => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        return localStorage.getItem(STORAGE_KEY_CUSTOMER_TOKEN) || null;
      }
    } catch (e) {
      return null;
    }
    return null;
  });

  const [customerOrders, setCustomerOrders] = useState([]);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState('login'); // 'login' | 'register'
  const [isLoading, setIsLoading] = useState(false);

  // Sync customer orders on load / customer change
  useEffect(() => {
    if (!customer?.email) {
      setCustomerOrders([]);
      return;
    }

    // 1. Load from local cache immediately
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const localKey = `${STORAGE_KEY_CUSTOMER_ORDERS}${customer.email.toLowerCase()}`;
        const cached = localStorage.getItem(localKey);
        if (cached) {
          setCustomerOrders(JSON.parse(cached));
        }

        // Also check global orders history for orders matching this customer
        const globalSaved = localStorage.getItem('luxenia_orders_history');
        if (globalSaved) {
          const allOrders = JSON.parse(globalSaved);
          const matched = allOrders.filter(o => 
            (o.customerEmail && o.customerEmail.toLowerCase() === customer.email.toLowerCase()) ||
            (o.customerId && o.customerId === customer.id)
          );
          if (matched.length > 0) {
            setCustomerOrders(prev => {
              const combined = [...matched, ...prev.filter(p => !matched.some(m => m.id === p.id))];
              localStorage.setItem(localKey, JSON.stringify(combined));
              return combined;
            });
          }
        }
      }
    } catch (e) {}

    // 2. Fetch latest orders from API
    async function fetchOrders() {
      try {
        const res = await fetch(`/api/customer/orders?email=${encodeURIComponent(customer.email)}`, {
          headers: customerToken ? { 'Authorization': `Bearer ${customerToken}` } : {}
        });
        if (res.ok) {
          const data = await res.json();
          if (data.success && Array.isArray(data.orders)) {
            setCustomerOrders(data.orders);
            try {
              if (typeof window !== 'undefined' && window.localStorage) {
                const localKey = `${STORAGE_KEY_CUSTOMER_ORDERS}${customer.email.toLowerCase()}`;
                localStorage.setItem(localKey, JSON.stringify(data.orders));
              }
            } catch (e) {}
          }
        }
      } catch (err) {
        // Fallback to local cached orders
      }
    }

    fetchOrders();
  }, [customer?.email, customerToken]);

  // Open / close modal helpers
  const openAuthModal = (tab = 'login') => {
    setAuthModalTab(tab);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  // Customer Login
  const customerLogin = async (email, password) => {
    const cleanEmail = (email || '').trim().toLowerCase();
    const cleanPass = (password || '').trim();

    if (!cleanEmail || !cleanPass) {
      return { success: false, error: 'Please enter both your email and password.' };
    }

    setIsLoading(true);

    try {
      const res = await fetch('/api/customer/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail, password: cleanPass })
      });

      const data = await res.json();
      if (res.ok && data.success && data.customer) {
        setCustomer(data.customer);
        setCustomerToken(data.token);
        if (Array.isArray(data.orders)) {
          setCustomerOrders(data.orders);
        }

        try {
          if (typeof window !== 'undefined' && window.localStorage) {
            localStorage.setItem(STORAGE_KEY_CUSTOMER, JSON.stringify(data.customer));
            if (data.token) localStorage.setItem(STORAGE_KEY_CUSTOMER_TOKEN, data.token);
            if (Array.isArray(data.orders)) {
              localStorage.setItem(`${STORAGE_KEY_CUSTOMER_ORDERS}${cleanEmail}`, JSON.stringify(data.orders));
            }
          }
        } catch (e) {}

        setIsLoading(false);
        closeAuthModal();
        return { success: true, customer: data.customer };
      } else {
        setIsLoading(false);
        return { success: false, error: data.error || 'Invalid email or password.' };
      }
    } catch (err) {
      console.warn('Backend login unreachable, testing client fallback:', err);
      // Client offline fallback for demo/static preview
      try {
        if (typeof window !== 'undefined' && window.localStorage) {
          const registeredUsers = JSON.parse(localStorage.getItem('luxenia_client_customers') || '[]');
          const match = registeredUsers.find(u => u.email.toLowerCase() === cleanEmail);
          if (match && match.password === cleanPass) {
            const { password: _, ...safe } = match;
            const fallbackToken = 'luxenia_client_cust_token_' + Date.now();
            setCustomer(safe);
            setCustomerToken(fallbackToken);
            localStorage.setItem(STORAGE_KEY_CUSTOMER, JSON.stringify(safe));
            localStorage.setItem(STORAGE_KEY_CUSTOMER_TOKEN, fallbackToken);
            setIsLoading(false);
            closeAuthModal();
            return { success: true, customer: safe };
          }
        }
      } catch (e) {}

      setIsLoading(false);
      return { success: false, error: 'No account found with this email. Please check your credentials or register.' };
    }
  };

  // Customer Register (Disabled - Account creation removed for pure guest checkout)
  const customerRegister = async () => {
    return { 
      success: false, 
      error: 'Customer account creation has been removed. LUXE NIA uses seamless guest checkout without requiring account creation.' 
    };
  };

  // Customer Logout
  const customerLogout = () => {
    setCustomer(null);
    setCustomerToken(null);
    setCustomerOrders([]);
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.removeItem(STORAGE_KEY_CUSTOMER);
        localStorage.removeItem(STORAGE_KEY_CUSTOMER_TOKEN);
      }
    } catch (e) {}
  };

  // Update Customer Profile (Address, Phone, etc.)
  const updateCustomerProfile = async (updates) => {
    if (!customer) return;
    const updated = { ...customer, ...updates };
    setCustomer(updated);

    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem(STORAGE_KEY_CUSTOMER, JSON.stringify(updated));
      }
    } catch (e) {}

    // Send to backend API
    try {
      await fetch('/api/customer/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(customerToken ? { 'Authorization': `Bearer ${customerToken}` } : {})
        },
        body: JSON.stringify(updates)
      });
    } catch (err) {}

    return updated;
  };

  // Record an order into customer's history
  const recordCustomerOrder = (order) => {
    const customerOrder = {
      ...order,
      customerId: customer?.id || order.customerId || 'guest',
      customerEmail: customer?.email || order.customerEmail || '',
      customerName: customer?.fullName || order.customerName || order.shippingAddress?.fullName || 'Client'
    };

    setCustomerOrders(prev => {
      const nextList = [customerOrder, ...prev.filter(o => o.id !== customerOrder.id)];
      if (customer?.email) {
        try {
          if (typeof window !== 'undefined' && window.localStorage) {
            localStorage.setItem(`${STORAGE_KEY_CUSTOMER_ORDERS}${customer.email.toLowerCase()}`, JSON.stringify(nextList));
          }
        } catch (e) {}
      }
      return nextList;
    });

    // Also persist into backend orders
    try {
      fetch('/api/customer/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(customerToken ? { 'Authorization': `Bearer ${customerToken}` } : {})
        },
        body: JSON.stringify(customerOrder)
      }).catch(() => {});
    } catch (e) {}

    return customerOrder;
  };

  return (
    <CustomerAuthContext.Provider
      value={{
        customer,
        customerToken,
        isCustomerAuthenticated: !!customer,
        customerOrders,
        isLoading,
        isAuthModalOpen,
        authModalTab,
        setAuthModalTab,
        openAuthModal,
        closeAuthModal,
        customerLogin,
        customerRegister,
        customerLogout,
        updateCustomerProfile,
        recordCustomerOrder
      }}
    >
      {children}
    </CustomerAuthContext.Provider>
  );
}

export function useCustomerAuth() {
  const context = useContext(CustomerAuthContext);
  if (!context) {
    throw new Error('useCustomerAuth must be used within a CustomerAuthProvider');
  }
  return context;
}
