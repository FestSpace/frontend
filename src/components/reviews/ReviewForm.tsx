import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Star } from 'lucide-react'
import { reviewSchema } from '../../utils/validation'

interface ReviewFormProps {
  onSubmit: (data: { rating: number; comment: string }) => void
  onCancel: () => void
}

interface ReviewFormData {
  rating: number
  comment: string
}

const ReviewForm: React.FC<ReviewFormProps> = ({ onSubmit, onCancel }) => {
  const [hoverRating, setHoverRating] = useState(0)
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting }
  } = useForm<ReviewFormData>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      rating: 0,
      comment: ''
    }
  })

  const currentRating = watch('rating')

  const handleRatingClick = (rating: number) => {
    setValue('rating', rating, { shouldValidate: true })
  }

  const handleFormSubmit = (data: ReviewFormData) => {
    onSubmit(data)
  }

  return (
    <div className="card p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Escrever Avaliação</h3>
      
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        {/* Rating */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Sua Avaliação *
          </label>
          <div className="flex space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => handleRatingClick(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                className="p-1 transition-transform hover:scale-110"
              >
                <Star
                  className={`h-8 w-8 ${
                    star <= (hoverRating || currentRating)
                      ? 'text-yellow-400 fill-current'
                      : 'text-gray-300'
                  }`}
                />
              </button>
            ))}
          </div>
          {errors.rating && (
            <p className="mt-1 text-sm text-red-600">{errors.rating.message}</p>
          )}
        </div>

        {/* Comment */}
        <div>
          <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
            Comentário (opcional)
          </label>
          <textarea
            {...register('comment')}
            rows={4}
            className="textarea"
            placeholder="Compartilhe sua experiência com este espaço..."
          />
          {errors.comment && (
            <p className="mt-1 text-sm text-red-600">{errors.comment.message}</p>
          )}
        </div>

        {/* Actions */}
        <div className="flex space-x-3 pt-2">
          <button
            type="submit"
            disabled={isSubmitting || currentRating === 0}
            className="btn-primary flex-1"
          >
            {isSubmitting ? 'Enviando...' : 'Enviar Avaliação'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="btn-secondary flex-1"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  )
}

export default ReviewForm