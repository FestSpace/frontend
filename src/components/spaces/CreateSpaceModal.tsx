import React, { useState } from 'react'
import { X, Upload, MapPin, DollarSign, Users, Home, Wifi, Car, Utensils, Music, Snowflake, Tv, Coffee, Plus, Trash2 } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { spacesAPI } from '../../services/api'
import { useAuth } from '../../contexts/AuthContext'
import toast from 'react-hot-toast'

interface CreateSpaceModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

interface SpaceFormData {
  title: string
  description: string
  address: string
  city: string
  state: string
  price: number
  capacity: number
  amenities: string[]
}

const AMENITIES = [
  { id: 'wifi', label: 'Wi-Fi', icon: Wifi },
  { id: 'parking', label: 'Estacionamento', icon: Car },
  { id: 'kitchen', label: 'Cozinha', icon: Utensils },
  { id: 'sound', label: 'Sistema de Som', icon: Music },
  { id: 'ac', label: 'Ar Condicionado', icon: Snowflake },
  { id: 'tv', label: 'TV', icon: Tv },
  { id: 'coffee', label: 'Máquina de Café', icon: Coffee },
  { id: 'furnished', label: 'Mobiliado', icon: Home },
]

const CreateSpaceModal: React.FC<CreateSpaceModalProps> = ({ 
  isOpen, 
  onClose, 
  onSuccess 
}) => {
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([])
  const [images, setImages] = useState<File[]>([])
  const [imagePreviews, setImagePreviews] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { user } = useAuth()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch
  } = useForm<SpaceFormData>()

  // Reset form quando modal abrir/fechar
  React.useEffect(() => {
    if (!isOpen) {
      reset()
      setSelectedAmenities([])
      setImages([])
      setImagePreviews([])
    }
  }, [isOpen, reset])

  const handleAmenityToggle = (amenityId: string) => {
    setSelectedAmenities(prev =>
      prev.includes(amenityId)
        ? prev.filter(a => a !== amenityId)
        : [...prev, amenityId]
    )
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    
    // Verificar limite do plano
    const planLimits = {
      basic: 5,
      medium: 10,
      premium: 20
    }
    
    const maxImages = planLimits[user?.subscription?.plan || 'basic']
    const totalImages = images.length + files.length
    
    if (totalImages > maxImages) {
      toast.error(`Seu plano ${user?.subscription?.plan} permite no máximo ${maxImages} imagens`)
      return
    }

    // Criar previews
    files.forEach(file => {
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreviews(prev => [...prev, e.target?.result as string])
      }
      reader.readAsDataURL(file)
    })

    setImages(prev => [...prev, ...files])
  }

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index))
    setImagePreviews(prev => prev.filter((_, i) => i !== index))
  }

  const onSubmit = async (data: SpaceFormData) => {
    if (!user) {
      toast.error('Você precisa estar logado')
      return
    }

    // Verificar se usuário tem assinatura ativa
    if (!user.subscription || user.subscription.status !== 'active') {
      toast.error('Você precisa de uma assinatura ativa para criar espaços')
      return
    }

    try {
      setIsSubmitting(true)

      const formData = new FormData()
      formData.append('title', data.title)
      formData.append('description', data.description)
      formData.append('address', data.address)
      formData.append('city', data.city)
      formData.append('state', data.state.toUpperCase())
      formData.append('price', data.price.toString())
      formData.append('capacity', data.capacity.toString())
      formData.append('amenities', JSON.stringify(selectedAmenities))

      // Adicionar imagens
      images.forEach(image => {
        formData.append('images', image)
      })

      await spacesAPI.create(formData)
      
      toast.success('Espaço criado com sucesso!')
      onSuccess()
      onClose()
      
    } catch (error: any) {
      console.error('Erro ao criar espaço:', error)
      toast.error(error.response?.data?.message || 'Erro ao criar espaço')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div 
        className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Criar Novo Espaço</h2>
            <p className="text-gray-600 mt-1">
              Preencha as informações do seu espaço para festas
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-6 w-6 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <div className="flex-1 overflow-y-auto">
          <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
            {/* Informações Básicas */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Home className="h-5 w-5 mr-2 text-blue-600" />
                Informações Básicas
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Título do Espaço *
                  </label>
                  <input
                    {...register('title', { 
                      required: 'Título é obrigatório',
                      minLength: { value: 5, message: 'Mínimo 5 caracteres' }
                    })}
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Ex: Salão de Festas Espaço Premium"
                  />
                  {errors.title && (
                    <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preço por Diária (R$) *
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      {...register('price', { 
                        required: 'Preço é obrigatório',
                        min: { value: 1, message: 'Preço deve ser maior que 0' }
                      })}
                      type="number"
                      step="0.01"
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="0,00"
                    />
                  </div>
                  {errors.price && (
                    <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Capacidade (pessoas) *
                  </label>
                  <div className="relative">
                    <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      {...register('capacity', { 
                        required: 'Capacidade é obrigatória',
                        min: { value: 1, message: 'Capacidade deve ser maior que 0' }
                      })}
                      type="number"
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="50"
                    />
                  </div>
                  {errors.capacity && (
                    <p className="mt-1 text-sm text-red-600">{errors.capacity.message}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descrição *
                </label>
                <textarea
                  {...register('description', { 
                    required: 'Descrição é obrigatória',
                    minLength: { value: 20, message: 'Mínimo 20 caracteres' }
                  })}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
                  placeholder="Descreva seu espaço, comodidades, regras, e tudo que os clientes precisam saber..."
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
                )}
              </div>
            </div>

            {/* Localização */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <MapPin className="h-5 w-5 mr-2 text-green-600" />
                Localização
              </h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Endereço Completo *
                </label>
                <input
                  {...register('address', { 
                    required: 'Endereço é obrigatório',
                    minLength: { value: 10, message: 'Endereço muito curto' }
                  })}
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Rua, número, bairro, complemento..."
                />
                {errors.address && (
                  <p className="mt-1 text-sm text-red-600">{errors.address.message}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cidade *
                  </label>
                  <input
                    {...register('city', { required: 'Cidade é obrigatória' })}
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="São Paulo"
                  />
                  {errors.city && (
                    <p className="mt-1 text-sm text-red-600">{errors.city.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Estado (UF) *
                  </label>
                  <input
                    {...register('state', { 
                      required: 'Estado é obrigatório',
                      pattern: {
                        value: /^[A-Z]{2}$/,
                        message: 'Use 2 letras (ex: SP)'
                      }
                    })}
                    type="text"
                    maxLength={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent uppercase"
                    placeholder="SP"
                  />
                  {errors.state && (
                    <p className="mt-1 text-sm text-red-600">{errors.state.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Comodidades */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Comodidades
              </h3>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {AMENITIES.map((amenity) => {
                  const Icon = amenity.icon
                  const isSelected = selectedAmenities.includes(amenity.id)
                  
                  return (
                    <button
                      key={amenity.id}
                      type="button"
                      onClick={() => handleAmenityToggle(amenity.id)}
                      className={`p-3 border-2 rounded-lg text-left transition-all ${
                        isSelected
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <Icon className="h-4 w-4" />
                        <span className="text-sm font-medium">{amenity.label}</span>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Fotos */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Fotos do Espaço
              </h3>

              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-lg font-medium text-gray-900 mb-2">
                  Adicione fotos do seu espaço
                </p>
                <p className="text-gray-600 mb-4">
                  Arraste e solte ou clique para selecionar
                </p>
                
                <div className="space-y-2">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="space-images"
                  />
                  <label
                    htmlFor="space-images"
                    className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg cursor-pointer transition-colors"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Selecionar Fotos
                  </label>
                  <p className="text-sm text-gray-500">
                    Máximo {user?.subscription?.plan === 'basic' ? 5 : 
                           user?.subscription?.plan === 'medium' ? 10 : 20} fotos
                  </p>
                </div>
              </div>

              {/* Preview das Imagens */}
              {imagePreviews.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex space-x-3 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-900 font-medium py-3 px-4 rounded-lg transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-3 px-4 rounded-lg transition-colors"
              >
                {isSubmitting ? 'Criando Espaço...' : 'Criar Espaço'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default CreateSpaceModal