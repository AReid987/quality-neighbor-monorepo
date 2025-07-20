'use client'

import { useAuth } from '@/lib/auth-context'
import { DashboardLayout } from '@/components/dashboard/DashboardLayout'
import { UserProfile } from '@/components/dashboard/UserProfile'
import { AuthModal } from '@/components/auth/AuthModal'
import { useState } from 'react'

export default function DashboardPage() {
  const { user, loading } = useAuth()
  const [authModalOpen, setAuthModalOpen] = useState(false)

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!user) {
    return (
      <>
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="max-w-md w-full space-y-8 p-8">
            <div className="text-center">
              <h2 className="mt-6 text-3xl font-bold text-gray-900">
                Access Your Dashboard
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                Please sign in to view your Quality Neighbor dashboard
              </p>
            </div>
            <button
              onClick={() => setAuthModalOpen(true)}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Sign In
            </button>
          </div>
        </div>
        <AuthModal 
          isOpen={authModalOpen} 
          onClose={() => setAuthModalOpen(false)}
          defaultMode="signin"
        />
      </>
    )
  }

  return (
    <DashboardLayout activeTab="profile">
      <UserProfile />
    </DashboardLayout>
  )
}