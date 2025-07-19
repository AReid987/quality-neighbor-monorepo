'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { User, Session, AuthError } from '@supabase/supabase-js'
import { supabase, QNUser } from './supabase'

interface AuthContextType {
  user: User | null
  qnUser: QNUser | null
  session: Session | null
  loading: boolean
  signUp: (email: string, password: string, userData: {
    firstName: string
    lastName: string
    location: string
    role: 'Resident' | 'BusinessOwner'
    interests?: string[]
  }) => Promise<{ error: AuthError | null }>
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>
  signOut: () => Promise<{ error: AuthError | null }>
  resetPassword: (email: string) => Promise<{ error: AuthError | null }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [qnUser, setQNUser] = useState<QNUser | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      if (session?.user) {
        fetchQNUser(session.user.id)
      }
      setLoading(false)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      
      if (session?.user) {
        await fetchQNUser(session.user.id)
      } else {
        setQNUser(null)
      }
      
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const fetchQNUser = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('qn.users')
        .select('*')
        .eq('user_id', userId)
        .single()

      if (error) {
        console.error('Error fetching QN user:', error)
        return
      }

      setQNUser(data)
    } catch (error) {
      console.error('Error fetching QN user:', error)
    }
  }

  const signUp = async (
    email: string, 
    password: string, 
    userData: {
      firstName: string
      lastName: string
      location: string
      role: 'Resident' | 'BusinessOwner'
      interests?: string[]
    }
  ) => {
    try {
      // First, sign up with Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      })

      if (error) return { error }

      // If successful and user is created, add to qn_users table
      if (data.user) {
        const { error: insertError } = await supabase
          .from('qn.users')
          .insert({
            user_id: data.user.id,
            email: email,
            first_name: userData.firstName,
            last_name: userData.lastName,
            location: userData.location,
            role: userData.role,
            interests: userData.interests || [],
            is_verified: false,
          })

        if (insertError) {
          console.error('Error creating QN user profile:', insertError)
          // Note: User is created in auth but profile creation failed
          // You might want to handle this case differently
        }
      }

      return { error: null }
    } catch (error) {
      return { error: error as AuthError }
    }
  }

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    return { error }
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    return { error }
  }

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email)
    return { error }
  }

  const value = {
    user,
    qnUser,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    resetPassword,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}