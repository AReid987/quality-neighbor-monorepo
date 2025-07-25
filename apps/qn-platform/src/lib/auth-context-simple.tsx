'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'

interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: 'Resident' | 'BusinessOwner' | 'Admin'
}

interface AuthContextType {
  user: User | null
  loading: boolean
  signUp: (email: string, password: string, userData: {
    firstName: string
    lastName: string
    location: string
    role: 'Resident' | 'BusinessOwner'
  }) => Promise<{ error: string | null }>
  signIn: (email: string, password: string) => Promise<{ error: string | null }>
  signOut: () => Promise<{ error: string | null }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Demo users - only admins can be created here
const DEMO_USERS = {
  'admin@qualityneighbor.com': {
    id: '1',
    email: 'admin@qualityneighbor.com',
    firstName: 'Admin',
    lastName: 'User',
    role: 'Admin' as const,
    password: 'admin123'
  },
  'j.feelgood@qualityneighbor.com': {
    id: '2',
    email: 'j.feelgood@qualityneighbor.com',
    firstName: 'J.',
    lastName: 'Feelgood',
    role: 'Admin' as const,
    password: 'feelgood123'
  }
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for stored user
    const storedUser = localStorage.getItem('qn-platform-user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setLoading(false)
  }, [])

  const signUp = async (
    email: string, 
    password: string, 
    userData: {
      firstName: string
      lastName: string
      location: string
      role: 'Resident' | 'BusinessOwner'
    }
  ) => {
    // Simple demo signup
    const newUser = {
      id: Date.now().toString(),
      email,
      firstName: userData.firstName,
      lastName: userData.lastName,
      role: userData.role
    }
    
    setUser(newUser)
    localStorage.setItem('qn-platform-user', JSON.stringify(newUser))
    return { error: null }
  }

  const signIn = async (email: string, password: string) => {
    // Check demo users
    const demoUser = DEMO_USERS[email as keyof typeof DEMO_USERS]
    if (demoUser && demoUser.password === password) {
      const user = {
        id: demoUser.id,
        email: demoUser.email,
        firstName: demoUser.firstName,
        lastName: demoUser.lastName,
        role: demoUser.role
      }
      setUser(user)
      localStorage.setItem('qn-platform-user', JSON.stringify(user))
      return { error: null }
    }
    
    return { error: 'Invalid credentials' }
  }

  const signOut = async () => {
    setUser(null)
    localStorage.removeItem('qn-platform-user')
    return { error: null }
  }

  const value = {
    user,
    loading,
    signUp,
    signIn,
    signOut,
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