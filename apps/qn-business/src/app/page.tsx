'use client'

import { useState } from 'react'
import { useAuth } from '@/lib/auth-context'
import { BusinessProfile } from '@/components/business/BusinessProfile'

export default function HomePage() {
  const { user, qnUser, loading, signIn, signUp, signOut } = useAuth()
  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [location, setLocation] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')

    try {
      if (mode === 'signin') {
        const { error } = await signIn(email, password)
        if (error) setError(error.message)
      } else {
        const { error } = await signUp(email, password, {
          firstName,
          lastName,
          location,
          role: 'BusinessOwner',
        })
        if (error) setError(error.message)
      }
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-blue-600" />
      </main>
    )
  }

  if (!user || !qnUser) {
    return (
      <main className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-3xl px-6 py-12">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Quality Neighbor — Business Portal</h1>
            <p className="text-gray-600 mt-2">
              Create or manage your business profile to reach local residents.
            </p>
          </div>

          <div className="mb-4 flex items-center gap-3">
            <button
              className={`rounded-md px-4 py-2 text-sm font-medium ${mode === 'signin' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 border'}`}
              onClick={() => setMode('signin')}
            >
              Sign In
            </button>
            <button
              className={`rounded-md px-4 py-2 text-sm font-medium ${mode === 'signup' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 border'}`}
              onClick={() => setMode('signup')}
            >
              Create Account
            </button>
          </div>

          {error && (
            <div className="mb-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            {mode === 'signup' && (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">First Name</label>
                  <input
                    className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Last Name</label>
                  <input
                    className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Location</label>
                  <input
                    className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Hartland Ranch, Austin, TX"
                    required
                  />
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="owner@business.com"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <input
                  type="password"
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-end">
              <button
                type="submit"
                disabled={submitting}
                className="rounded-md bg-blue-600 px-5 py-2 font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {submitting ? (mode === 'signin' ? 'Signing in...' : 'Creating...') : (mode === 'signin' ? 'Sign In' : 'Create Account')}
              </button>
            </div>
          </form>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <div>
            <h1 className="text-lg font-semibold text-gray-900">Quality Neighbor — Business Portal</h1>
            <p className="text-sm text-gray-600">Manage your business profile</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-700 hidden sm:inline">
              {qnUser.first_name} {qnUser.last_name}
            </span>
            <button
              onClick={async () => { await signOut(); window.location.reload(); }}
              className="rounded-md border px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-6 py-8">
        <BusinessProfile />
      </div>
    </main>
  )
}