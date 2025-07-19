'use client'

import { useState } from 'react'
import { useAuth } from '@/lib/auth-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Mail, Lock, User } from 'lucide-react'

interface SignInFormProps {
  onToggleMode: () => void
}

export function SignInForm({ onToggleMode }: SignInFormProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [resetMode, setResetMode] = useState(false)
  const { signIn, resetPassword } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (resetMode) {
      const { error } = await resetPassword(email)
      if (error) {
        setError(error.message)
      } else {
        setError('')
        alert('Password reset email sent! Check your inbox.')
        setResetMode(false)
      }
    } else {
      const { error } = await signIn(email, password)
      if (error) {
        setError(error.message)
      }
    }
    
    setLoading(false)
  }

  return (
    <Card className="w-full max-w-md mx-auto bg-white/80 backdrop-blur-sm shadow-xl border-0">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 p-3 bg-blue-100 rounded-full w-fit">
          <User className="h-8 w-8 text-blue-600" />
        </div>
        <CardTitle className="text-2xl font-bold text-gray-800">
          {resetMode ? 'Reset Password' : 'Welcome Back'}
        </CardTitle>
        <p className="text-gray-600">
          {resetMode 
            ? 'Enter your email to receive a password reset link'
            : 'Sign in to your Quality Neighbor account'
          }
        </p>
      </CardHeader>
      <CardContent>
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
          
          {!resetMode && (
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
          )}

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
            {loading 
              ? (resetMode ? 'Sending...' : 'Signing in...') 
              : (resetMode ? 'Send Reset Email' : 'Sign In')
            }
          </Button>
        </form>

        <div className="mt-6 space-y-4">
          {!resetMode && (
            <div className="text-center">
              <button
                onClick={() => setResetMode(true)}
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                Forgot your password?
              </button>
            </div>
          )}

          {resetMode && (
            <div className="text-center">
              <button
                onClick={() => setResetMode(false)}
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                Back to Sign In
              </button>
            </div>
          )}

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <button
                onClick={onToggleMode}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Sign Up
              </button>
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}