-- Create function to auto-promote admin email
CREATE OR REPLACE FUNCTION public.auto_promote_admin()
RETURNS TRIGGER
LANGUAGE PLPGSQL
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

-- Create trigger to auto-promote admin on signup
CREATE TRIGGER auto_promote_admin_trigger
  AFTER INSERT ON public.profiles
  FOR EACH ROW
  WHEN (NEW.email = 'admin@gmail.com')
  EXECUTE FUNCTION public.auto_promote_admin();