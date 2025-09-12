'use client'

import { useEffect } from 'react'
import { useAuth } from '@/lib/auth-context'
import { DashboardLayout } from '@/components/layout/DashboardLayout'

export default function DashboardOverviewPage() {
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
    <DashboardLayout active="overview">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <div className="text-sm text-gray-500">Active Campaigns</div>
          <div className="mt-2 text-3xl font-semibold text-gray-900">0</div>
          <div className="mt-2 text-xs text-gray-500">Campaign analytics coming soon</div>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <div className="text-sm text-gray-500">Monthly Impressions</div>
          <div className="mt-2 text-3xl font-semibold text-gray-900">—</div>
          <div className="mt-2 text-xs text-gray-500">Real data coming soon</div>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <div className="text-sm text-gray-500">Leads</div>
          <div className="mt-2 text-3xl font-semibold text-gray-900">—</div>
          <div className="mt-2 text-xs text-gray-500">Lead tracking coming soon</div>
        </div>
      </div>

      <div className="mt-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">Getting Started</h2>
        <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-gray-700">
          <li>Complete your <a href="/dashboard/profile" className="text-blue-600 hover:underline">business profile</a>.</li>
          <li>Work with the QN team to set up your first sponsorship.</li>
          <li>Return here to see performance insights as features roll out.</li>
        </ul>
      </div>
    </DashboardLayout>
  )
}