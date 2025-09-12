'use client'

import { useEffect } from 'react'
import { useAuth } from '@/lib/auth-context'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { BusinessProfile } from '@/components/business/BusinessProfile'

export default function BusinessProfilePage() {
  const { user, qnUser, loading } = useAuth()

  useEffect(() => {
    if (!loading && (!user || !qnUser)) {
      window.location.href = '/'
    }
  }, [user, qnUser, loading])

  if (loading || !user || !qnUser) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-blue-600" />
      </main>
    )
  }

  return (
    <DashboardLayout active="profile">
      <BusinessProfile />
    </DashboardLayout>
  )
}