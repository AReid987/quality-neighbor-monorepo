-- Migration: 001-initial-schema.sql
-- Description: Initial schema setup for QN monorepo with namespacing
-- Created: 2024-07-17

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "vector";

-- Create meta schema for internal operations
CREATE SCHEMA IF NOT EXISTS meta;

-- =====================================================
-- META SCHEMA TABLES
-- =====================================================

-- Embeddings table for vector search
CREATE TABLE meta.embeddings (
    id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    content text NOT NULL,
    embedding vector(384) NOT NULL
);

-- Migrations tracking
CREATE TABLE meta.migrations (
    version text PRIMARY KEY,
    name text,
    applied_at timestamp with time zone DEFAULT now() NOT NULL
);

-- =====================================================
-- QUALITY NEIGHBOR (QN) TABLES
-- =====================================================

-- Users table for QN platform
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

-- Neighborhoods
CREATE TABLE public.qn_neighborhoods (
    neighborhood_id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    name text NOT NULL,
    zip_code text NOT NULL,
    city text NOT NULL,
    state text NOT NULL,
    description text,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- Businesses
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

-- Advertisements
CREATE TABLE public.qn_advertisements (
    ad_id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    business_id uuid REFERENCES public.qn_businesses(business_id) ON DELETE CASCADE,
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

-- Service Listings
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

-- Newsletter Issues
CREATE TABLE public.qn_newsletter_issues (
    issue_id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    neighborhood_id uuid REFERENCES public.qn_neighborhoods(neighborhood_id) ON DELETE CASCADE,
    issue_date date NOT NULL,
    content_html text NOT NULL,
    status text NOT NULL CHECK (status IN ('Draft', 'Published', 'Archived')),
    created_by_user_id uuid REFERENCES public.qn_users(user_id) ON DELETE SET NULL,
    deployment_metrics jsonb,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- Check-in Requests
CREATE TABLE public.qn_checkin_requests (
    checkin_id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    requester_user_id uuid REFERENCES public.qn_users(user_id) ON DELETE CASCADE,
    target_user_id uuid REFERENCES public.qn_users(user_id) ON DELETE CASCADE,
    status text NOT NULL CHECK (status IN ('Pending', 'Completed', 'Cancelled')),
    scheduled_time timestamp with time zone NOT NULL,
    notes text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- Internal Team Users
CREATE TABLE public.qn_internal_team_users (
    internal_user_id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    email text NOT NULL UNIQUE,
    password_hash text NOT NULL,
    role text NOT NULL CHECK (role IN ('Admin', 'Manager', 'Agent')),
    first_name text NOT NULL,
    last_name text NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- =====================================================
-- REAL ESTATE MARKETING (RLTR_MKTG) TABLES
-- =====================================================

-- Agents
CREATE TABLE public.rltr_mktg_agents (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    name text NOT NULL,
    phone text,
    email text NOT NULL UNIQUE,
    company text,
    profile_image_url text,
    notification_preferences jsonb,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- Users (separate from QN users)
CREATE TABLE public.rltr_mktg_users (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    email text NOT NULL UNIQUE,
    password_hash text,
    created_at timestamp with time zone DEFAULT now(),
    last_login timestamp with time zone,
    agent_id uuid REFERENCES public.rltr_mktg_agents(id) ON DELETE SET NULL
);

-- Listings
CREATE TABLE public.rltr_mktg_listings (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    source_id text NOT NULL,
    address jsonb NOT NULL,
    price numeric,
    beds integer,
    baths integer,
    sqft integer,
    description text,
    key_features text[],
    image_urls text[],
    status text CHECK (status IN ('active', 'sold')),
    scraped_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- Content Pieces
CREATE TABLE public.rltr_mktg_content_pieces (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    listing_id uuid REFERENCES public.rltr_mktg_listings(id) ON DELETE CASCADE,
    agent_id uuid REFERENCES public.rltr_mktg_agents(id) ON DELETE CASCADE,
    content_type text CHECK (content_type IN ('social_media_post', 'flyer_text')),
    generated_text jsonb,
    associated_image_urls text[],
    status text CHECK (status IN ('draft', 'pending_approval_agent', 'pending_external_marketing_approval', 'approved_for_posting', 'rejected', 'pending_ai_revision', 'posted_successfully', 'posting_failed')),
    feedback text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    last_approved_at timestamp with time zone
);

-- Approval Logs
CREATE TABLE public.rltr_mktg_approval_logs (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    content_piece_id uuid REFERENCES public.rltr_mktg_content_pieces(id) ON DELETE CASCADE,
    agent_id uuid REFERENCES public.rltr_mktg_agents(id) ON DELETE CASCADE,
    action_type text CHECK (action_type IN ('approved', 'rejected', 'requested_revisions', 'sent_to_marketing', 'recorded_marketing_approval')),
    timestamp timestamp with time zone DEFAULT now(),
    feedback text
);

-- Social Media Accounts
CREATE TABLE public.rltr_mktg_social_media_accounts (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    agent_id uuid REFERENCES public.rltr_mktg_agents(id) ON DELETE CASCADE,
    platform text NOT NULL,
    platform_account_id text NOT NULL,
    encrypted_access_token text NOT NULL,
    token_expiration timestamp with time zone,
    encrypted_refresh_token text,
    active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- Post Schedule
CREATE TABLE public.rltr_mktg_post_schedule (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    content_piece_id uuid REFERENCES public.rltr_mktg_content_pieces(id) ON DELETE CASCADE,
    social_media_account_id uuid REFERENCES public.rltr_mktg_social_media_accounts(id) ON DELETE CASCADE,
    scheduled_at timestamp with time zone NOT NULL,
    posted_at timestamp with time zone,
    status text CHECK (status IN ('pending', 'sent', 'success', 'failed')),
    platform_post_id text,
    error_message text,
    created_at timestamp with time zone DEFAULT now()
);

-- Notifications
CREATE TABLE public.rltr_mktg_notifications (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    agent_id uuid REFERENCES public.rltr_mktg_agents(id) ON DELETE CASCADE,
    notification_type text NOT NULL,
    message_text text NOT NULL,
    related_entity_id uuid,
    is_read boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT now()
);

-- =====================================================
-- INDEXES
-- =====================================================

-- QN Indexes
CREATE INDEX idx_qn_users_email ON public.qn_users(email);
CREATE INDEX idx_qn_users_role ON public.qn_users(role);
CREATE INDEX idx_qn_businesses_user_id ON public.qn_businesses(user_id);
CREATE INDEX idx_qn_advertisements_business_id ON public.qn_advertisements(business_id);
CREATE INDEX idx_qn_advertisements_status ON public.qn_advertisements(status);
CREATE INDEX idx_qn_service_listings_poster_user_id ON public.qn_service_listings(poster_user_id);
CREATE INDEX idx_qn_service_listings_status ON public.qn_service_listings(status);
CREATE INDEX idx_qn_newsletter_issues_neighborhood_id ON public.qn_newsletter_issues(neighborhood_id);

-- RLTR_MKTG Indexes
CREATE INDEX idx_rltr_mktg_agents_email ON public.rltr_mktg_agents(email);
CREATE INDEX idx_rltr_mktg_users_email ON public.rltr_mktg_users(email);
CREATE INDEX idx_rltr_mktg_users_agent_id ON public.rltr_mktg_users(agent_id);
CREATE INDEX idx_rltr_mktg_listings_status ON public.rltr_mktg_listings(status);
CREATE INDEX idx_rltr_mktg_content_pieces_listing_id ON public.rltr_mktg_content_pieces(listing_id);
CREATE INDEX idx_rltr_mktg_content_pieces_agent_id ON public.rltr_mktg_content_pieces(agent_id);
CREATE INDEX idx_rltr_mktg_content_pieces_status ON public.rltr_mktg_content_pieces(status);
CREATE INDEX idx_rltr_mktg_approval_logs_content_piece_id ON public.rltr_mktg_approval_logs(content_piece_id);
CREATE INDEX idx_rltr_mktg_post_schedule_scheduled_at ON public.rltr_mktg_post_schedule(scheduled_at);
CREATE INDEX idx_rltr_mktg_notifications_agent_id ON public.rltr_mktg_notifications(agent_id);
CREATE INDEX idx_rltr_mktg_notifications_is_read ON public.rltr_mktg_notifications(is_read);

-- Vector index for embeddings
CREATE INDEX idx_embeddings_embedding ON meta.embeddings USING hnsw (embedding vector_cosine_ops);

-- =====================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE public.qn_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.qn_businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.qn_advertisements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.qn_service_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.qn_newsletter_issues ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.qn_checkin_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.qn_internal_team_users ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.rltr_mktg_agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rltr_mktg_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rltr_mktg_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rltr_mktg_content_pieces ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rltr_mktg_approval_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rltr_mktg_social_media_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rltr_mktg_post_schedule ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rltr_mktg_notifications ENABLE ROW LEVEL SECURITY;

-- Basic RLS policies (these will be expanded based on Auth0 integration)
-- For now, allow authenticated users to access their own data

-- QN policies
CREATE POLICY "Users can view their own data" ON public.qn_users
    FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update their own data" ON public.qn_users
    FOR UPDATE USING (auth.uid()::text = user_id::text);

-- RLTR_MKTG policies
CREATE POLICY "Agents can view their own data" ON public.rltr_mktg_agents
    FOR SELECT USING (auth.uid()::text = id::text);

CREATE POLICY "Agents can update their own data" ON public.rltr_mktg_agents
    FOR UPDATE USING (auth.uid()::text = id::text);

-- =====================================================
-- TRIGGERS FOR UPDATED_AT
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers to all tables with updated_at column
CREATE TRIGGER update_qn_users_updated_at BEFORE UPDATE ON public.qn_users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_qn_businesses_updated_at BEFORE UPDATE ON public.qn_businesses
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_qn_advertisements_updated_at BEFORE UPDATE ON public.qn_advertisements
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_qn_service_listings_updated_at BEFORE UPDATE ON public.qn_service_listings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_qn_newsletter_issues_updated_at BEFORE UPDATE ON public.qn_newsletter_issues
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_qn_checkin_requests_updated_at BEFORE UPDATE ON public.qn_checkin_requests
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_qn_internal_team_users_updated_at BEFORE UPDATE ON public.qn_internal_team_users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_rltr_mktg_agents_updated_at BEFORE UPDATE ON public.rltr_mktg_agents
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_rltr_mktg_listings_updated_at BEFORE UPDATE ON public.rltr_mktg_listings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_rltr_mktg_content_pieces_updated_at BEFORE UPDATE ON public.rltr_mktg_content_pieces
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_rltr_mktg_social_media_accounts_updated_at BEFORE UPDATE ON public.rltr_mktg_social_media_accounts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Record this migration
INSERT INTO meta.migrations (version, name) VALUES ('001', 'initial-schema');
