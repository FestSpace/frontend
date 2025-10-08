import React from 'react'
import { Star } from 'lucide-react'
import { Review } from '../../types'

interface ReviewListProps {
  reviews: Review[]
}

const ReviewList: React.FC<ReviewListProps> = ({ reviews }) => {
  return (
    <div className="space-y-6">
      {reviews.map((review) => (
        <div key={review.id} className="border-b border-gray-200 pb-6 last:border-0">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                <span className="text-primary-600 font-medium text-sm">
                  {review.user.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <div className="font-medium text-gray-900">{review.user.name}</div>
                <div className="text-sm text-gray-500">
                  {new Date(review.createdAt).toLocaleDateString('pt-BR')}
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-1">
              <Star className="h-4 w-4 text-yellow-400 fill-current" />
              <span className="text-sm font-medium text-gray-900">{review.rating}.0</span>
            </div>
          </div>
          
          {review.comment && (
            <p className="text-gray-700 leading-relaxed">{review.comment}</p>
          )}
        </div>
      ))}
    </div>
  )
}

export default ReviewList