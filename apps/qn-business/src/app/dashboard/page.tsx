'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/lib/auth-context'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { supabase, QNBusiness, QNAdvertisement } from '@/lib/supabase'

export default function DashboardOverviewPage() {
  const { user, qnUser, loading } = useAuth()
  const [biz, setBiz] = useState<QNBusiness | null>(null)
  const [campaigns, setCampaigns] = useState<QNAdvertisement[]>([])
  const [fetching, setFetching] = useState(true)

  useEffect(() => {
    if (!loading && (!user || !qnUser)) {
      window.location.href = '/'
    }
  }, [user, qnUser, loading])

  useEffect(() => {
    const load = async () => {
      if (!user) return
      setFetching(true)

      const { data: b } = await supabase
        .from('qn_businesses')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (!b) {
        setBiz(null)
        setCampaigns([])
        setFetching(false)
        return
      }

      setBiz(b as QNBusiness)

      const { data: ads } = await supabase
        .from('qn_advertisements')
        .select('*')
        .eq('business_id', b.business_id)

      setCampaigns((ads || []) as QNAdvertisement[])
      setFetching(false)
    }
    if (user) void load()
  }, [user?.id])

  if (loading || !user || !qnUser) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-blue-600" />
      </main>
    )
  }

  const activeCount = campaigns.filter(c => c.status === 'Active').length
  const impressions = campaigns.reduce((sum, c) => sum + (c.impressions || 0), 0)
  const conversions = campaigns.reduce((sum, c) => sum + (c.conversions || 0), 0)

  return (
    <DashboardLayout active="overview">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <div className="text-sm text-gray-500">Active Campaigns</div>
          <div className="mt-2 text-3xl font-semibold text-gray-900">{fetching ? '…' : activeCount}</div>
          <div className="mt-2 text-xs text-gray-500">Campaign analytics coming soon</div>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <div className="text-sm text-gray-500">Total Impressions</div>
          <div className="mt-2 text-3xl font-semibold text-gray-900">{fetching ? '…' : impressions.toLocaleString()}</div>
          <div className="mt-2 text-xs text-gray-500">Aggregate across all campaigns</div>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <div className="text-sm text-gray-500">Leads (Conversions)</div>
          <div className="mt-2 text-3xl font-semibold text-gray-900">{fetching ? '…' : conversions.toLocaleString()}</div>
          <div className="mt-2 text-xs text-gray-500">Conversion tracking evolves later</div>
        </div>
      </div>

      {!biz && !fetching && (
        <div className="mt-6 rounded-lg border border-yellow-200 bg-yellow-50 p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-yellow-900">Create your business profile</h2>
          <p className="mt-2 text-sm text-yellow-800">
            You don&apos;t have a business profile yet. Start by creating one to enable campaigns.
          </p>
          <a
            href="/dashboard/profile"
            className="mt-4 inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Go to Business Profile
          </a>
        </div>
      )}

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