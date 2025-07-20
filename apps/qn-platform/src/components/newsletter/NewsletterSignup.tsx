'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Mail, MapPin, User } from 'lucide-react'
import { supabase } from '@/lib/supabase'

interface NewsletterSignupProps {
  onSuccess?: () => void
  className?: string
}

export function NewsletterSignup({ onSuccess, className = '' }: NewsletterSignupProps) {
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    location: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      // Insert into newsletter subscribers table
      const { error } = await supabase
        .from('qn_newsletter_subscribers')
        .insert({
          email: formData.email,
          first_name: formData.firstName || null,
          location: formData.location || null,
          subscribed_at: new Date().toISOString(),
          is_active: true
        })

      if (error) {
        if (error.code === '23505') { // Unique constraint violation
          setError('This email is already subscribed to our newsletter!')
        } else {
          setError(error.message)
        }
      } else {
        setSuccess(true)
        setFormData({ email: '', firstName: '', location: '' })
        if (onSuccess) {
          onSuccess()
        }
      }
    } catch (err) {
      setError('Failed to subscribe. Please try again.')
    }

    setLoading(false)
  }

  if (success) {
    return (
      <Card className={className}>
        <CardContent className="p-6 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Mail className="h-8 w-8 text-green-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Welcome to Quality Neighbor!
          </h3>
          <p className="text-gray-600 mb-4">
            Thank you for subscribing to our newsletter. You will receive updates about your local community, events, and opportunities to connect with neighbors.
          </p>
          <Button
            variant="outline"
            onClick={() => setSuccess(false)}
            className="text-sm"
          >
            Subscribe Another Email
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-center">
          Get the Free Quality Neighbor Newsletter
        </CardTitle>
        <p className="text-center text-gray-600">
          Stay connected with your community. Get local news, events, and neighbor updates delivered to your inbox.
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium">
              Email Address *
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                className="pl-10"
                placeholder="your@email.com"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="firstName" className="text-sm font-medium">
              First Name (optional)
            </Label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="firstName"
                type="text"
                value={formData.firstName}
                onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                className="pl-10"
                placeholder="Your first name"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location" className="text-sm font-medium">
              Location (optional)
            </Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="location"
                type="text"
                value={formData.location}
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                className="pl-10"
                placeholder="Hartland Ranch, Austin, TX"
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
            {loading ? 'Subscribing...' : 'Subscribe to Newsletter'}
          </Button>

          <p className="text-xs text-gray-500 text-center">
            We respect your privacy. Unsubscribe at any time. No spam, just quality community updates.
          </p>
        </form>
      </CardContent>
    </Card>
  )
}