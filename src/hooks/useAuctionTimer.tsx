import { useState, useEffect } from 'react';

export function useAuctionTimer(expirationDate: string) {
  const [timeRemaining, setTimeRemaining] = useState('');
  const [isExpired, setIsExpired] = useState(false);
  
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const expiry = new Date(expirationDate);
      const diff = expiry.getTime() - now.getTime();
      
      if (diff <= 0) {
        setIsExpired(true);
        setTimeRemaining('Expired');
        clearInterval(timer);
        return;
      }
      
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      
      setTimeRemaining(`${days}d ${hours}h ${minutes}m`);
    }, 1000);
    
    return () => clearInterval(timer);
  }, [expirationDate]);
  
  return { timeRemaining, isExpired };
}
