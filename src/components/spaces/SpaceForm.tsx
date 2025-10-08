import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Upload, X, Plus } from 'lucide-react'
import { spaceSchema } from '../../utils/validation'
import { SpaceFormData } from '../../types'

interface SpaceFormProps {
  onSubmit: (data: SpaceFormData) => void
  onCancel: () => void
  initialData?: any
  isEditing?: boolean
}

const AMENITIES = [
  'Wi-Fi',
  'Estacionamento',
  'Cozinha',
  'Som',
  'Ar Condicionado',
  'TV',
  'Café',
  'Mobiliado',
  'Piscina',
  'Churrasqueira',
  'Acessibilidade',
  'Banheiros'
]

const SpaceForm: React.FC<SpaceFormProps> = ({
  onSubmit,
  onCancel,
  initialData,
  isEditing = false
}) => {
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>(
    initialData?.amenities || []
  )
  const [imagePreviews, setImagePreviews] = useState<string[]>(
    initialData?.images || []
  )
  const [newImages, setNewImages] = useState<File[]>([])

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch
  } = useForm<SpaceFormData>({
    resolver: zodResolver(spaceSchema),
    defaultValues: initialData || {
      price: 0,
      capacity: 0,
      amenities: []
    }
  })

  const handleAmenityToggle = (amenity: string) => {
    const newAmenities = selectedAmenities.includes(amenity)
      ? selectedAmenities.filter(a => a !== amenity)
      : [...selectedAmenities, amenity]
    
    setSelectedAmenities(newAmenities)
    setValue('amenities', newAmenities, { shouldValidate: true })
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    
    // Create previews
    files.forEach(file => {
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreviews(prev => [...prev, e.target?.result as string])
      }
      reader.readAsDataURL(file)
    })

    setNewImages(prev => [...prev, ...files])
  }

  const handleRemoveImage = (index: number) => {
    setImagePreviews(prev => prev.filter((_, i) => i !== index))
    
    if (index < (initialData?.images?.length || 0)) {
      // This is an existing image - we'll handle it in the form data
      const updatedExisting = (initialData.images || []).filter((_: any, i: number) => i !== index)
      setValue('images', updatedExisting)
    } else {
      // This is a new image
      const newIndex = index - (initialData?.images?.length || 0)
      setNewImages(prev => prev.filter((_, i) => i !== newIndex))
    }
  }

  const handleFormSubmit = (data: SpaceFormData) => {
    onSubmit({
      ...data,
      images: newImages,
      amenities: selectedAmenities
    })
  }

  return (
    <div className="max-w-4xl mx-auto">
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-8">
        {/* Basic Information */}
        <div className="card p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Informações Básicas
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Título do Espaço *
              </label>
              <input
                {...register('title')}
                type="text"
                className="input"
                placeholder="Ex: Salão de Festas Espaço Premium"
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                Preço por Diária (R$) *
              </label>
              <input
                {...register('price', { valueAsNumber: true })}
                type="number"
                step="0.01"
                className="input"
                placeholder="0,00"
              />
              {errors.price && (
                <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="capacity" className="block text-sm font-medium text-gray-700 mb-2">
                Capacidade (pessoas) *
              </label>
              <input
                {...register('capacity', { valueAsNumber: true })}
                type="number"
                className="input"
                placeholder="50"
              />
              {errors.capacity && (
                <p className="mt-1 text-sm text-red-600">{errors.capacity.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Location */}
        <div className="card p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Localização</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                Endereço Completo *
              </label>
              <input
                {...register('address')}
                type="text"
                className="input"
                placeholder="Rua, número, bairro..."
              />
              {errors.address && (
                <p className="mt-1 text-sm text-red-600">{errors.address.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
                Cidade *
              </label>
              <input
                {...register('city')}
                type="text"
                className="input"
                placeholder="São Paulo"
              />
              {errors.city && (
                <p className="mt-1 text-sm text-red-600">{errors.city.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-2">
                Estado (UF) *
              </label>
              <input
                {...register('state')}
                type="text"
                maxLength={2}
                className="input uppercase"
                placeholder="SP"
              />
              {errors.state && (
                <p className="mt-1 text-sm text-red-600">{errors.state.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="card p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Descrição</h2>
          
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Descrição Detalhada *
            </label>
            <textarea
              {...register('description')}
              rows={6}
              className="textarea"
              placeholder="Descreva seu espaço, comodidades, regras, e tudo que os clientes precisam saber..."
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
            )}
          </div>
        </div>

        {/* Amenities */}
        <div className="card p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Comodidades</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {AMENITIES.map((amenity) => (
              <label key={amenity} className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedAmenities.includes(amenity)}
                  onChange={() => handleAmenityToggle(amenity)}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-sm text-gray-700">{amenity}</span>
              </label>
            ))}
          </div>
          {errors.amenities && (
            <p className="mt-2 text-sm text-red-600">{errors.amenities.message}</p>
          )}
        </div>

        {/* Images */}
        <div className="card p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Fotos do Espaço</h2>
          
          {/* Image Upload */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center mb-6">
            <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-lg font-medium text-gray-900 mb-2">
              Arraste e solte suas fotos aqui
            </p>
            <p className="text-gray-600 mb-4">
              ou clique para selecionar do computador
            </p>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              id="image-upload"
            />
            <label
              htmlFor="image-upload"
              className="btn-secondary cursor-pointer inline-flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Selecionar Fotos</span>
            </label>
          </div>

          {/* Image Previews */}
          {imagePreviews.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {imagePreviews.map((preview, index) => (
                <div key={index} className="relative group">
                  <img
                    src={preview}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-24 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Form Actions */}
        <div className="flex space-x-4 justify-end pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={onCancel}
            className="btn-secondary"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary"
          >
            {isSubmitting ? 'Salvando...' : isEditing ? 'Atualizar Espaço' : 'Criar Espaço'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default SpaceForm