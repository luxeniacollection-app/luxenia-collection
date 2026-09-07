import React, { createContext, useContext, useState } from 'react';
import WhatsAppOrderModal from '../components/common/WhatsAppOrderModal';

const WhatsAppOrderContext = createContext();

export function WhatsAppOrderProvider({ children }) {
  const [orderModalData, setOrderModalData] = useState(null);

  const openWhatsAppOrder = (orderData) => {
    setOrderModalData(orderData);
  };

  const closeWhatsAppOrder = () => {
    setOrderModalData(null);
  };

  return (
    <WhatsAppOrderContext.Provider value={{ openWhatsAppOrder, closeWhatsAppOrder }}>
      {children}
      <WhatsAppOrderModal
        isOpen={!!orderModalData}
        orderData={orderModalData}
        onClose={closeWhatsAppOrder}
      />
    </WhatsAppOrderContext.Provider>
  );
}

export function useWhatsAppOrder() {
  const context = useContext(WhatsAppOrderContext);
  if (!context) {
    throw new Error('useWhatsAppOrder must be used within a WhatsAppOrderProvider');
  }
  return context;
}
