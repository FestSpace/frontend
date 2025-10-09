import React from 'react'
import { Link } from 'react-router-dom'
import { MapPin, Star, Users, Crown, Sparkles } from 'lucide-react'
import { Space } from '../../types'

interface SpaceCardProps {
  space: Space
  featured?: boolean
}

const SpaceCard: React.FC<SpaceCardProps> = ({ space, featured = false }) => {
  if (!space || typeof space !== 'object') {
    return null
  }
  
  const isPremium = space.user.subscription?.plan === 'premium'

  const getPlanBadge = (plan?: string) => {
    switch (plan) {
      case 'premium':
        return { label: 'Premium', color: 'bg-yellow-100 text-yellow-800', icon: Crown }
      case 'medium':
        return { label: 'Medium', color: 'bg-purple-100 text-purple-800', icon: Sparkles }
      default:
        return null
    }
  }

  const planBadge = getPlanBadge(space.user.subscription?.plan)

  return (
    <Link 
      to={`/space/${space.id}`} 
      className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200 block h-full"
    >
      <div className="relative">
        { space.images && space.images.length > 0 ? (
          <img
            src={space.images[0]}
            alt={space.title}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <img
            src={space.images[0] || '/placeholder-space.jpg'}
            alt={space.title}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
        )}
        
        {/* Rating */}
        <div className="absolute top-3 right-3 bg-white rounded-full px-2 py-1 flex items-center space-x-1 shadow-lg">
          <Star className="h-3 w-3 text-yellow-400 fill-current" />
          <span className="text-sm font-medium text-gray-900">
            {space.rating.toFixed(1)}
          </span>
        </div>

        {/* Plan Badge */}
        {planBadge && (
          <div className="absolute top-3 left-3">
            <span className={`badge flex items-center space-x-1 text-xs ${planBadge.color}`}>
              <planBadge.icon className="h-3 w-3" />
              <span>{planBadge.label}</span>
            </span>
          </div>
        )}

        {/* Featured Badge */}
        {featured && (
          <div className="absolute bottom-3 left-3">
            <span className="badge bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs">
              <Sparkles className="h-3 w-3 mr-1" />
              Destaque
            </span>
          </div>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
          {space.title}
        </h3>
        
        <div className="flex items-center text-gray-600 text-sm mb-2">
          <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
          <span className="truncate">{space.city}, {space.state}</span>
        </div>
        
        <div className="flex items-center text-gray-600 text-sm mb-3">
          <Users className="h-4 w-4 mr-1 flex-shrink-0" />
          <span>Até {space.capacity} pessoas</span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-primary-600">
            R$ {space.price.toLocaleString('pt-BR')}
            <span className="text-sm font-normal text-gray-600">/diária</span>
          </span>
          
          {space.reviewCount > 0 && (
            <span className="text-sm text-gray-500">
              {space.reviewCount} avaliação{space.reviewCount !== 1 ? 'es' : ''}
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}

export default SpaceCard