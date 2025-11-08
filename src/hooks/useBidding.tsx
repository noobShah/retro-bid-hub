import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface Bid {
  id: string;
  auction_id: string;
  user_id: string;
  amount: number;
  created_at: string;
  profiles?: {
    full_name: string;
    email: string;
  };
}

export function useBidding(auctionId: string) {
  const [bids, setBids] = useState<Bid[]>([]);
  const [currentBid, setCurrentBid] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    fetchBids();

    // Set up realtime subscription for new bids
    const channel = supabase
      .channel(`auction-${auctionId}-bids`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'bids',
          filter: `auction_id=eq.${auctionId}`,
        },
        (payload) => {
          console.log('New bid received:', payload);
          fetchBids();
          toast.success('New bid placed!');
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [auctionId]);

  const fetchBids = async () => {
    const { data: bidsData, error: bidsError } = await supabase
      .from('bids')
      .select('*')
      .eq('auction_id', auctionId)
      .order('created_at', { ascending: false });

    if (bidsError) {
      console.error('Error fetching bids:', bidsError);
      return;
    }

    // Fetch user profiles separately
    if (bidsData && bidsData.length > 0) {
      const userIds = [...new Set(bidsData.map(bid => bid.user_id))];
      const { data: profilesData } = await supabase
        .from('profiles')
        .select('id, full_name, email')
        .in('id', userIds);

      const profilesMap = new Map(profilesData?.map(p => [p.id, p]) || []);
      
      const enrichedBids = bidsData.map(bid => ({
        ...bid,
        profiles: profilesMap.get(bid.user_id),
      }));

      setBids(enrichedBids as Bid[]);
    } else {
      setBids([]);
    }
    
    // Fetch current bid from auction
    const { data: auctionData } = await supabase
      .from('auctions')
      .select('current_bid, base_price')
      .eq('id', auctionId)
      .single();

    if (auctionData) {
      setCurrentBid(Number(auctionData.current_bid) || Number(auctionData.base_price));
    }
  };

  const placeBid = async (amount: number) => {
    if (!user) {
      toast.error('Please login to place a bid');
      return false;
    }

    if (amount <= currentBid) {
      toast.error(`Bid must be higher than current bid of $${currentBid.toLocaleString()}`);
      return false;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('bids')
        .insert({
          auction_id: auctionId,
          user_id: user.id,
          amount,
        });

      if (error) throw error;

      toast.success('Bid placed successfully!');
      return true;
    } catch (error: any) {
      console.error('Error placing bid:', error);
      toast.error(error.message || 'Failed to place bid');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    bids,
    currentBid,
    loading,
    placeBid,
  };
}
