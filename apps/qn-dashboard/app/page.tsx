'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { useAuth } from '@/lib/auth-context';
import LandingPage from '@/components/landing/LandingPage';
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
  const { user, loading, login, signup } = useAuth();
  const [showSignup, setShowSignup] = useState(false);
  const [signupData, setSignupData] = useState({
    email: '',
    password: '',
    name: '',
    role: 'user'
  });
  const [activeTab, setActiveTab] = useState<'guide' | 'admin' | 'dashboard'>('guide');

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Quality Neighbor</h1>
            <p className="text-gray-600">Dashboard Access</p>
          </div>
          <div className="bg-white shadow-lg rounded-lg p-8">
            {!showSignup ? (
              // Login Form
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Sign In</h2>
                <div className="space-y-4">
                  <button 
                    onClick={async () => {
                      try {
                        await login('admin@qualityneighbor.com', 'admin123');
                        window.location.reload();
                      } catch (error) {
                        alert('Login failed: ' + (error as Error).message);
                      }
                    }}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Sign In (Demo Admin)
                  </button>
                  <button 
                    onClick={async () => {
                      try {
                        await login('user@example.com', 'user123');
                        window.location.reload();
                      } catch (error) {
                        alert('Login failed: ' + (error as Error).message);
                      }
                    }}
                    className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors"
                  >
                    Sign In (Demo User)
                  </button>
                  
                  <div className="text-center">
                    <button
                      onClick={() => setShowSignup(true)}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      Create New Account
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              // Signup Form
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Create Account</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                    <input 
                      type="text"
                      value={signupData.name}
                      onChange={(e) => setSignupData({...signupData, name: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input 
                      type="email"
                      value={signupData.email}
                      onChange={(e) => setSignupData({...signupData, email: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter your email"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                    <input 
                      type="password"
                      value={signupData.password}
                      onChange={(e) => setSignupData({...signupData, password: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter your password"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                    <select
                      value={signupData.role}
                      onChange={(e) => setSignupData({...signupData, role: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                  <button 
                    onClick={async () => {
                      try {
                        if (!signupData.email || !signupData.password || !signupData.name) {
                          alert('Please fill in all fields');
                          return;
                        }
                        await signup(signupData.email, signupData.password, signupData);
                        window.location.reload();
                      } catch (error) {
                        alert('Signup failed: ' + (error as Error).message);
                      }
                    }}
                    className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 transition-colors"
                  >
                    Create Account
                  </button>
                  
                  <div className="text-center">
                    <button
                      onClick={() => setShowSignup(false)}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      Back to Sign In
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            <div className="border-t pt-6">
              <p className="text-sm text-gray-600 mb-3">Demo Accounts Available:</p>
              <div className="space-y-2 text-xs text-gray-500">
                <div>Admin: admin@qualityneighbor.com / admin123</div>
                <div>User: user@example.com / user123</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
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