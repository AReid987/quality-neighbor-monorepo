'use client'

import { useState } from 'react'
import { useAuth } from '@/lib/auth-context'
import { Menu, X, Building2, LayoutDashboard, UserCircle, Megaphone, MessageSquare, CreditCard, Settings, LogOut } from 'lucide-react'

interface DashboardLayoutProps {
  children: React.ReactNode
  active?: string
}

export function DashboardLayout({ children, active = 'overview' }: DashboardLayoutProps) {
  const { qnUser, signOut } = useAuth()
  const [open, setOpen] = useState(false)

  const nav = [
    { id: 'overview', name: 'Overview', icon: LayoutDashboard, href: '/dashboard' },
    { id: 'profile', name: 'Business Profile', icon: UserCircle, href: '/dashboard/profile' },
    { id: 'campaigns', name: 'Campaigns', icon: Megaphone, href: '/dashboard/campaigns' },
    { id: 'messages', name: 'Messages', icon: MessageSquare, href: '/dashboard/messages' },
    { id: 'billing', name: 'Billing', icon: CreditCard, href: '/dashboard/billing' },
    { id: 'settings', name: 'Settings', icon: Settings, href: '/dashboard/settings' },
  ]

  const handleSignOut = async () => {
    await signOut()
    window.location.href = '/'
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile overlay */}
      {open && (
        <div className="fixed inset-0 z-40 bg-black/40 lg:hidden" onClick={() => setOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 transform bg-white shadow-lg transition-transform duration-300 ease-in-out ${open ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static`}>
        <div className="flex items-center justify-between border-b px-6 h-16">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-blue-600">
              <Building2 className="h-5 w-5 text-white" />
            </div>
            <span className="text-sm font-semibold text-gray-900">QN Business</span>
          </div>
          <button className="lg:hidden rounded-md p-2 hover:bg-gray-50" onClick={() => setOpen(false)}>
            <X className="h-5 w-5 text-gray-700" />
          </button>
        </div>

        <div className="border-b p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-700">
              <UserCircle className="h-5 w-5" />
            </div>
            <div>
              <div className="text-sm font-medium text-gray-900">
                {qnUser?.first_name} {qnUser?.last_name}
              </div>
              <div className="text-xs text-gray-500">Business Owner</div>
            </div>
          </div>
        </div>

        <nav className="p-3">
          {nav.map((n) => {
            const Icon = n.icon
            const isActive = active === n.id
            return (
              <a
                key={n.id}
                href={n.href}
                className={`mb-1 flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors ${isActive ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`}
              >
                <Icon className="mr-3 h-5 w-5" />
                {n.name}
              </a>
            )
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 border-t p-6">
          <button
            onClick={handleSignOut}
            className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900"
          >
            <LogOut className="h-5 w-5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <div className="sticky top-0 z-40 border-b bg-white">
          <div className="mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:max-w-6xl lg:px-8">
            <button className="rounded-md p-2 hover:bg-gray-50 lg:hidden" onClick={() => setOpen(true)}>
              <Menu className="h-5 w-5 text-gray-700" />
            </button>
            <div className="text-lg font-semibold text-gray-900 capitalize">
              {active}
            </div>
            <div className="text-sm text-gray-500">
              {qnUser ? `Welcome, ${qnUser.first_name}!` : ''}
            </div>
          </div>
        </div>

        {/* Content */}
        <main className="py-8">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}