'use client'

import { useEffect } from 'react'
import { useAuth } from '@/lib/auth-context'
import { DashboardLayout } from '@/components/layout/DashboardLayout'

export default function CampaignsPage() {
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
    <DashboardLayout active="campaigns">
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">Campaigns</h2>
        <p className="mt-2 text-sm text-gray-600">Ad campaign creation and analytics will appear here.</p>
      </div>
    </DashboardLayout>
  )
}