'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useAuth } from '@/lib/auth-context';
import { LoginForm } from '@/components/auth/login-form';
import { StrategyGuide } from '@/components/strategy/strategy-guide';
import { Navigation } from '@/components/layout/navigation';
import { Button } from '@/components/ui/button';
import { Shield, FileText, BarChart } from 'lucide-react';

// Dynamically import AdminDashboard to prevent SSR issues with recharts
const AdminDashboard = dynamic(
  () => import('@/components/admin/admin-dashboard').then(mod => ({ default: mod.AdminDashboard })),
  { 
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }
);

export default function Home() {
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState<'guide' | 'admin' | 'dashboard'>('guide');

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return <LoginForm />;
  }

  return (
    <div className="min-h-screen">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex bg-white/80 backdrop-blur-sm rounded-xl p-1 shadow-lg">
            <Button
              variant={activeTab === 'guide' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('guide')}
              className="flex items-center gap-2"
            >
              <FileText className="h-4 w-4" />
              Strategy Guide
            </Button>
            <Button
              variant={activeTab === 'dashboard' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('dashboard')}
              className="flex items-center gap-2"
            >
              <BarChart className="h-4 w-4" />
              Analytics
            </Button>
            {user.role === 'admin' && (
              <Button
                variant={activeTab === 'admin' ? 'default' : 'ghost'}
                onClick={() => setActiveTab('admin')}
                className="flex items-center gap-2"
              >
                <Shield className="h-4 w-4" />
                Admin
              </Button>
            )}
          </div>
        </div>

        {/* Content */}
        {activeTab === 'guide' && <StrategyGuide />}
        {activeTab === 'dashboard' && <AdminDashboard />}
        {activeTab === 'admin' && user.role === 'admin' && <AdminDashboard />}
      </div>
    </div>
  );
}