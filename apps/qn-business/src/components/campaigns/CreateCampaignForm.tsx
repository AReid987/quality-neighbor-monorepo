'use client'

import { useState } from 'react'
import { supabase, QNAdvertisement } from '@/lib/supabase'
import { Card, CardContent, CardHeader, CardTitle, Input, Label, Button } from '@qn/ui'

type Props = {
  businessId?: string | null
  onCreated?: (ad: QNAdvertisement) => void
}

const STATUSES = ['Pending Review', 'Active', 'Paused'] as const

export function CreateCampaignForm({ businessId, onCreated }: Props) {
  const [campaignName, setCampaignName] = useState('')
  const [adCreativeUrl, setAdCreativeUrl] = useState('')
  const [adCopy, setAdCopy] = useState('')
  const [status, setStatus] = useState<(typeof STATUSES)[number]>('Pending Review')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!businessId) {
      setError('You need a business profile before creating campaigns.')
      return
    }

    if (!campaignName || !adCreativeUrl || !adCopy || !startDate || !endDate) {
      setError('Please fill in all required fields.')
      return
    }

    setSubmitting(true)
    try {
      const insert = {
        business_id: businessId,
        campaign_name: campaignName,
        ad_creative_url: adCreativeUrl,
        ad_copy: adCopy,
        status,
        start_date: startDate,
        end_date: endDate,
      }

      const { data, error } = await supabase
        .from('qn_advertisements')
        .insert(insert)
        .select('*')
        .single()

      if (error) {
        setError(error.message)
      } else if (data) {
        setSuccess('Campaign created.')
        setCampaignName('')
        setAdCreativeUrl('')
        setAdCopy('')
        setStatus('Pending Review')
        setStartDate('')
        setEndDate('')
        onCreated?.(data as QNAdvertisement)
      }
    } catch {
      setError('Failed to create campaign.')
    }
    setSubmitting(false)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Campaign</CardTitle>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="mb-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 rounded-md border border-green-200 bg-green-50 p-3 text-sm text-green-700">
            {success}
          </div>
        )}

        <form onSubmit={handleCreate} className="space-y-5">
          <div>
            <Label>Campaign Name</Label>
            <Input
              className="mt-2"
              value={campaignName}
              onChange={(e) => setCampaignName(e.target.value)}
              placeholder="Summer Special – Hartland Ranch"
              required
            />
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div>
              <Label>Start Date</Label>
              <Input
                className="mt-2"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
              />
            </div>
            <div>
              <Label>End Date</Label>
              <Input
                className="mt-2"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <Label>Ad Creative URL</Label>
            <Input
              className="mt-2"
              value={adCreativeUrl}
              onChange={(e) => setAdCreativeUrl(e.target.value)}
              placeholder="https://cdn.example.com/creative.png"
              required
            />
          </div>

          <div>
            <Label>Ad Copy</Label>
            <textarea
              className="mt-2 w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={4}
              value={adCopy}
              onChange={(e) => setAdCopy(e.target.value)}
              placeholder="Describe your campaign offer..."
              required
            />
          </div>

          <div>
            <Label>Status</Label>
            <select
              className="mt-2 w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={status}
              onChange={(e) => setStatus(e.target.value as (typeof STATUSES)[number])}
            >
              {STATUSES.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <Button type="submit" disabled={submitting || !businessId}>
              {submitting ? 'Creating...' : 'Create Campaign'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}