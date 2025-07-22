'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Mail, Lock, User } from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LoginModal = ({ isOpen, onClose }: LoginModalProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const success = await login(email, password);
      if (success) {
        onClose();
      }
    } catch (error) {
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async (demoEmail: string) => {
    setLoading(true);
    setError('');
    
    try {
      const success = await login(demoEmail, 'demo');
      if (success) {
        onClose();
      }
    } catch (error) {
      setError('Demo login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mx-auto mb-4 p-3 bg-blue-100 rounded-full w-fit">
            <User className="h-8 w-8 text-blue-600" />
          </div>
          <DialogTitle className="text-2xl font-bold text-gray-800 text-center">
            Quality Neighbor
          </DialogTitle>
          <p className="text-gray-600 text-center">Sign in to access the platform</p>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium text-gray-700">
              Email
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10"
                placeholder="Enter your email"
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium text-gray-700">
              Password
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10"
                placeholder="Enter your password"
                required
              />
            </div>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700"
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>

        <div className="mt-6 p-4 bg-gray-50 rounded-lg space-y-2">
          <p className="text-sm text-gray-600 mb-3">Demo Accounts:</p>
          
          <Button
            variant="outline"
            className="w-full text-left justify-start"
            onClick={() => handleDemoLogin('admin@qualityneighbor.com')}
            disabled={loading}
          >
            <div className="text-left">
              <div className="font-medium">Admin Account</div>
              <div className="text-xs text-gray-500">admin@qualityneighbor.com</div>
            </div>
          </Button>
          
          <Button
            variant="outline"
            className="w-full text-left justify-start"
            onClick={() => handleDemoLogin('user@example.com')}
            disabled={loading}
          >
            <div className="text-left">
              <div className="font-medium">User Account</div>
              <div className="text-xs text-gray-500">user@example.com</div>
            </div>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};