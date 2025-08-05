// Authentication Types
export interface User {
  id: number;
  email: string;
  username: string;
  full_name?: string;
  is_active: boolean;
  is_superuser?: boolean;
  created_at: string;
  preferences?: Record<string, any>;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  username: string;
  password: string;
  full_name?: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// Run Types
export enum RunStatus {
  DRAFT = "draft",
  ACTIVE = "active",
  PAUSED = "paused",
  COMPLETED = "completed",
  FAILED = "failed"
}

export enum RunFrequency {
  DAILY = "daily",
  TWICE_DAILY = "2x",
  THREE_TIMES_DAILY = "3x",
  FOUR_TIMES_DAILY = "4x",
  HOURLY = "hourly"
}

export interface Run {
  id: number;
  name: string;
  description?: string;
  status: RunStatus;
  frequency: RunFrequency;
  owner_id: number;
  created_at: string;
  updated_at?: string;
  last_run_at?: string;
  next_run_at?: string;
  total_content_collected: number;
  total_content_published: number;
  filters?: Record<string, any>;
  demographics_config?: Record<string, any>;
  publishing_config?: Record<string, any>;
}

// Content Types
export enum ContentStatus {
  COLLECTED = "collected",
  PROCESSING = "processing",
  DRAFT = "draft",
  REVIEW = "review",
  APPROVED = "approved",
  PUBLISHED = "published",
  REJECTED = "rejected"
}

export interface Content {
  id: number;
  title: string;
  content: string;
  summary?: string;
  status: ContentStatus;
  run_id: number;
  source_id: number;
  source_url?: string;
  created_at: string;
  updated_at?: string;
  published_at?: string;
  published_url?: string;
}

// Source Types
export enum SourceType {
  NEWS = "news",
  SOCIAL = "social",
  PRODUCT = "product",
  BLOG = "blog"
}

export interface Source {
  id: number;
  name: string;
  description?: string;
  type: SourceType;
  url: string;
  api_endpoint?: string;
  api_key?: string;
  config?: Record<string, any>;
  is_active: boolean;
}

// Blog Config Types
export enum BlogPlatform {
  WORDPRESS = "wordpress",
  GHOST = "ghost",
  DEVTO = "devto"
}

export interface BlogConfig {
  id: number;
  name: string;
  platform: BlogPlatform;
  url: string;
  api_endpoint?: string;
  api_key?: string;
  config?: Record<string, any>;
  is_active: boolean;
  owner_id: number;
  created_at: string;
  updated_at?: string;
}

// Demographic Types
export interface Demographic {
  id: number;
  name: string;
  description?: string;
  profile?: Record<string, any>;
  owner_id: number;
  created_at: string;
  updated_at?: string;
}