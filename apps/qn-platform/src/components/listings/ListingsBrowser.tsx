'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ListingCard } from './ListingCard'
import { CreateListing } from './CreateListing'
import { 
  Search, 
  Filter, 
  Plus, 
  MapPin, 
  Calendar,
  Grid,
  List,
  SlidersHorizontal
} from 'lucide-react'
import { supabase } from '@/lib/supabase'

const LISTING_CATEGORIES = [
  'All Categories',
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

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'title', label: 'Title A-Z' },
  { value: 'category', label: 'Category' },
  { value: 'location', label: 'Location' }
]

interface Listing {
  listing_id: string
  poster_user_id: string
  type: 'Offer' | 'Request'
  category: string
  title: string
  description: string
  location: string
  status: 'Available' | 'Fulfilled' | 'Cancelled'
  exchange_mechanism: 'Free' | 'Barter' | 'TimeBank Credits'
  created_at: string
  updated_at: string
  poster?: {
    first_name: string
    last_name: string
    is_verified: boolean
  }
}

export function ListingsBrowser() {
  const { user } = useAuth()
  const [listings, setListings] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showCreateForm, setShowCreateForm] = useState(false)
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All Categories')
  const [selectedType, setSelectedType] = useState('all')
  const [selectedExchange, setSelectedExchange] = useState('all')
  const [sortBy, setSortBy] = useState('newest')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  useEffect(() => {
    fetchListings()
  }, [selectedCategory, selectedType, selectedExchange, sortBy])

  const fetchListings = async () => {
    setLoading(true)
    setError('')

    try {
      let query = supabase
        .from('qn_service_listings')
        .select(`
          *,
          poster:qn_users!poster_user_id (
            first_name,
            last_name,
            is_verified
          )
        `)
        .eq('status', 'Available')

      // Apply filters
      if (selectedCategory !== 'All Categories') {
        query = query.eq('category', selectedCategory)
      }

      if (selectedType !== 'all') {
        query = query.eq('type', selectedType)
      }

      if (selectedExchange !== 'all') {
        query = query.eq('exchange_mechanism', selectedExchange)
      }

      // Apply sorting
      switch (sortBy) {
        case 'newest':
          query = query.order('created_at', { ascending: false })
          break
        case 'oldest':
          query = query.order('created_at', { ascending: true })
          break
        case 'title':
          query = query.order('title', { ascending: true })
          break
        case 'category':
          query = query.order('category', { ascending: true })
          break
        case 'location':
          query = query.order('location', { ascending: true })
          break
      }

      const { data, error } = await query

      if (error) {
        setError(error.message)
      } else {
        setListings(data || [])
      }
    } catch (err) {
      setError('Failed to load listings')
    }

    setLoading(false)
  }

  const filteredListings = listings.filter(listing => {
    if (!searchTerm) return true
    
    const searchLower = searchTerm.toLowerCase()
    return (
      listing.title.toLowerCase().includes(searchLower) ||
      listing.description.toLowerCase().includes(searchLower) ||
      listing.category.toLowerCase().includes(searchLower) ||
      listing.location.toLowerCase().includes(searchLower)
    )
  })

  const handleMessage = (listingId: string, posterId: string) => {
    // TODO: Implement messaging functionality
    console.log('Start conversation:', { listingId, posterId })
    alert('Messaging feature coming soon!')
  }

  const handleReport = (listingId: string) => {
    // TODO: Implement reporting functionality
    console.log('Report listing:', listingId)
    alert('Reporting feature coming soon!')
  }

  if (showCreateForm) {
    return (
      <div className="max-w-2xl mx-auto">
        <CreateListing
          onSuccess={() => {
            setShowCreateForm(false)
            fetchListings()
          }}
          onCancel={() => setShowCreateForm(false)}
        />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Community Listings</h1>
          <p className="text-gray-600">Discover what your neighbors are offering and requesting</p>
        </div>
        <Button onClick={() => setShowCreateForm(true)} className="flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>Create Listing</span>
        </Button>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search listings..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Filter Tabs */}
            <Tabs value={selectedType} onValueChange={setSelectedType}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="Offer">Offers</TabsTrigger>
                <TabsTrigger value="Request">Requests</TabsTrigger>
              </TabsList>
            </Tabs>

            {/* Advanced Filters */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {LISTING_CATEGORIES.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedExchange} onValueChange={setSelectedExchange}>
                <SelectTrigger>
                  <SelectValue placeholder="Exchange Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Exchange Types</SelectItem>
                  <SelectItem value="Free">Free</SelectItem>
                  <SelectItem value="Barter">Barter/Trade</SelectItem>
                  <SelectItem value="TimeBank Credits">Time Bank Credits</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  {SORT_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="flex items-center space-x-2">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-600">
            {filteredListings.length} listing{filteredListings.length !== 1 ? 's' : ''} found
          </span>
          {(selectedCategory !== 'All Categories' || selectedType !== 'all' || selectedExchange !== 'all' || searchTerm) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSearchTerm('')
                setSelectedCategory('All Categories')
                setSelectedType('all')
                setSelectedExchange('all')
              }}
            >
              Clear filters
            </Button>
          )}
        </div>
      </div>

      {/* Listings Grid/List */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : error ? (
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-red-600">{error}</p>
            <Button onClick={fetchListings} className="mt-4">
              Try Again
            </Button>
          </CardContent>
        </Card>
      ) : filteredListings.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No listings found</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || selectedCategory !== 'All Categories' || selectedType !== 'all' || selectedExchange !== 'all'
                ? 'Try adjusting your search or filters'
                : 'Be the first to create a listing in your community!'
              }
            </p>
            <Button onClick={() => setShowCreateForm(true)}>
              Create First Listing
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className={
          viewMode === 'grid' 
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
            : 'space-y-4'
        }>
          {filteredListings.map((listing) => (
            <ListingCard
              key={listing.listing_id}
              listing={listing}
              poster={listing.poster}
              currentUserId={user?.id}
              onMessage={handleMessage}
              onReport={handleReport}
            />
          ))}
        </div>
      )}
    </div>
  )
}