-- Create enum for user roles
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Create enum for auction categories
CREATE TYPE public.auction_category AS ENUM ('Two Wheeler', 'Four Wheeler', 'Heavy Vehicle', 'Property', 'Antiques');

-- Create enum for auction status
CREATE TYPE public.auction_status AS ENUM ('active', 'cooldown', 'expired');

-- Create enum for participation status
CREATE TYPE public.participation_status AS ENUM ('active', 'won', 'lost', 'exited');

-- Create enum for email types
CREATE TYPE public.email_type AS ENUM ('participation', 'refund', 'winner');

-- Create profiles table for user information
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  city TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_roles table for role management
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);

-- Create auctions table
CREATE TABLE public.auctions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  category auction_category NOT NULL,
  city TEXT NOT NULL,
  base_price DECIMAL(10,2) NOT NULL,
  years_used INTEGER,
  condition_rating INTEGER,
  insurance_status BOOLEAN,
  cooldown_hours INTEGER DEFAULT 0,
  expiration_date TIMESTAMP WITH TIME ZONE NOT NULL,
  status auction_status DEFAULT 'active',
  images TEXT[],
  bidders_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id)
);

-- Create participations table
CREATE TABLE public.participations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  auction_id UUID REFERENCES auctions(id) ON DELETE CASCADE NOT NULL,
  platform_fee DECIMAL(10,2) NOT NULL,
  deposit_fee DECIMAL(10,2) NOT NULL,
  status participation_status DEFAULT 'active',
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, auction_id)
);

-- Create email_logs table
CREATE TABLE public.email_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  auction_id UUID REFERENCES auctions(id) ON DELETE CASCADE,
  email_type email_type NOT NULL,
  content TEXT,
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.auctions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.participations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_logs ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check if user has a specific role
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE PLPGSQL
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Insert profile
  INSERT INTO public.profiles (id, email, full_name, city)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'User'),
    COALESCE(NEW.raw_user_meta_data->>'city', 'Not specified')
  );
  
  -- Assign default user role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user');
  
  RETURN NEW;
END;
$$;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- RLS Policies for profiles
CREATE POLICY "Users can view all profiles"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- RLS Policies for user_roles
CREATE POLICY "Users can view all roles"
  ON public.user_roles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage roles"
  ON public.user_roles FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for auctions
CREATE POLICY "Anyone can view active auctions"
  ON public.auctions FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can insert auctions"
  ON public.auctions FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update auctions"
  ON public.auctions FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete auctions"
  ON public.auctions FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for participations
CREATE POLICY "Users can view own participations"
  ON public.participations FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can insert own participations"
  ON public.participations FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own participations"
  ON public.participations FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

-- RLS Policies for email_logs
CREATE POLICY "Users can view own email logs"
  ON public.email_logs FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "System can insert email logs"
  ON public.email_logs FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Create function to update bidders count
CREATE OR REPLACE FUNCTION public.update_bidders_count()
RETURNS TRIGGER
LANGUAGE PLPGSQL
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.auctions
    SET bidders_count = bidders_count + 1
    WHERE id = NEW.auction_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.auctions
    SET bidders_count = GREATEST(0, bidders_count - 1)
    WHERE id = OLD.auction_id;
  END IF;
  RETURN NULL;
END;
$$;

-- Create trigger to update bidders count
CREATE TRIGGER on_participation_change
  AFTER INSERT OR DELETE ON public.participations
  FOR EACH ROW EXECUTE FUNCTION public.update_bidders_count();