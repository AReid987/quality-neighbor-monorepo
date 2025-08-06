'use client'

import { useState } from 'react'
import { useAuth } from '@/lib/auth-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Plus, MapPin, Tag, FileText, DollarSign } from 'lucide-react'
import { supabase } from '@/lib/supabase'

const LISTING_CATEGORIES = [
  'Gardening',
  'Tools',
  'Childcare',
  'Pet Care',
  'DIY/Home Improvement',
  'Cooking',
  'Technology',
  'Transportation',
  'Cleaning',
  'Moving/Delivery',
  'Tutoring/Education',
  'Senior Care',
  'Other'
]

const EXCHANGE_MECHANISMS = [
  { value: 'Free', label: 'Free', description: 'No payment required' },
  { value: 'Barter', label: 'Barter/Trade', description: 'Exchange for goods or services' },
  { value: 'TimeBank Credits', label: 'Time Bank Credits', description: 'Future feature - earn/spend time credits' }
]

interface CreateListingProps {
  onSuccess?: () => void
  onCancel?: () => void
}

export function CreateListing({ onSuccess, onCancel }: CreateListingProps) {
  const { user, qnUser } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const [formData, setFormData] = useState({
    type: 'Offer' as 'Offer' | 'Request',
    category: '',
    title: '',
    description: '',
    location: qnUser?.location || '',
    exchangeMechanism: 'Free' as 'Free' | 'Barter' | 'TimeBank Credits'
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !qnUser) return

    setLoading(true)
    setError('')

    try {
      const { error } = await supabase
        .from('qn_service_listings')
        .insert({
          poster_user_id: user.id,
          type: formData.type,
          category: formData.category,
          title: formData.title,
          description: formData.description,
          location: formData.location,
          exchange_mechanism: formData.exchangeMechanism,
          status: 'Available'
        })

      if (error) {
        setError(error.message)
      } else {
        setSuccess(true)
        if (onSuccess) {
          onSuccess()
        }
      }
    } catch (err) {
      setError('Failed to create listing. Please try again.')
    }

    setLoading(false)
  }

  if (success) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Plus className="h-8 w-8 text-green-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Listing Created Successfully!
          </h3>
          <p className="text-gray-600 mb-4">
            Your {formData.type.toLowerCase()} for "{formData.title}" has been posted to the community.
          </p>
          <div className="flex space-x-2 justify-center">
            <Button
              onClick={() => setSuccess(false)}
              variant="outline"
            >
              Create Another
            </Button>
            <Button
              onClick={() => window.location.href = '/dashboard/listings'}
            >
              View My Listings
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Plus className="h-5 w-5" />
          <span>Create New Listing</span>
        </CardTitle>
        <p className="text-gray-600">
          Share what you can offer or request help from your neighbors
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Listing Type */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">What would you like to do?</Label>
            <RadioGroup
              value={formData.type}
              onValueChange={(value: 'Offer' | 'Request') => 
                setFormData(prev => ({ ...prev, type: value }))
              }
              className="flex space-x-6"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Offer" id="offer" />
                <Label htmlFor="offer" className="cursor-pointer">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">Offer</span>
                    <Badge variant="secondary">I can help</Badge>
                  </div>
                  <p className="text-xs text-gray-500">Share something you can provide</p>
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Request" id="request" />
                <Label htmlFor="request" className="cursor-pointer">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">Request</span>
                    <Badge variant="outline">I need help</Badge>
                  </div>
                  <p className="text-xs text-gray-500">Ask for something you need</p>
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="category" className="text-sm font-medium flex items-center space-x-1">
              <Tag className="h-4 w-4" />
              <span>Category</span>
            </Label>
            <Select value={formData.category} onValueChange={(value) => 
              setFormData(prev => ({ ...prev, category: value }))
            }>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {LISTING_CATEGORIES.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-medium flex items-center space-x-1">
              <FileText className="h-4 w-4" />
              <span>Title</span>
            </Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder={formData.type === 'Offer' ? 
                "e.g., Free tomatoes from my garden" : 
                "e.g., Need help moving furniture"
              }
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium">
              Description
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder={formData.type === 'Offer' ? 
                "Describe what you're offering, when it's available, any conditions..." :
                "Describe what you need help with, when you need it, any requirements..."
              }
              rows={4}
              required
            />
          </div>

          {/* Location */}
          <div className="space-y-2">
            <Label htmlFor="location" className="text-sm font-medium flex items-center space-x-1">
              <MapPin className="h-4 w-4" />
              <span>Location</span>
            </Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
              placeholder="Hartland Ranch, Austin, TX"
              required
            />
          </div>

          {/* Exchange Mechanism */}
          <div className="space-y-3">
            <Label className="text-sm font-medium flex items-center space-x-1">
              <DollarSign className="h-4 w-4" />
              <span>Exchange Type</span>
            </Label>
            <RadioGroup
              value={formData.exchangeMechanism}
              onValueChange={(value: 'Free' | 'Barter' | 'TimeBank Credits') => 
                setFormData(prev => ({ ...prev, exchangeMechanism: value }))
              }
              className="space-y-3"
            >
              {EXCHANGE_MECHANISMS.map((mechanism) => (
                <div key={mechanism.value} className="flex items-start space-x-3">
                  <RadioGroupItem 
                    value={mechanism.value} 
                    id={mechanism.value}
                    className="mt-1"
                  />
                  <Label htmlFor={mechanism.value} className="cursor-pointer flex-1">
                    <div className="font-medium">{mechanism.label}</div>
                    <div className="text-xs text-gray-500">{mechanism.description}</div>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="flex space-x-3 pt-4">
            <Button
              type="submit"
              disabled={loading || !formData.category || !formData.title}
              className="flex-1"
            >
              {loading ? 'Creating...' : `Create ${formData.type}`}
            </Button>
            {onCancel && (
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
              >
                Cancel
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  )
}