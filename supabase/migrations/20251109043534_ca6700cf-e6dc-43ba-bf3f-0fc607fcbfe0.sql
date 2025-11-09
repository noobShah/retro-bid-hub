-- Auto-promote admin@gmail.com to admin role
CREATE OR REPLACE FUNCTION public.auto_promote_admin()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- If the new user is admin@gmail.com, add admin role
  IF NEW.email = 'admin@gmail.com' THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'admin'::app_role)
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger to auto-promote admin on profile creation
DROP TRIGGER IF EXISTS auto_promote_admin_trigger ON public.profiles;
CREATE TRIGGER auto_promote_admin_trigger
  AFTER INSERT ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.auto_promote_admin();

-- Add additional fields to participations table
ALTER TABLE public.participations
ADD COLUMN IF NOT EXISTS agreement_document TEXT,
ADD COLUMN IF NOT EXISTS business_proof TEXT,
ADD COLUMN IF NOT EXISTS reason_of_interest TEXT;