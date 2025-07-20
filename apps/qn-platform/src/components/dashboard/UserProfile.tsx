'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { User, MapPin, Mail, Calendar, Shield } from 'lucide-react'
import { supabase } from '@/lib/supabase'

const INTEREST_OPTIONS = [
  'Gardening',
  'Childcare', 
  'DIY/Home Improvement',
  'Pet Care',
  'Cooking',
  'Technology',
  'Fitness',
  'Arts & Crafts',
  'Music',
  'Reading',
  'Volunteering',
  'Senior Care'
]

export function UserProfile() {
  const { user, qnUser, loading } = useAuth()
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  
  const [profileData, setProfileData] = useState({
    first_name: '',
    last_name: '',
    location: '',
    interests: [] as string[]
  })

  useEffect(() => {
    if (qnUser) {
      setProfileData({
        first_name: qnUser.first_name || '',
        last_name: qnUser.last_name || '',
        location: qnUser.location || '',
        interests: qnUser.interests || []
      })
    }
  }, [qnUser])

  const handleInterestChange = (interest: string, checked: boolean) => {
    if (checked) {
      setProfileData(prev => ({
        ...prev,
        interests: [...prev.interests, interest]
      }))
    } else {
      setProfileData(prev => ({
        ...prev,
        interests: prev.interests.filter(i => i !== interest)
      }))
    }
  }

  const handleSave = async () => {
    if (!user || !qnUser) return
    
    setSaving(true)
    setError('')
    setSuccess('')

    try {
      const { error } = await supabase
        .from('qn_users')
        .update({
          first_name: profileData.first_name,
          last_name: profileData.last_name,
          location: profileData.location,
          interests: profileData.interests,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id)

      if (error) {
        setError(error.message)
      } else {
        setSuccess('Profile updated successfully!')
        setEditing(false)
        // Refresh user data
        window.location.reload()
      }
    } catch (err) {
      setError('Failed to update profile')
    }

    setSaving(false)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!user || !qnUser) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-gray-600">Please sign in to view your profile.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Profile Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <CardTitle className="text-2xl">
                  {qnUser.first_name} {qnUser.last_name}
                </CardTitle>
                <div className="flex items-center space-x-4 text-sm text-gray-600 mt-2">
                  <div className="flex items-center space-x-1">
                    <Mail className="h-4 w-4" />
                    <span>{qnUser.email}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MapPin className="h-4 w-4" />
                    <span>{qnUser.location}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {qnUser.is_verified && (
                <Badge variant="secondary" className="flex items-center space-x-1">
                  <Shield className="h-3 w-3" />
                  <span>Verified</span>
                </Badge>
              )}
              <Badge variant="outline">
                {qnUser.role}
              </Badge>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Profile Details */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Profile Information</CardTitle>
            <Button
              variant={editing ? "outline" : "default"}
              onClick={() => editing ? setEditing(false) : setEditing(true)}
            >
              {editing ? 'Cancel' : 'Edit Profile'}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          {success && (
            <Alert>
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                value={profileData.first_name}
                onChange={(e) => setProfileData(prev => ({ ...prev, first_name: e.target.value }))}
                disabled={!editing}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                value={profileData.last_name}
                onChange={(e) => setProfileData(prev => ({ ...prev, last_name: e.target.value }))}
                disabled={!editing}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={profileData.location}
              onChange={(e) => setProfileData(prev => ({ ...prev, location: e.target.value }))}
              disabled={!editing}
              placeholder="Hartland Ranch, Austin, TX"
            />
          </div>

          {qnUser.role === 'Resident' && (
            <div className="space-y-2">
              <Label>Interests</Label>
              {editing ? (
                <div className="grid grid-cols-2 gap-2">
                  {INTEREST_OPTIONS.map((interest) => (
                    <div key={interest} className="flex items-center space-x-2">
                      <Checkbox
                        id={interest}
                        checked={profileData.interests.includes(interest)}
                        onCheckedChange={(checked) => 
                          handleInterestChange(interest, checked as boolean)
                        }
                      />
                      <Label
                        htmlFor={interest}
                        className="text-sm cursor-pointer"
                      >
                        {interest}
                      </Label>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {profileData.interests.map((interest) => (
                    <Badge key={interest} variant="secondary">
                      {interest}
                    </Badge>
                  ))}
                  {profileData.interests.length === 0 && (
                    <p className="text-gray-500 text-sm">No interests selected</p>
                  )}
                </div>
              )}
            </div>
          )}

          {editing && (
            <div className="flex space-x-2 pt-4">
              <Button onClick={handleSave} disabled={saving}>
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
              <Button variant="outline" onClick={() => setEditing(false)}>
                Cancel
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Account Information */}
      <Card>
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <Label className="text-gray-600">Member Since</Label>
              <p>{new Date(qnUser.created_at).toLocaleDateString()}</p>
            </div>
            <div>
              <Label className="text-gray-600">Last Updated</Label>
              <p>{new Date(qnUser.updated_at).toLocaleDateString()}</p>
            </div>
            <div>
              <Label className="text-gray-600">Account Type</Label>
              <p>{qnUser.role}</p>
            </div>
            <div>
              <Label className="text-gray-600">Verification Status</Label>
              <p>{qnUser.is_verified ? 'Verified' : 'Pending'}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}