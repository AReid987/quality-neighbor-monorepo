'use client'

import { useEffect, useMemo, useState } from 'react'
import { useAuth } from '@/lib/auth-context'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { supabase, QNBusiness, QNAdvertisement } from '@/lib/supabase'
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell, Badge, Button } from '@qn/ui'
import { CreateCampaignForm } from '@/components/campaigns/CreateCampaignForm'

export default function CampaignsPage() {
  const { user, qnUser, loading } = useAuth()
  const [biz, setBiz] = useState<QNBusiness | null>(null)
  const [campaigns, setCampaigns] = useState<QNAdvertisement[]>([])
  const [fetching, setFetching] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const canToggle = useMemo(() => (status: QNAdvertisement['status']) => status === 'Active' || status === 'Paused', [])

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

  const toggleStatus = async (ad: QNAdvertisement) => {
    if (!canToggle(ad.status)) return
    const next = ad.status === 'Active' ? 'Paused' : 'Active'
    const { error } = await supabase
      .from('qn_advertisements')
      .update({ status: next })
      .eq('ad_id', ad.ad_id)
    if (!error) {
      setCampaigns(prev => prev.map(c => c.ad_id === ad.ad_id ? { ...c, status: next } : c))
    }
  }

  const badgeClass = (status: QNAdvertisement['status']) => {
    if (status === 'Active') return 'bg-green-100 text-green-700'
    if (status === 'Paused') return 'bg-yellow-100 text-yellow-700'
    if (status === 'Pending Review') return 'bg-blue-100 text-blue-700'
    return 'bg-gray-100 text-gray-700'
    }

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
          <Button onClick={() => setShowForm((s) => !s)}>
            {showForm ? 'Close' : 'New Campaign'}
          </Button>
        </div>

        {!biz && !fetching && (
          <div className="mt-6 rounded-md border border-yellow-200 bg-yellow-50 p-4 text-sm text-yellow-800">
            You need a business profile before creating campaigns. <a href="/dashboard/profile" className="underline">Create your profile</a>.
          </div>
        )}

        {showForm && (
          <div className="mt-6">
            <CreateCampaignForm
              businessId={biz?.business_id}
              onCreated={(ad) => {
                setCampaigns(prev => [ad, ...prev])
                setShowForm(false)
              }}
            />
          </div>
        )}

        <div className="mt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Campaign</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Dates</TableHead>
                <TableHead className="text-right">Impressions</TableHead>
                <TableHead className="text-right">Clicks</TableHead>
                <TableHead className="text-right">Conversions</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {fetching ? (
                <TableRow>
                  <TableCell colSpan={7} className="py-6 text-center text-sm text-gray-600">
                    Loading campaigns…
                  </TableCell>
                </TableRow>
              ) : campaigns.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="py-6 text-center text-sm text-gray-600">
                    No campaigns yet.
                  </TableCell>
                </TableRow>
              ) : (
                campaigns.map((c) => (
                  <TableRow key={c.ad_id}>
                    <TableCell>
                      <div className="font-medium text-gray-900">{c.campaign_name}</div>
                      <div className="max-w-[28rem] truncate text-xs text-gray-500">{c.ad_copy}</div>
                    </TableCell>
                    <TableCell>
                      <Badge className={badgeClass(c.status)}>{c.status}</Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(c.start_date).toLocaleDateString()} - {new Date(c.end_date).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">{(c.impressions || 0).toLocaleString()}</TableCell>
                    <TableCell className="text-right">{(c.clicks || 0).toLocaleString()}</TableCell>
                    <TableCell className="text-right">{(c.conversions || 0).toLocaleString()}</TableCell>
                    <TableCell className="text-right">
                      {canToggle(c.status) ? (
                        <Button
                          variant="secondary"
                          onClick={() => toggleStatus(c)}
                        >
                          {c.status === 'Active' ? 'Pause' : 'Activate'}
                        </Button>
                      ) : (
                        <span className="text-xs text-gray-500">—</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </DashboardLayout>
  )
}