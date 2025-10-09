import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Edit, Trash2, Eye, EyeOff, MapPin, Users, Star } from 'lucide-react'
import { spacesAPI, subscriptionAPI } from '../services/api'
import { Space, Subscription } from '../types'
import { useAuth } from '../contexts/AuthContext'
import { LoadingSpinner } from '../components/ui/LoadingSpinner'
import CreateSpaceModal from '../components/spaces/CreateSpaceModal'
import toast from 'react-hot-toast'

const MySpaces: React.FC = () => {
  const [spaces, setSpaces] = useState<Space[]>([])
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const { user } = useAuth()

  useEffect(() => {
    loadSpaces()
  }, [])

  const loadSpaces = async () => {
    try {
      const response = await spacesAPI.getMySpaces()
      setSpaces(response.data)
    } catch (error) {
      toast.error('Erro ao carregar seus espaços')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateSuccess = () => {
    loadSpaces() // Recarregar a lista
    toast.success('Espaço criado com sucesso!')
  }

  const handleDeleteSpace = async (spaceId: string) => {
    if (!confirm('Tem certeza que deseja excluir este espaço? Esta ação não pode ser desfeita.')) {
      return
    }

    try {
      setDeletingId(spaceId)
      await spacesAPI.delete(spaceId)
      toast.success('Espaço excluído com sucesso')
      setSpaces(spaces.filter(space => space.id !== spaceId))
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Erro ao excluir espaço')
    } finally {
      setDeletingId(null)
    }
  }

  const handleToggleStatus = async (spaceId: string, currentStatus: boolean) => {
    try {
      await spacesAPI.toggleActive(spaceId, !currentStatus)
      toast.success(`Espaço ${!currentStatus ? 'ativado' : 'desativado'} com sucesso`)
      loadSpaces()
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Erro ao alterar status')
    }
  }

  const handleManageSubscription = async () => {
    try {
      const response = await subscriptionAPI.createPortalSession()
      window.location.href = response.data.url
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Erro ao acessar portal de assinatura')
    }
  }

  const getPlanLimits = (subscription: Subscription | undefined) => {
    const limits = {
      basic: { spaces: 1, images: 5 },
      medium: { spaces: 3, images: 10 },
      premium: { spaces: 7, images: 20 }
    }
    
    return subscription ? limits[subscription.plan] : limits.basic
  }

  const planLimits = getPlanLimits(user?.subscription)
  const usedSpaces = spaces.length
  const hasActiveSubscription = user?.subscription?.status === 'active'

  if (loading) {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="animate-pulse">
          <div className="skeleton h-8 w-64 mb-2"></div>
          <div className="skeleton h-4 w-96 mb-8"></div>
          <div className="skeleton h-32 w-full mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="skeleton h-80 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Meus Espaços</h1>
          <p className="text-gray-600">
            Gerencie seus espaços para festas e visualize suas estatísticas
          </p>
        </div>

        {/* Subscription Status */}
        {!hasActiveSubscription ? (
          <div className="card p-6 bg-yellow-50 border-yellow-200 mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-yellow-800 mb-1">
                  Assinatura Necessária
                </h3>
                <p className="text-yellow-700">
                  Você precisa de uma assinatura ativa para anunciar espaços.
                </p>
              </div>
              <Link to="/plans" className="btn-primary">
                Escolher Plano
              </Link>
            </div>
          </div>
        ) : (
          <div className="card p-6 bg-white mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  Plano {user?.subscription?.plan ? user.subscription.plan.charAt(0).toUpperCase() + user.subscription.plan.slice(1) : ''}
                </h3>
                <p className="text-gray-600">
                  {usedSpaces}/{planLimits.spaces} espaços utilizados • {planLimits.images} imagens por espaço
                </p>
              </div>
              <button
                onClick={handleManageSubscription}
                className="btn-secondary"
              >
                Gerenciar Assinatura
              </button>
            </div>

            {/* Progress Bar */}
            <div className="mt-4">
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>Uso de espaços</span>
                <span>{usedSpaces}/{planLimits.spaces}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(usedSpaces / planLimits.spaces) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            Meus Espaços ({spaces.length})
          </h2>
          
          {hasActiveSubscription && usedSpaces < planLimits.spaces && (
            <button 
              onClick={() => setIsCreateModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Adicionar Espaço</span>
            </button>
          )}
        </div>

        {/* Spaces Grid */}
        {spaces.length === 0 ? (
          <div className="card p-12 text-center">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Plus className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Nenhum espaço cadastrado
              </h3>
              <p className="text-gray-600 mb-6">
                {hasActiveSubscription 
                  ? 'Comece anunciando seu primeiro espaço para festas.'
                  : 'Adquira uma assinatura para começar a anunciar seus espaços.'
                }
              </p>
              {hasActiveSubscription && (
                <Link to="/spaces/new" className="btn-primary rounded-lg">
                  Criar Primeiro Espaço
                </Link>
              )}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {spaces.map((space) => (
              <div key={space.id} className="card group">
                {/* Image */}
                <div className="relative">
                  <img
                    src={space.images[0] || '/placeholder-space.jpg'}
                    alt={space.title}
                    className="w-full h-48 object-cover"
                  />
                  
                  {/* Status Badge */}
                  <div className="absolute top-3 right-3">
                    <span className={`badge ${
                      space.isActive 
                        ? 'badge-success' 
                        : 'bg-gray-500 text-white'
                    }`}>
                      {space.isActive ? 'Ativo' : 'Inativo'}
                    </span>
                  </div>

                  {/* Actions Overlay */}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center space-x-2 opacity-0 group-hover:opacity-100">
                    <Link
                      to={`/space/${space.id}`}
                      className="bg-white p-2 rounded-full shadow-lg hover:bg-gray-100 transition-colors"
                    >
                      <Eye className="h-4 w-4 text-gray-700" />
                    </Link>
                    <Link
                      to={`/spaces/edit/${space.id}`}
                      className="bg-white p-2 rounded-full shadow-lg hover:bg-gray-100 transition-colors"
                    >
                      <Edit className="h-4 w-4 text-gray-700" />
                    </Link>
                    <button
                      onClick={() => handleToggleStatus(space.id, space.isActive)}
                      className="bg-white p-2 rounded-full shadow-lg hover:bg-gray-100 transition-colors"
                    >
                      {space.isActive ? (
                        <EyeOff className="h-4 w-4 text-gray-700" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-700" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                    {space.title}
                  </h3>
                  
                  <div className="flex items-center text-gray-600 text-sm mb-2">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span className="truncate">{space.city}, {space.state}</span>
                  </div>
                  
                  <div className="flex items-center text-gray-600 text-sm mb-3">
                    <Users className="h-4 w-4 mr-1" />
                    <span>Até {space.capacity} pessoas</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-primary-600">
                      R$ {space.price.toLocaleString('pt-BR')}
                    </span>
                    
                    {space.rating > 0 && (
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="text-sm text-gray-600">{space.rating.toFixed(1)}</span>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-2 mt-4 pt-4 border-t border-gray-200">
                    <Link
                      to={`/spaces/edit/${space.id}`}
                      className="btn-secondary flex-1 flex items-center justify-center space-x-1 py-2 text-sm"
                    >
                      <Edit className="h-3 w-3" />
                      <span>Editar</span>
                    </Link>
                    
                    <button
                      onClick={() => handleDeleteSpace(space.id)}
                      disabled={deletingId === space.id}
                      className="btn-ghost text-red-600 hover:text-red-700 hover:bg-red-50 flex items-center justify-center space-x-1 py-2 text-sm"
                    >
                      {deletingId === space.id ? (
                        <LoadingSpinner size="sm" />
                      ) : (
                        <Trash2 className="h-3 w-3" />
                      )}
                      <span>Excluir</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Upgrade Prompt */}
        {hasActiveSubscription && usedSpaces >= planLimits.spaces && (
          <div className="card p-6 bg-gradient-to-r from-primary-500 to-primary-600 text-white mt-8">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold mb-2">
                  Limite de Espaços Atingido
                </h3>
                <p className="text-primary-100">
                  Você atingiu o limite de {planLimits.spaces} espaço(s) do seu plano atual.
                  Faça upgrade para anunciar mais espaços.
                </p>
              </div>
              <Link to="/plans" className="btn-accent">
                Fazer Upgrade
              </Link>
            </div>
          </div>
        )}
        {/* Modal de Criação */}
        <CreateSpaceModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSuccess={handleCreateSuccess}
        />
      </div>
    </div>
  )
}

export default MySpaces