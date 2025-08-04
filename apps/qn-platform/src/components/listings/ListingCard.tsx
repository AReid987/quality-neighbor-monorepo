'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { 
  MapPin, 
  Clock, 
  User, 
  MessageSquare, 
  Heart,
  MoreVertical,
  Flag,
  Share2
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface ListingCardProps {
  listing: {
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
  }
  poster?: {
    first_name: string
    last_name: string
    is_verified: boolean
  }
  currentUserId?: string
  onMessage?: (listingId: string, posterId: string) => void
  onEdit?: (listingId: string) => void
  onDelete?: (listingId: string) => void
  onReport?: (listingId: string) => void
}

export function ListingCard({ 
  listing, 
  poster, 
  currentUserId,
  onMessage,
  onEdit,
  onDelete,
  onReport 
}: ListingCardProps) {
  const [liked, setLiked] = useState(false)
  const isOwnListing = currentUserId === listing.poster_user_id

  const getExchangeColor = (mechanism: string) => {
    switch (mechanism) {
      case 'Free': return 'bg-green-100 text-green-800'
      case 'Barter': return 'bg-blue-100 text-blue-800'
      case 'TimeBank Credits': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getTypeColor = (type: string) => {
    return type === 'Offer' 
      ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
      : 'bg-orange-100 text-orange-800 border-orange-200'
  }

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'Just now'
    if (diffInHours < 24) return `${diffInHours}h ago`
    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 7) return `${diffInDays}d ago`
    return date.toLocaleDateString()
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: listing.title,
          text: listing.description,
          url: window.location.href
        })
      } catch (err) {
        // Fallback to clipboard
        navigator.clipboard.writeText(window.location.href)
      }
    } else {
      // Fallback to clipboard
      navigator.clipboard.writeText(window.location.href)
    }
  }

  return (
    <Card className="hover:shadow-md transition-shadow duration-200">
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-blue-100 text-blue-600">
                {poster ? `${poster.first_name[0]}${poster.last_name[0]}` : <User className="h-5 w-5" />}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-medium text-gray-900">
                  {poster ? `${poster.first_name} ${poster.last_name[0]}.` : 'Anonymous'}
                </span>
                {poster?.is_verified && (
                  <Badge variant="secondary" className="text-xs">
                    Verified
                  </Badge>
                )}
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <Clock className="h-3 w-3" />
                <span>{formatTimeAgo(listing.created_at)}</span>
                <span>•</span>
                <MapPin className="h-3 w-3" />
                <span>{listing.location}</span>
              </div>
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleShare}>
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </DropdownMenuItem>
              {isOwnListing ? (
                <>
                  {onEdit && (
                    <DropdownMenuItem onClick={() => onEdit(listing.listing_id)}>
                      Edit Listing
                    </DropdownMenuItem>
                  )}
                  {onDelete && (
                    <DropdownMenuItem 
                      onClick={() => onDelete(listing.listing_id)}
                      className="text-red-600"
                    >
                      Delete Listing
                    </DropdownMenuItem>
                  )}
                </>
              ) : (
                onReport && (
                  <DropdownMenuItem 
                    onClick={() => onReport(listing.listing_id)}
                    className="text-red-600"
                  >
                    <Flag className="h-4 w-4 mr-2" />
                    Report
                  </DropdownMenuItem>
                )
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Badges */}
        <div className="flex items-center space-x-2 mb-3">
          <Badge className={getTypeColor(listing.type)}>
            {listing.type}
          </Badge>
          <Badge variant="outline">
            {listing.category}
          </Badge>
          <Badge className={getExchangeColor(listing.exchange_mechanism)}>
            {listing.exchange_mechanism}
          </Badge>
          {listing.status !== 'Available' && (
            <Badge variant="secondary">
              {listing.status}
            </Badge>
          )}
        </div>

        {/* Content */}
        <div className="mb-4">
          <h3 className="font-semibold text-lg text-gray-900 mb-2">
            {listing.title}
          </h3>
          <p className="text-gray-600 text-sm leading-relaxed">
            {listing.description}
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLiked(!liked)}
              className={liked ? 'text-red-500' : 'text-gray-500'}
            >
              <Heart className={`h-4 w-4 mr-1 ${liked ? 'fill-current' : ''}`} />
              {liked ? 'Liked' : 'Like'}
            </Button>
          </div>

          {!isOwnListing && listing.status === 'Available' && onMessage && (
            <Button
              size="sm"
              onClick={() => onMessage(listing.listing_id, listing.poster_user_id)}
              className="flex items-center space-x-1"
            >
              <MessageSquare className="h-4 w-4" />
              <span>Message</span>
            </Button>
          )}

          {isOwnListing && (
            <div className="text-sm text-gray-500">
              Your {listing.type.toLowerCase()}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}