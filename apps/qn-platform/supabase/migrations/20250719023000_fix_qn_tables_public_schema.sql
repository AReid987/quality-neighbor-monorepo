-- Fix QN table access by moving to public schema with qn_ prefix
-- This ensures Supabase client can access tables while maintaining namespace isolation

-- Create QN tables in public schema (accessible by Supabase client)
CREATE TABLE public.qn_users (
    user_id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    email text NOT NULL UNIQUE,
    password_hash text,
    first_name text NOT NULL,
    last_name text NOT NULL,
    location text NOT NULL,
    interests text[],
    role text NOT NULL CHECK (role IN ('Resident', 'BusinessOwner', 'Internal')),
    is_verified boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.qn_users ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view own profile" ON public.qn_users
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" ON public.qn_users
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile" ON public.qn_users
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Businesses table
CREATE TABLE public.qn_businesses (
    business_id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid REFERENCES public.qn_users(user_id) ON DELETE CASCADE,
    business_name text NOT NULL,
    contact_email text NOT NULL,
    contact_phone text NOT NULL,
    address text NOT NULL,
    category text NOT NULL,
    description text,
    logo_url text,
    ad_package_tier text NOT NULL CHECK (ad_package_tier IN ('Bronze', 'Silver', 'Gold')),
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.qn_businesses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Business owners can manage own business" ON public.qn_businesses
    FOR ALL USING (auth.uid() = user_id);

-- Service listings table
CREATE TABLE public.qn_service_listings (
    listing_id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    poster_user_id uuid REFERENCES public.qn_users(user_id) ON DELETE CASCADE,
    type text NOT NULL CHECK (type IN ('Offer', 'Request')),
    category text NOT NULL,
    title text NOT NULL,
    description text NOT NULL,
    location text NOT NULL,
    status text NOT NULL CHECK (status IN ('Available', 'Fulfilled', 'Cancelled')),
    exchange_mechanism text NOT NULL CHECK (exchange_mechanism IN ('Free', 'Barter', 'TimeBank Credits')),
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.qn_service_listings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all listings" ON public.qn_service_listings
    FOR SELECT USING (true);

CREATE POLICY "Users can manage own listings" ON public.qn_service_listings
    FOR ALL USING (auth.uid() = poster_user_id);

-- Newsletter subscribers (separate from users for non-registered subscribers)
CREATE TABLE public.qn_newsletter_subscribers (
    subscriber_id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    email text NOT NULL UNIQUE,
    first_name text,
    location text,
    subscribed_at timestamp with time zone DEFAULT now(),
    is_active boolean DEFAULT true
);

ALTER TABLE public.qn_newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Allow anyone to subscribe to newsletter
CREATE POLICY "Anyone can subscribe to newsletter" ON public.qn_newsletter_subscribers
    FOR INSERT WITH CHECK (true);

-- Create updated_at trigger function if it doesn't exist
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers for updated_at
CREATE TRIGGER update_qn_users_updated_at BEFORE UPDATE ON public.qn_users
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_qn_businesses_updated_at BEFORE UPDATE ON public.qn_businesses
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_qn_service_listings_updated_at BEFORE UPDATE ON public.qn_service_listings
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();