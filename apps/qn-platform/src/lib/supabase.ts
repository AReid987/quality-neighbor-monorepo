import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
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
  qn: {
    Tables: {
      users: {
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
      businesses: {
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

export type QNUser = Database['qn']['Tables']['users']['Row']
export type QNBusiness = Database['qn']['Tables']['businesses']['Row']