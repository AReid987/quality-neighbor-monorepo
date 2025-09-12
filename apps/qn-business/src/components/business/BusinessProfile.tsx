'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/lib/auth-context'
import { supabase, QNBusiness } from '@/lib/supabase'

const AD_TIERS = ['Bronze', 'Silver', 'Gold'] as const

export function BusinessProfile() {
  const { user, qnUser } = useAuth()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [existing, setExisting] = useState<QNBusiness | null>(null)

  const [formData, setFormData] = useState({
    business_name: '',
    contact_email: '',
    contact_phone: '',
    address: '',
    category: '',
    description: '',
    logo_url: '',
    ad_package_tier: 'Bronze' as 'Bronze' | 'Silver' | 'Gold',
  })

  useEffect(() => {
    const load = async () => {
      if (!user) return
      setLoading(true)
      setError('')
      setSuccess('')

      const { data, error } = await supabase
        .from('qn_businesses')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (error) {
        // 406 or 404 -> no row; allow creation
        setExisting(null)
        setLoading(false)
        return
      }

      setExisting(data as QNBusiness)
      setFormData({
        business_name: data.business_name || '',
        contact_email: data.contact_email || '',
        contact_phone: data.contact_phone || '',
        address: data.address || '',
        category: data.category || '',
        description: data.description || '',
        logo_url: data.logo_url || '',
        ad_package_tier: (data.ad_package_tier as 'Bronze' | 'Silver' | 'Gold') || 'Bronze',
      })
      setLoading(false)
    }

    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id])

  const handleSave = async () => {
    if (!user) return
    setSaving(true)
    setError('')
    setSuccess('')

    try {
      if (existing) {
        const { error } = await supabase
          .from('qn_businesses')
          .update({
            business_name: formData.business_name,
            contact_email: formData.contact_email,
            contact_phone: formData.contact_phone,
            address: formData.address,
            category: formData.category,
            description: formData.description || null,
            logo_url: formData.logo_url || null,
            ad_package_tier: formData.ad_package_tier,
            updated_at: new Date().toISOString(),
          })
          .eq('user_id', user.id)

        if (error) {
          setError(error.message)
        } else {
          setSuccess('Business profile updated successfully.')
        }
      } else {
        const { error } = await supabase
          .from('qn_businesses')
          .insert({
            user_id: user.id,
            business_name: formData.business_name,
            contact_email: formData.contact_email,
            contact_phone: formData.contact_phone,
            address: formData.address,
            category: formData.category,
            description: formData.description || null,
            logo_url: formData.logo_url || null,
            ad_package_tier: formData.ad_package_tier,
          })

        if (error) {
          setError(error.message)
        } else {
          setSuccess('Business profile created successfully.')
          setExisting({
            business_id: 'temp',
            user_id: user.id,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            ...formData,
          } as unknown as QNBusiness)
        }
      }
    } catch {
      setError('Failed to save business profile.')
    }

    setSaving(false)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600" />
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">
          {existing ? 'Edit Business Profile' : 'Create Business Profile'}
        </h1>
        <p className="text-gray-600 mt-1">
          {qnUser ? `Signed in as ${qnUser.first_name} ${qnUser.last_name}` : ''}
        </p>
      </div>

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

      <div className="space-y-5 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <div>
          <label className="block text-sm font-medium text-gray-700">Business Name</label>
          <input
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.business_name}
            onChange={(e) => setFormData({ ...formData, business_name: e.target.value })}
            placeholder="Hartland Ranch Bakery"
            required
          />
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700">Contact Email</label>
            <input
              type="email"
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.contact_email}
              onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
              placeholder="owner@business.com"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Contact Phone</label>
            <input
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.contact_phone}
              onChange={(e) => setFormData({ ...formData, contact_phone: e.target.value })}
              placeholder="(512) 555-1234"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Address</label>
          <input
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            placeholder="123 Main St, Austin, TX"
            required
          />
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700">Category</label>
            <input
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              placeholder="Bakery, Auto Repair, Boutique..."
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Ad Package Tier</label>
            <select
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.ad_package_tier}
              onChange={(e) => setFormData({ ...formData, ad_package_tier: e.target.value as 'Bronze' | 'Silver' | 'Gold' })}
            >
              {AD_TIERS.map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={4}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="What makes your business special?"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Logo URL</label>
          <input
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.logo_url}
            onChange={(e) => setFormData({ ...formData, logo_url: e.target.value })}
            placeholder="https://example.com/logo.png"
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            onClick={handleSave}
            disabled={saving || !formData.business_name || !formData.contact_email || !formData.contact_phone || !formData.address || !formData.category}
            className="rounded-md bg-blue-600 px-5 py-2 font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {saving ? 'Saving...' : (existing ? 'Save Changes' : 'Create Profile')}
          </button>
        </div>
      </div>
    </div>
  )
}