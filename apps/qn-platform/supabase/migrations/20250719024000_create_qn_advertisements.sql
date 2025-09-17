-- Create QN advertisements table in public schema with RLS and basic policies

CREATE TABLE IF NOT EXISTS public.qn_advertisements (
  ad_id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  business_id uuid NOT NULL REFERENCES public.qn_businesses(business_id) ON DELETE CASCADE,
  campaign_name text NOT NULL,
  ad_creative_url text NOT NULL,
  ad_copy text NOT NULL,
  status text NOT NULL CHECK (status IN ('Active', 'Paused', 'Pending Review', 'Completed')),
  start_date date NOT NULL,
  end_date date NOT NULL,
  impressions integer DEFAULT 0 CHECK (impressions >= 0),
  clicks integer DEFAULT 0 CHECK (clicks >= 0),
  conversions integer DEFAULT 0 CHECK (conversions >= 0),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.qn_advertisements ENABLE ROW LEVEL SECURITY;

-- Policies: business owners can manage their own ads
CREATE POLICY "Business can view own ads" ON public.qn_advertisements
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.qn_businesses b
      WHERE b.business_id = qn_advertisements.business_id
        AND b.user_id = auth.uid()
    )
  );

CREATE POLICY "Business can insert own ads" ON public.qn_advertisements
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.qn_businesses b
      WHERE b.business_id = qn_advertisements.business_id
        AND b.user_id = auth.uid()
    )
  );

CREATE POLICY "Business can update own ads" ON public.qn_advertisements
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.qn_businesses b
      WHERE b.business_id = qn_advertisements.business_id
        AND b.user_id = auth.uid()
    )
  );

CREATE POLICY "Business can delete own ads" ON public.qn_advertisements
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.qn_businesses b
      WHERE b.business_id = qn_advertisements.business_id
        AND b.user_id = auth.uid()
    )
  );

-- Trigger function for updated_at if not already present in public
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger
CREATE TRIGGER update_qn_advertisements_updated_at
  BEFORE UPDATE ON public.qn_advertisements
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Indexes
CREATE INDEX IF NOT EXISTS idx_qn_ads_business_id ON public.qn_advertisements(business_id);
CREATE INDEX IF NOT EXISTS idx_qn_ads_status ON public.qn_advertisements(status);