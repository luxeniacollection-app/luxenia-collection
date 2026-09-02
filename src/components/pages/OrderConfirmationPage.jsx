import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function OrderConfirmationPage() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate('/shop', { replace: true });
  }, [navigate]);

  return null;
}
