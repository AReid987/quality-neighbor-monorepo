--
-- PostgreSQL database dump
--

-- Dumped from database version 16.3 (PGlite 0.2.0)
-- Dumped by pg_dump version 16.4

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'SQL_ASCII';
SET standard_conforming_strings = off;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET escape_string_warning = off;
SET row_security = off;

--
-- Name: meta; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA meta;


ALTER SCHEMA meta OWNER TO postgres;

--
-- Name: vector; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS vector WITH SCHEMA public;


--
-- Name: EXTENSION vector; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION vector IS 'vector data type and ivfflat and hnsw access methods';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: embeddings; Type: TABLE; Schema: meta; Owner: postgres
--

CREATE TABLE meta.embeddings (
    id bigint NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    content text NOT NULL,
    embedding public.vector(384) NOT NULL
);


ALTER TABLE meta.embeddings OWNER TO postgres;

--
-- Name: embeddings_id_seq; Type: SEQUENCE; Schema: meta; Owner: postgres
--

ALTER TABLE meta.embeddings ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME meta.embeddings_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: migrations; Type: TABLE; Schema: meta; Owner: postgres
--

CREATE TABLE meta.migrations (
    version text NOT NULL,
    name text,
    applied_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE meta.migrations OWNER TO postgres;

--
-- Name: qn_advertisements; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.qn_advertisements (
    ad_id uuid DEFAULT gen_random_uuid() NOT NULL,
    business_id uuid,
    campaign_name text NOT NULL,
    ad_creative_url text NOT NULL,
    ad_copy text NOT NULL,
    status text NOT NULL,
    start_date date NOT NULL,
    end_date date NOT NULL,
    impressions integer DEFAULT 0,
    clicks integer DEFAULT 0,
    conversions integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    CONSTRAINT qn_advertisements_clicks_check CHECK ((clicks >= 0)),
    CONSTRAINT qn_advertisements_conversions_check CHECK ((conversions >= 0)),
    CONSTRAINT qn_advertisements_impressions_check CHECK ((impressions >= 0)),
    CONSTRAINT qn_advertisements_status_check CHECK ((status = ANY (ARRAY['Active'::text, 'Paused'::text, 'Pending Review'::text, 'Completed'::text])))
);


ALTER TABLE public.qn_advertisements OWNER TO postgres;

--
-- Name: qn_businesses; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.qn_businesses (
    business_id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid,
    business_name text NOT NULL,
    contact_email text NOT NULL,
    contact_phone text NOT NULL,
    address text NOT NULL,
    category text NOT NULL,
    description text,
    logo_url text,
    ad_package_tier text NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    CONSTRAINT qn_businesses_ad_package_tier_check CHECK ((ad_package_tier = ANY (ARRAY['Bronze'::text, 'Silver'::text, 'Gold'::text])))
);


ALTER TABLE public.qn_businesses OWNER TO postgres;

--
-- Name: qn_checkin_requests; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.qn_checkin_requests (
    checkin_id uuid DEFAULT gen_random_uuid() NOT NULL,
    requester_user_id uuid,
    target_user_id uuid,
    status text NOT NULL,
    scheduled_time timestamp with time zone NOT NULL,
    notes text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    CONSTRAINT qn_checkin_requests_status_check CHECK ((status = ANY (ARRAY['Pending'::text, 'Completed'::text, 'Cancelled'::text])))
);


ALTER TABLE public.qn_checkin_requests OWNER TO postgres;

--
-- Name: qn_internal_team_users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.qn_internal_team_users (
    internal_user_id uuid DEFAULT gen_random_uuid() NOT NULL,
    email text NOT NULL,
    password_hash text NOT NULL,
    role text NOT NULL,
    first_name text NOT NULL,
    last_name text NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    CONSTRAINT qn_internal_team_users_role_check CHECK ((role = ANY (ARRAY['Admin'::text, 'Manager'::text, 'Agent'::text])))
);


ALTER TABLE public.qn_internal_team_users OWNER TO postgres;

--
-- Name: qn_neighborhoods; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.qn_neighborhoods (
    neighborhood_id uuid DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL,
    zip_code text NOT NULL,
    city text NOT NULL,
    state text NOT NULL,
    description text,
    is_active boolean DEFAULT true
);


ALTER TABLE public.qn_neighborhoods OWNER TO postgres;

--
-- Name: qn_newsletter_issues; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.qn_newsletter_issues (
    issue_id uuid DEFAULT gen_random_uuid() NOT NULL,
    neighborhood_id uuid,
    issue_date date NOT NULL,
    content_html text NOT NULL,
    status text NOT NULL,
    created_by_user_id uuid,
    deployment_metrics jsonb,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    CONSTRAINT qn_newsletter_issues_status_check CHECK ((status = ANY (ARRAY['Draft'::text, 'Published'::text, 'Archived'::text])))
);


ALTER TABLE public.qn_newsletter_issues OWNER TO postgres;

--
-- Name: qn_service_listings; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.qn_service_listings (
    listing_id uuid DEFAULT gen_random_uuid() NOT NULL,
    poster_user_id uuid,
    type text NOT NULL,
    category text NOT NULL,
    title text NOT NULL,
    description text NOT NULL,
    location text NOT NULL,
    status text NOT NULL,
    exchange_mechanism text NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    CONSTRAINT qn_service_listings_exchange_mechanism_check CHECK ((exchange_mechanism = ANY (ARRAY['Free'::text, 'Barter'::text, 'TimeBank Credits'::text]))),
    CONSTRAINT qn_service_listings_status_check CHECK ((status = ANY (ARRAY['Available'::text, 'Fulfilled'::text, 'Cancelled'::text]))),
    CONSTRAINT qn_service_listings_type_check CHECK ((type = ANY (ARRAY['Offer'::text, 'Request'::text])))
);


ALTER TABLE public.qn_service_listings OWNER TO postgres;

--
-- Name: qn_users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.qn_users (
    user_id uuid DEFAULT gen_random_uuid() NOT NULL,
    email text NOT NULL,
    password_hash text NOT NULL,
    first_name text NOT NULL,
    last_name text NOT NULL,
    location text NOT NULL,
    interests text[],
    role text NOT NULL,
    is_verified boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    CONSTRAINT qn_users_role_check CHECK ((role = ANY (ARRAY['Resident'::text, 'BusinessOwner'::text, 'Internal'::text])))
);


ALTER TABLE public.qn_users OWNER TO postgres;

--
-- Name: rltr_mktg_agents; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.rltr_mktg_agents (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL,
    phone text,
    email text NOT NULL,
    company text,
    profile_image_url text,
    notification_preferences jsonb,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.rltr_mktg_agents OWNER TO postgres;

--
-- Name: rltr_mktg_approval_logs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.rltr_mktg_approval_logs (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    content_piece_id uuid,
    agent_id uuid,
    action_type text,
    "timestamp" timestamp with time zone DEFAULT now(),
    feedback text,
    CONSTRAINT approval_logs_action_type_check CHECK ((action_type = ANY (ARRAY['approved'::text, 'rejected'::text, 'requested_revisions'::text, 'sent_to_marketing'::text, 'recorded_marketing_approval'::text])))
);


ALTER TABLE public.rltr_mktg_approval_logs OWNER TO postgres;

--
-- Name: rltr_mktg_content_pieces; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.rltr_mktg_content_pieces (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    listing_id uuid,
    agent_id uuid,
    content_type text,
    generated_text jsonb,
    associated_image_urls text[],
    status text,
    feedback text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    last_approved_at timestamp with time zone,
    CONSTRAINT content_pieces_content_type_check CHECK ((content_type = ANY (ARRAY['social_media_post'::text, 'flyer_text'::text]))),
    CONSTRAINT content_pieces_status_check CHECK ((status = ANY (ARRAY['draft'::text, 'pending_approval_agent'::text, 'pending_external_marketing_approval'::text, 'approved_for_posting'::text, 'rejected'::text, 'pending_ai_revision'::text, 'posted_successfully'::text, 'posting_failed'::text])))
);


ALTER TABLE public.rltr_mktg_content_pieces OWNER TO postgres;

--
-- Name: rltr_mktg_listings; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.rltr_mktg_listings (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    source_id text NOT NULL,
    address jsonb NOT NULL,
    price numeric,
    beds integer,
    baths integer,
    sqft integer,
    description text,
    key_features text[],
    image_urls text[],
    status text,
    scraped_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    CONSTRAINT listings_status_check CHECK ((status = ANY (ARRAY['active'::text, 'sold'::text])))
);


ALTER TABLE public.rltr_mktg_listings OWNER TO postgres;

--
-- Name: rltr_mktg_notifications; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.rltr_mktg_notifications (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    agent_id uuid,
    notification_type text NOT NULL,
    message_text text NOT NULL,
    related_entity_id uuid,
    is_read boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.rltr_mktg_notifications OWNER TO postgres;

--
-- Name: rltr_mktg_post_schedule; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.rltr_mktg_post_schedule (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    content_piece_id uuid,
    social_media_account_id uuid,
    scheduled_at timestamp with time zone NOT NULL,
    posted_at timestamp with time zone,
    status text,
    platform_post_id text,
    error_message text,
    CONSTRAINT post_schedule_status_check CHECK ((status = ANY (ARRAY['pending'::text, 'sent'::text, 'success'::text, 'failed'::text])))
);


ALTER TABLE public.rltr_mktg_post_schedule OWNER TO postgres;

--
-- Name: rltr_mktg_social_media_accounts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.rltr_mktg_social_media_accounts (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    agent_id uuid,
    platform text NOT NULL,
    platform_account_id text NOT NULL,
    encrypted_access_token text NOT NULL,
    token_expiration timestamp with time zone,
    encrypted_refresh_token text,
    active boolean DEFAULT true
);


ALTER TABLE public.rltr_mktg_social_media_accounts OWNER TO postgres;

--
-- Name: rltr_mktg_users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.rltr_mktg_users (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    email text NOT NULL,
    password_hash text,
    created_at timestamp with time zone DEFAULT now(),
    last_login timestamp with time zone,
    agent_id uuid
);


ALTER TABLE public.rltr_mktg_users OWNER TO postgres;

--
-- Data for Name: embeddings; Type: TABLE DATA; Schema: meta; Owner: postgres
--



--
-- Data for Name: migrations; Type: TABLE DATA; Schema: meta; Owner: postgres
--

INSERT INTO meta.migrations VALUES ('202407160001', 'embeddings', '2025-07-15 06:08:27.759+00');


--
-- Data for Name: qn_advertisements; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: qn_businesses; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: qn_checkin_requests; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: qn_internal_team_users; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: qn_neighborhoods; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: qn_newsletter_issues; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: qn_service_listings; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: qn_users; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: rltr_mktg_agents; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: rltr_mktg_approval_logs; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: rltr_mktg_content_pieces; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: rltr_mktg_listings; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: rltr_mktg_notifications; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: rltr_mktg_post_schedule; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: rltr_mktg_social_media_accounts; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: rltr_mktg_users; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Name: embeddings_id_seq; Type: SEQUENCE SET; Schema: meta; Owner: postgres
--

SELECT pg_catalog.setval('meta.embeddings_id_seq', 1, false);


--
-- Name: embeddings embeddings_pkey; Type: CONSTRAINT; Schema: meta; Owner: postgres
--

ALTER TABLE ONLY meta.embeddings
    ADD CONSTRAINT embeddings_pkey PRIMARY KEY (id);


--
-- Name: migrations migrations_pkey; Type: CONSTRAINT; Schema: meta; Owner: postgres
--

ALTER TABLE ONLY meta.migrations
    ADD CONSTRAINT migrations_pkey PRIMARY KEY (version);


--
-- Name: rltr_mktg_agents agents_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rltr_mktg_agents
    ADD CONSTRAINT agents_pkey PRIMARY KEY (id);


--
-- Name: rltr_mktg_approval_logs approval_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rltr_mktg_approval_logs
    ADD CONSTRAINT approval_logs_pkey PRIMARY KEY (id);


--
-- Name: rltr_mktg_content_pieces content_pieces_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rltr_mktg_content_pieces
    ADD CONSTRAINT content_pieces_pkey PRIMARY KEY (id);


--
-- Name: rltr_mktg_listings listings_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rltr_mktg_listings
    ADD CONSTRAINT listings_pkey PRIMARY KEY (id);


--
-- Name: rltr_mktg_listings listings_source_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rltr_mktg_listings
    ADD CONSTRAINT listings_source_id_key UNIQUE (source_id);


--
-- Name: rltr_mktg_notifications notifications_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rltr_mktg_notifications
    ADD CONSTRAINT notifications_pkey PRIMARY KEY (id);


--
-- Name: rltr_mktg_post_schedule post_schedule_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rltr_mktg_post_schedule
    ADD CONSTRAINT post_schedule_pkey PRIMARY KEY (id);


--
-- Name: qn_advertisements qn_advertisements_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.qn_advertisements
    ADD CONSTRAINT qn_advertisements_pkey PRIMARY KEY (ad_id);


--
-- Name: qn_businesses qn_businesses_business_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.qn_businesses
    ADD CONSTRAINT qn_businesses_business_name_key UNIQUE (business_name);


--
-- Name: qn_businesses qn_businesses_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.qn_businesses
    ADD CONSTRAINT qn_businesses_pkey PRIMARY KEY (business_id);


--
-- Name: qn_checkin_requests qn_checkin_requests_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.qn_checkin_requests
    ADD CONSTRAINT qn_checkin_requests_pkey PRIMARY KEY (checkin_id);


--
-- Name: qn_internal_team_users qn_internal_team_users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.qn_internal_team_users
    ADD CONSTRAINT qn_internal_team_users_email_key UNIQUE (email);


--
-- Name: qn_internal_team_users qn_internal_team_users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.qn_internal_team_users
    ADD CONSTRAINT qn_internal_team_users_pkey PRIMARY KEY (internal_user_id);


--
-- Name: qn_neighborhoods qn_neighborhoods_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.qn_neighborhoods
    ADD CONSTRAINT qn_neighborhoods_pkey PRIMARY KEY (neighborhood_id);


--
-- Name: qn_newsletter_issues qn_newsletter_issues_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.qn_newsletter_issues
    ADD CONSTRAINT qn_newsletter_issues_pkey PRIMARY KEY (issue_id);


--
-- Name: qn_service_listings qn_service_listings_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.qn_service_listings
    ADD CONSTRAINT qn_service_listings_pkey PRIMARY KEY (listing_id);


--
-- Name: qn_users qn_users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.qn_users
    ADD CONSTRAINT qn_users_email_key UNIQUE (email);


--
-- Name: qn_users qn_users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.qn_users
    ADD CONSTRAINT qn_users_pkey PRIMARY KEY (user_id);


--
-- Name: rltr_mktg_social_media_accounts social_media_accounts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rltr_mktg_social_media_accounts
    ADD CONSTRAINT social_media_accounts_pkey PRIMARY KEY (id);


--
-- Name: rltr_mktg_users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rltr_mktg_users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: rltr_mktg_users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rltr_mktg_users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: rltr_mktg_approval_logs approval_logs_agent_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rltr_mktg_approval_logs
    ADD CONSTRAINT approval_logs_agent_id_fkey FOREIGN KEY (agent_id) REFERENCES public.rltr_mktg_agents(id);


--
-- Name: rltr_mktg_approval_logs approval_logs_content_piece_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rltr_mktg_approval_logs
    ADD CONSTRAINT approval_logs_content_piece_id_fkey FOREIGN KEY (content_piece_id) REFERENCES public.rltr_mktg_content_pieces(id);


--
-- Name: rltr_mktg_content_pieces content_pieces_agent_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rltr_mktg_content_pieces
    ADD CONSTRAINT content_pieces_agent_id_fkey FOREIGN KEY (agent_id) REFERENCES public.rltr_mktg_agents(id);


--
-- Name: rltr_mktg_content_pieces content_pieces_listing_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rltr_mktg_content_pieces
    ADD CONSTRAINT content_pieces_listing_id_fkey FOREIGN KEY (listing_id) REFERENCES public.rltr_mktg_listings(id);


--
-- Name: rltr_mktg_notifications notifications_agent_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rltr_mktg_notifications
    ADD CONSTRAINT notifications_agent_id_fkey FOREIGN KEY (agent_id) REFERENCES public.rltr_mktg_agents(id);


--
-- Name: rltr_mktg_post_schedule post_schedule_content_piece_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rltr_mktg_post_schedule
    ADD CONSTRAINT post_schedule_content_piece_id_fkey FOREIGN KEY (content_piece_id) REFERENCES public.rltr_mktg_content_pieces(id);


--
-- Name: rltr_mktg_post_schedule post_schedule_social_media_account_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rltr_mktg_post_schedule
    ADD CONSTRAINT post_schedule_social_media_account_id_fkey FOREIGN KEY (social_media_account_id) REFERENCES public.rltr_mktg_social_media_accounts(id);


--
-- Name: qn_advertisements qn_advertisements_business_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.qn_advertisements
    ADD CONSTRAINT qn_advertisements_business_id_fkey FOREIGN KEY (business_id) REFERENCES public.qn_businesses(business_id);


--
-- Name: qn_businesses qn_businesses_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.qn_businesses
    ADD CONSTRAINT qn_businesses_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.qn_users(user_id);


--
-- Name: qn_checkin_requests qn_checkin_requests_requester_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.qn_checkin_requests
    ADD CONSTRAINT qn_checkin_requests_requester_user_id_fkey FOREIGN KEY (requester_user_id) REFERENCES public.qn_users(user_id);


--
-- Name: qn_checkin_requests qn_checkin_requests_target_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.qn_checkin_requests
    ADD CONSTRAINT qn_checkin_requests_target_user_id_fkey FOREIGN KEY (target_user_id) REFERENCES public.qn_users(user_id);


--
-- Name: qn_newsletter_issues qn_newsletter_issues_created_by_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.qn_newsletter_issues
    ADD CONSTRAINT qn_newsletter_issues_created_by_user_id_fkey FOREIGN KEY (created_by_user_id) REFERENCES public.qn_users(user_id);


--
-- Name: qn_newsletter_issues qn_newsletter_issues_neighborhood_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.qn_newsletter_issues
    ADD CONSTRAINT qn_newsletter_issues_neighborhood_id_fkey FOREIGN KEY (neighborhood_id) REFERENCES public.qn_neighborhoods(neighborhood_id);


--
-- Name: qn_service_listings qn_service_listings_poster_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.qn_service_listings
    ADD CONSTRAINT qn_service_listings_poster_user_id_fkey FOREIGN KEY (poster_user_id) REFERENCES public.qn_users(user_id);


--
-- Name: rltr_mktg_social_media_accounts social_media_accounts_agent_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rltr_mktg_social_media_accounts
    ADD CONSTRAINT social_media_accounts_agent_id_fkey FOREIGN KEY (agent_id) REFERENCES public.rltr_mktg_agents(id);


--
-- Name: rltr_mktg_users users_agent_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rltr_mktg_users
    ADD CONSTRAINT users_agent_id_fkey FOREIGN KEY (agent_id) REFERENCES public.rltr_mktg_agents(id);


--
-- PostgreSQL database dump complete
--

