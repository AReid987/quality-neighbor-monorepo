'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/lib/auth-context'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { supabase, QNBusiness, QNAdvertisement } from '@/lib/supabase'

export default function CampaignsPage() {
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
        .order('created_at', { ascending: false })

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

  return (
    <DashboardLayout active="campaigns">
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Campaigns</h2>
          <a
            href="#"
            className="rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700"
          >
            New Campaign (Coming Soon)
          </a>
        </div>

        {!biz && !fetching && (
          <div className="mt-6 rounded-md border border-yellow-200 bg-yellow-50 p-4 text-sm text-yellow-800">
            You need a business profile before creating campaigns. <a href="/dashboard/profile" className="underline">Create your profile</a>.
          </div>
        )}

        <div className="mt-6 overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr className="text-left text-sm text-gray-600">
                <th className="px-3 py-2">Campaign</th>
                <th className="px-3 py-2">Status</th>
                <th className="px-3 py-2">Dates</th>
                <th className="px-3 py-2 text-right">Impressions</th>
                <th className="px-3 py-2 text-right">Clicks</th>
                <th className="px-3 py-2 text-right">Conversions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {fetching ? (
                <tr>
                  <td colSpan={6} className="px-3 py-6 text-center text-sm text-gray-600">
                    Loading campaigns…
                  </td>
                </tr>
              ) : campaigns.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-3 py-6 text-center text-sm text-gray-600">
                    No campaigns yet.
                  </td>
                </tr>
              ) : (
                campaigns.map((c) => (
                  <tr key={c.ad_id} className="text-sm text-gray-800">
                    <td className="px-3 py-2">
                      <div className="font-medium text-gray-900">{c.campaign_name}</div>
                      <div className="text-xs text-gray-500 truncate max-w-[28rem]">{c.ad_copy}</div>
                    </td>
                    <td className="px-3 py-2">
                      <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs ${
                        c.status === 'Active' ? 'bg-green-100 text-green-700' :
                        c.status === 'Paused' ? 'bg-yellow-100 text-yellow-700' :
                        c.status === 'Pending Review' ? 'bg-blue-100 text-blue-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {c.status}
                      </span>
                    </td>
                    <td className="px-3 py-2">
                      <div>{new Date(c.start_date).toLocaleDateString()} - {new Date(c.end_date).toLocaleDateString()}</div>
                    </td>
                    <td className="px-3 py-2 text-right">{(c.impressions || 0).toLocaleString()}</td>
                    <td className="px-3 py-2 text-right">{(c.clicks || 0).toLocaleString()}</td>
                    <td className="px-3 py-2 text-right">{(c.conversions || 0).toLocaleString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  )
}