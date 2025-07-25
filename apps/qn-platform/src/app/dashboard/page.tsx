'use client'

import { useAuth } from '@/lib/auth-context';
import { useEffect } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout'
import { UserProfile } from '@/components/dashboard/UserProfile'
import { AuthModal } from '@/components/auth/AuthModal'
import { useState } from 'react'

export default function DashboardPage() {
  const { user, qnUser, signOut, loading } = useAuth()
  const [authModalOpen, setAuthModalOpen] = useState(false)

  useEffect(() => {
    if (!loading && !user) {
      window.location.href = "/";
    }
  }, [user, loading]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!user || !qnUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <DashboardLayout activeTab="profile">
      <UserProfile />
    </DashboardLayout>
  )
}