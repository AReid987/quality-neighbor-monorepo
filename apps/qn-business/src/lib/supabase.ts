import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'

// Only throw error in production if env vars are missing
if (process.env.NODE_ENV === 'production' && (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)) {
  throw new Error('Missing Supabase environment variables in production')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
})

// Database types based on our schema
export type Database = {
  public: {
    Tables: {
      qn_users: {
        Row: {
          user_id: string
          email: string
          password_hash: string | null
          first_name: string
          last_name: string
          location: string
          interests: string[] | null
          role: 'Resident' | 'BusinessOwner' | 'Internal'
          is_verified: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          user_id?: string
          email: string
          password_hash?: string | null
          first_name: string
          last_name: string
          location: string
          interests?: string[] | null
          role: 'Resident' | 'BusinessOwner' | 'Internal'
          is_verified?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          user_id?: string
          email?: string
          password_hash?: string | null
          first_name?: string
          last_name?: string
          location?: string
          interests?: string[] | null
          role?: 'Resident' | 'BusinessOwner' | 'Internal'
          is_verified?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      qn_businesses: {
        Row: {
          business_id: string
          user_id: string
          business_name: string
          contact_email: string
          contact_phone: string
          address: string
          category: string
          description: string | null
          logo_url: string | null
          ad_package_tier: 'Bronze' | 'Silver' | 'Gold'
          created_at: string
          updated_at: string
        }
        Insert: {
          business_id?: string
          user_id: string
          business_name: string
          contact_email: string
          contact_phone: string
          address: string
          category: string
          description?: string | null
          logo_url?: string | null
          ad_package_tier: 'Bronze' | 'Silver' | 'Gold'
          created_at?: string
          updated_at?: string
        }
        Update: {
          business_id?: string
          user_id?: string
          business_name?: string
          contact_email?: string
          contact_phone?: string
          address?: string
          category?: string
          description?: string | null
          logo_url?: string | null
          ad_package_tier?: 'Bronze' | 'Silver' | 'Gold'
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}

export type QNUser = Database['public']['Tables']['qn_users']['Row']
export type QNBusiness = Database['public']['Tables']['qn_businesses']['Row']