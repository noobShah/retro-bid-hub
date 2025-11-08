-- Create bids table
CREATE TABLE public.bids (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auction_id UUID NOT NULL REFERENCES public.auctions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  amount NUMERIC NOT NULL CHECK (amount > 0),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Enable RLS
ALTER TABLE public.bids ENABLE ROW LEVEL SECURITY;

-- Everyone can view bids for transparency
CREATE POLICY "Anyone can view bids"
  ON public.bids
  FOR SELECT
  USING (true);

-- Authenticated users can insert bids
CREATE POLICY "Authenticated users can insert bids"
  ON public.bids
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Add current_bid column to auctions
ALTER TABLE public.auctions
ADD COLUMN current_bid NUMERIC DEFAULT 0;

-- Function to update current_bid when new bid is placed
CREATE OR REPLACE FUNCTION public.update_auction_current_bid()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.auctions
  SET current_bid = NEW.amount
  WHERE id = NEW.auction_id
    AND NEW.amount > current_bid;
  
  RETURN NEW;
END;
$$;

-- Trigger to update auction current_bid
CREATE TRIGGER update_current_bid_trigger
AFTER INSERT ON public.bids
FOR EACH ROW
EXECUTE FUNCTION public.update_auction_current_bid();

-- Enable realtime for bids table
ALTER PUBLICATION supabase_realtime ADD TABLE public.bids;