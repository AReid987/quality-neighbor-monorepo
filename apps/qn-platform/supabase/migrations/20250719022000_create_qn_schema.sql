-- Quality Neighbor Schema Creation
-- This creates a separate namespace for QN to avoid conflicts with other projects

-- Create dedicated schema for Quality Neighbor
CREATE SCHEMA IF NOT EXISTS qn;

-- Grant usage to authenticated users
GRANT USAGE ON SCHEMA qn TO authenticated;
GRANT USAGE ON SCHEMA qn TO anon;

-- Enable RLS on the schema
ALTER DEFAULT PRIVILEGES IN SCHEMA qn GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO authenticated;

-- Create QN-specific tables in the qn schema
CREATE TABLE qn.users (
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
ALTER TABLE qn.users ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view own profile" ON qn.users
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" ON qn.users
    FOR UPDATE USING (auth.uid() = user_id);

-- Businesses table
CREATE TABLE qn.businesses (
    business_id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid REFERENCES qn.users(user_id) ON DELETE CASCADE,
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

ALTER TABLE qn.businesses ENABLE ROW LEVEL SECURITY;

-- Service listings table
CREATE TABLE qn.service_listings (
    listing_id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    poster_user_id uuid REFERENCES qn.users(user_id) ON DELETE CASCADE,
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

ALTER TABLE qn.service_listings ENABLE ROW LEVEL SECURITY;

-- Newsletter subscribers (separate from users for non-registered subscribers)
CREATE TABLE qn.newsletter_subscribers (
    subscriber_id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    email text NOT NULL UNIQUE,
    first_name text,
    location text,
    subscribed_at timestamp with time zone DEFAULT now(),
    is_active boolean DEFAULT true
);

ALTER TABLE qn.newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION qn.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers for updated_at
CREATE TRIGGER update_qn_users_updated_at BEFORE UPDATE ON qn.users
    FOR EACH ROW EXECUTE FUNCTION qn.update_updated_at_column();

CREATE TRIGGER update_qn_businesses_updated_at BEFORE UPDATE ON qn.businesses
    FOR EACH ROW EXECUTE FUNCTION qn.update_updated_at_column();

CREATE TRIGGER update_qn_service_listings_updated_at BEFORE UPDATE ON qn.service_listings
    FOR EACH ROW EXECUTE FUNCTION qn.update_updated_at_column();