import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { 
  MapPin, 
  Star, 
  Users, 
  ArrowLeft, 
  Share2, 
  Heart, 
  Check, 
  Wifi, 
  Car, 
  Utensils,
  Music,
  Snowflake,
  Tv,
  Coffee,
  Home,
  Calendar,
  MessageCircle,
  Phone,
  Mail
} from 'lucide-react'
import { spacesAPI, reviewsAPI } from '../services/api'
import { Space, Review } from '../types'
import { useAuth } from '../contexts/AuthContext'
import { LoadingSpinner } from '../components/ui/LoadingSpinner'
import ReviewForm from '../components/reviews/ReviewForm'
import ReviewList from '../components/reviews/ReviewList'
import toast from 'react-hot-toast'

const SpaceDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const [space, setSpace] = useState<Space | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeImageIndex, setActiveImageIndex] = useState(0)
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [imageLoading, setImageLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    if (id) {
      loadSpace()
    }
  }, [id])

  const loadSpace = async () => {
    try {
      setLoading(true)
      const response = await spacesAPI.getById(id!)
      setSpace(response.data)
    } catch (error) {
      toast.error('Erro ao carregar detalhes do espaço')
      console.error('Error loading space:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleReviewSubmit = async (reviewData: { rating: number; comment: string }) => {
    try {
      await reviewsAPI.create(id!, reviewData)
      toast.success('Avaliação enviada com sucesso!')
      setShowReviewForm(false)
      loadSpace() // Reload space to update reviews and rating
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Erro ao enviar avaliação')
    }
  }

  const getAmenityIcon = (amenity: string) => {
    const icons: { [key: string]: React.ReactNode } = {
      'Wi-Fi': <Wifi className="h-5 w-5" />,
      'Estacionamento': <Car className="h-5 w-5" />,
      'Cozinha': <Utensils className="h-5 w-5" />,
      'Som': <Music className="h-5 w-5" />,
      'Ar Condicionado': <Snowflake className="h-5 w-5" />,
      'TV': <Tv className="h-5 w-5" />,
      'Café': <Coffee className="h-5 w-5" />,
      'Mobiliado': <Home className="h-5 w-5" />,
      'Piscina': '🏊',
      'Churrasqueira': '🔥',
      'Acessibilidade': '♿',
      'Banheiros': '🚻'
    }
    return icons[amenity] || <Check className="h-5 w-5" />
  }

  const generateWhatsAppMessage = () => {
    if (!space) return ''
    
    const message = `Olá! Tenho interesse no espaço "${space.title}" no FestSpace.\n\n` +
                   `Valor: R$ ${space.price}/diária\n` +
                   `Localização: ${space.city}, ${space.state}\n` +
                   `Capacidade: ${space.capacity} pessoas\n\n` +
                   `Poderia me fornecer mais informações?`
    
    return encodeURIComponent(message)
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: space?.title,
          text: space?.description?.substring(0, 100) + '...',
          url: window.location.href,
        })
        toast.success('Compartilhado com sucesso!')
      } catch (error) {
        // User canceled share
      }
    } else {
      navigator.clipboard.writeText(window.location.href)
      toast.success('Link copiado para a área de transferência!')
    }
  }

  const handleImageLoad = () => {
    setImageLoading(false)
  }

  const handleImageError = () => {
    setImageLoading(false)
    // You could set a placeholder image here
  }

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-6">
            {/* Navigation Skeleton */}
            <div className="flex items-center justify-between">
              <div className="skeleton h-6 w-32"></div>
              <div className="skeleton h-6 w-24"></div>
            </div>

            {/* Main Content Skeleton */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                {/* Image Gallery Skeleton */}
                <div className="skeleton h-96 rounded-lg"></div>
                <div className="grid grid-cols-4 gap-2">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="skeleton h-20 rounded"></div>
                  ))}
                </div>

                {/* Details Skeleton */}
                <div className="skeleton h-32 rounded-lg"></div>
                <div className="skeleton h-48 rounded-lg"></div>
                <div className="skeleton h-64 rounded-lg"></div>
              </div>

              {/* Sidebar Skeleton */}
              <div className="space-y-6">
                <div className="skeleton h-64 rounded-lg"></div>
                <div className="skeleton h-32 rounded-lg"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Error State - Space not found
  if (!space) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12">
        <div className="text-center max-w-md mx-auto px-4">
          <MapPin className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Espaço não encontrado</h2>
          <p className="text-gray-600 mb-6">
            O espaço que você está procurando não existe ou pode ter sido removido.
          </p>
          <div className="space-y-3">
            <Link to="/" className="btn-primary w-full block">
              Voltar para a página inicial
            </Link>
            <Link to="/" className="btn-ghost w-full block">
              Explorar outros espaços
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const whatsappNumber = space.user.phone || '5511999999999'
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${generateWhatsAppMessage()}`
  const emailUrl = `mailto:${space.user.email}?subject=Interesse no espaço: ${space.title}&body=${generateWhatsAppMessage()}`

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link 
              to="/" 
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors font-medium"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Voltar para busca</span>
            </Link>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={handleShare}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors p-2 rounded-lg hover:bg-gray-100"
                title="Compartilhar"
              >
                <Share2 className="h-4 w-4" />
                <span className="hidden sm:inline">Compartilhar</span>
              </button>
              
              <button 
                className="flex items-center space-x-2 text-gray-600 hover:text-red-600 transition-colors p-2 rounded-lg hover:bg-gray-100"
                title="Adicionar aos favoritos"
              >
                <Heart className="h-4 w-4" />
                <span className="hidden sm:inline">Favoritar</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Image Gallery */}
            <section className="space-y-4">
              <div className="relative rounded-xl overflow-hidden bg-gray-100">
                {imageLoading && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <LoadingSpinner size="lg" />
                  </div>
                )}
                <img
                  src={space.images[activeImageIndex]}
                  alt={space.title}
                  className={`w-full h-96 object-cover transition-opacity duration-300 ${
                    imageLoading ? 'opacity-0' : 'opacity-100'
                  }`}
                  onLoad={handleImageLoad}
                  onError={handleImageError}
                />
              </div>
              
              {space.images.length > 1 && (
                <div className="grid grid-cols-4 gap-3">
                  {space.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setActiveImageIndex(index)
                        setImageLoading(true)
                      }}
                      className={`relative rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                        index === activeImageIndex 
                          ? 'border-primary-600 ring-2 ring-primary-600 ring-opacity-50' 
                          : 'border-transparent hover:border-gray-300'
                      }`}
                    >
                      <img
                        src={image}
                        alt={`${space.title} ${index + 1}`}
                        className="w-full h-20 object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </section>

            {/* Space Details */}
            <section className="card p-6">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-gray-900 mb-3">{space.title}</h1>
                  <div className="flex flex-wrap items-center gap-4 text-gray-600">
                    <div className="flex items-center space-x-1">
                      <MapPin className="h-4 w-4" />
                      <span>{space.address}, {space.city} - {space.state}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Users className="h-4 w-4" />
                      <span>Até {space.capacity} pessoas</span>
                    </div>
                    {space.rating > 0 && (
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span>
                          {space.rating.toFixed(1)} ({space.reviewCount} avaliaç{space.reviewCount !== 1 ? 'ões' : 'ão'})
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-3xl font-bold text-primary-600">
                    R$ {space.price.toLocaleString('pt-BR')}
                  </div>
                  <div className="text-gray-600">por diária</div>
                </div>
              </div>

              <div className="prose max-w-none">
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {space.description}
                </p>
              </div>
            </section>

            {/* Amenities */}
            {space.amenities && space.amenities.length > 0 && (
              <section className="card p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Comodidades</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {space.amenities.map((amenity, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50">
                      <div className="text-primary-600 flex-shrink-0">
                        {getAmenityIcon(amenity)}
                      </div>
                      <span className="text-gray-700 font-medium">{amenity}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Reviews Section */}
            <section className="card p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  Avaliações e Comentários
                  {space.reviewCount > 0 && (
                    <span className="text-lg font-normal text-gray-600 ml-2">
                      ({space.reviewCount})
                    </span>
                  )}
                </h2>
                
                {user && user.id !== space.userId && (
                  <button
                    onClick={() => setShowReviewForm(!showReviewForm)}
                    className="btn-primary whitespace-nowrap"
                  >
                    {showReviewForm ? 'Cancelar Avaliação' : 'Escrever Avaliação'}
                  </button>
                )}
              </div>

              {/* Review Form */}
              {showReviewForm && (
                <div className="mb-8">
                  <ReviewForm 
                    onSubmit={handleReviewSubmit}
                    onCancel={() => setShowReviewForm(false)}
                  />
                </div>
              )}

              {/* Reviews List */}
              {space.reviews && space.reviews.length > 0 ? (
                <ReviewList reviews={space.reviews} />
              ) : (
                <div className="text-center py-12">
                  <Star className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Nenhuma avaliação ainda
                  </h3>
                  <p className="text-gray-600 max-w-md mx-auto">
                    Este espaço ainda não recebeu avaliações. Seja o primeiro a compartilhar sua experiência!
                  </p>
                  {!user && (
                    <p className="text-sm text-gray-500 mt-2">
                      <Link to="/login" className="text-primary-600 hover:text-primary-700">
                        Faça login
                      </Link> para deixar uma avaliação
                    </p>
                  )}
                </div>
              )}
            </section>
          </div>

          {/* Sidebar Column */}
          <div className="space-y-6">
            {/* Contact Card */}
            <div className="card p-6 sticky top-24">
              <div className="text-center mb-6">
                <div className="text-3xl font-bold text-primary-600 mb-2">
                  R$ {space.price.toLocaleString('pt-BR')}
                </div>
                <div className="text-gray-600">por diária</div>
                {space.rating > 0 && (
                  <div className="flex items-center justify-center space-x-1 mt-2">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="text-sm text-gray-600">
                      {space.rating.toFixed(1)} ({space.reviewCount} avaliaç{space.reviewCount !== 1 ? 'ões' : 'ão'})
                    </span>
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
                >
                  <MessageCircle className="h-5 w-5" />
                  <span>Contatar via WhatsApp</span>
                </a>

                <a
                  href={emailUrl}
                  className="w-full btn-secondary flex items-center justify-center space-x-2 py-3"
                >
                  <Mail className="h-5 w-5" />
                  <span>Enviar Email</span>
                </a>

                {space.user.phone && (
                  <a
                    href={`tel:${space.user.phone}`}
                    className="w-full btn-ghost flex items-center justify-center space-x-2 py-3"
                  >
                    <Phone className="h-5 w-5" />
                    <span>Ligar</span>
                  </a>
                )}

                <button className="w-full btn-ghost flex items-center justify-center space-x-2 py-3 border border-gray-300">
                  <Calendar className="h-5 w-5" />
                  <span>Ver Disponibilidade</span>
                </button>

                <button className="w-full btn-ghost flex items-center justify-center space-x-2 py-3 text-red-600 hover:text-red-700 hover:bg-red-50">
                  <Heart className="h-5 w-5" />
                  <span>Adicionar aos Favoritos</span>
                </button>
              </div>

              {/* Host Information */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-4">Anfitrião</h3>
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-primary-600 font-semibold text-lg">
                      {space.user.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-semibold text-gray-900 truncate">{space.user.name}</div>
                    <div className="text-sm text-gray-600 truncate">Anfitrião FestSpace</div>
                    {space.user.subscription && (
                      <div className="text-xs text-primary-600 font-medium mt-1">
                        Plano {space.user.subscription.plan.charAt(0).toUpperCase() + space.user.subscription.plan.slice(1)}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Safety Information */}
            <div className="card p-6 bg-blue-50 border-blue-200">
              <h3 className="font-semibold text-blue-900 mb-3 flex items-center">
                <Check className="h-5 w-5 mr-2" />
                Dicas de Segurança
              </h3>
              <ul className="text-sm text-blue-800 space-y-2">
                <li className="flex items-start space-x-2">
                  <Check className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span>Nunca faça pagamentos fora da plataforma FestSpace</span>
                </li>
                <li className="flex items-start space-x-2">
                  <Check className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span>Verifique o espaço pessoalmente antes de fechar qualquer acordo</span>
                </li>
                <li className="flex items-start space-x-2">
                  <Check className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span>Mantenha toda comunicação registrada na plataforma</span>
                </li>
                <li className="flex items-start space-x-2">
                  <Check className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span>Desconfie de preços muito abaixo do mercado</span>
                </li>
              </ul>
            </div>

            {/* Report Issue */}
            <div className="text-center">
              <button className="text-sm text-gray-500 hover:text-gray-700 transition-colors">
                🚩 Reportar problema neste anúncio
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Action Button for Mobile */}
      <div className="lg:hidden fixed bottom-6 right-6 left-6 z-50">
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-lg font-bold text-primary-600">
                R$ {space.price.toLocaleString('pt-BR')}
              </div>
              <div className="text-sm text-gray-600">por diária</div>
            </div>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center space-x-2"
            >
              <MessageCircle className="h-5 w-5" />
              <span>Contatar</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SpaceDetails