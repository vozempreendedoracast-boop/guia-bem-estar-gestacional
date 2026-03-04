-- Ensure authenticated users can self-heal missing profile rows without touching auth schema
CREATE OR REPLACE FUNCTION public.ensure_user_profile(_email text DEFAULT NULL)
RETURNS public.user_profiles
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id uuid := auth.uid();
  v_profile public.user_profiles;
BEGIN
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  INSERT INTO public.user_profiles (user_id, email)
  VALUES (v_user_id, COALESCE(_email, ''))
  ON CONFLICT (user_id)
  DO UPDATE
    SET email = CASE
      WHEN EXCLUDED.email IS NOT NULL AND EXCLUDED.email <> '' THEN EXCLUDED.email
      ELSE user_profiles.email
    END
  RETURNING * INTO v_profile;

  RETURN v_profile;
END;
$$;

GRANT EXECUTE ON FUNCTION public.ensure_user_profile(text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.ensure_user_profile(text) TO service_role;

-- Keep updated_at consistent in user_profiles
DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON public.user_profiles;
CREATE TRIGGER update_user_profiles_updated_at
BEFORE UPDATE ON public.user_profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();