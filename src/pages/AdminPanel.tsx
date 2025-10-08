import React, { useState, useEffect } from 'react'
import { 
  Users, 
  MapPin, 
  Star, 
  DollarSign, 
  TrendingUp, 
  Eye,
  EyeOff,
  Edit3,
  Trash2,
  Search,
  Filter
} from 'lucide-react'
import { adminAPI } from '../services/api'
import { User, Space } from '../types'
import { LoadingSpinner } from '../components/ui/LoadingSpinner'
import toast from 'react-hot-toast'

interface Stats {
  totalUsers: number
  totalSpaces: number
  activeSpaces: number
  totalReviews: number
  inactiveSpaces: number
}

interface AdminStats {
  stats: Stats
  subscriptionStats: any[]
  recentSignups: User[]
  recentSpaces: Space[]
}

const AdminPanel: React.FC = () => {
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [users, setUsers] = useState<User[]>([])
  const [spaces, setSpaces] = useState<Space[]>([])
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'spaces'>('overview')
  const [loading, setLoading] = useState(true)
  const [usersLoading, setUsersLoading] = useState(false)
  const [spacesLoading, setSpacesLoading] = useState(false)

  useEffect(() => {
    loadStats()
  }, [])

  useEffect(() => {
    if (activeTab === 'users') {
      loadUsers()
    } else if (activeTab === 'spaces') {
      loadSpaces()
    }
  }, [activeTab])

  const loadStats = async () => {
    try {
      const response = await adminAPI.getStats()
      setStats(response.data)
    } catch (error) {
      toast.error('Erro ao carregar estatísticas')
    } finally {
      setLoading(false)
    }
  }

  const loadUsers = async () => {
    try {
      setUsersLoading(true)
      const response = await adminAPI.getUsers()
      setUsers(response.data.users)
    } catch (error) {
      toast.error('Erro ao carregar usuários')
    } finally {
      setUsersLoading(false)
    }
  }

  const loadSpaces = async () => {
    try {
      setSpacesLoading(true)
      const response = await adminAPI.getSpaces()
      setSpaces(response.data.spaces)
    } catch (error) {
      toast.error('Erro ao carregar espaços')
    } finally {
      setSpacesLoading(false)
    }
  }

  const handleUpdateUserRole = async (userId: string, newRole: 'user' | 'admin') => {
    try {
      await adminAPI.updateUserRole(userId, newRole)
      toast.success(`Role do usuário atualizada para ${newRole}`)
      loadUsers()
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Erro ao atualizar role')
    }
  }

  const handleUpdateSpaceStatus = async (spaceId: string, isActive: boolean) => {
    try {
      await adminAPI.updateSpaceStatus(spaceId, isActive)
      toast.success(`Espaço ${isActive ? 'aprovado' : 'reprovado'} com sucesso`)
      loadSpaces()
      loadStats()
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Erro ao atualizar status')
    }
  }

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Tem certeza que deseja excluir este usuário? Esta ação não pode ser desfeita.')) {
      return
    }

    try {
      await adminAPI.deleteUser(userId)
      toast.success('Usuário excluído com sucesso')
      loadUsers()
      loadStats()
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Erro ao excluir usuário')
    }
  }

  const handleDeleteSpace = async (spaceId: string) => {
    if (!confirm('Tem certeza que deseja excluir este espaço? Esta ação não pode ser desfeita.')) {
      return
    }

    try {
      await adminAPI.deleteSpace(spaceId)
      toast.success('Espaço excluído com sucesso')
      loadSpaces()
      loadStats()
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Erro ao excluir espaço')
    }
  }

  if (loading && !stats) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold text-gray-900">Painel Administrativo</h1>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'overview', name: 'Visão Geral', icon: TrendingUp },
              { id: 'users', name: 'Usuários', icon: Users },
              { id: 'spaces', name: 'Espaços', icon: MapPin }
            ].map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.name}</span>
                </button>
              )
            })}
          </nav>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && stats && (
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="card p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Users className="h-8 w-8 text-primary-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total de Usuários</p>
                    <p className="text-2xl font-semibold text-gray-900">{stats.stats.totalUsers}</p>
                  </div>
                </div>
              </div>

              <div className="card p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <MapPin className="h-8 w-8 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Espaços Ativos</p>
                    <p className="text-2xl font-semibold text-gray-900">{stats.stats.activeSpaces}</p>
                  </div>
                </div>
              </div>

              <div className="card p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Star className="h-8 w-8 text-yellow-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total de Avaliações</p>
                    <p className="text-2xl font-semibold text-gray-900">{stats.stats.totalReviews}</p>
                  </div>
                </div>
              </div>

              <div className="card p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <DollarSign className="h-8 w-8 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Taxa de Ativação</p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {Math.round((stats.stats.activeSpaces / stats.stats.totalSpaces) * 100)}%
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Recent Signups */}
              <div className="card p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Cadastros Recentes</h3>
                <div className="space-y-4">
                  {stats.recentSignups.map((user) => (
                    <div key={user.id} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                          <span className="text-primary-600 font-medium text-sm">
                            {user.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{user.name}</div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                        </div>
                      </div>
                      <div className="text-sm text-gray-500">
                        {new Date(user.createdAt).toLocaleDateString('pt-BR')}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Spaces */}
              <div className="card p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Espaços Recentes</h3>
                <div className="space-y-4">
                  {stats.recentSpaces.map((space) => (
                    <div key={space.id} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <img
                          src={space.images[0] || '/placeholder-space.jpg'}
                          alt={space.title}
                          className="w-10 h-10 object-cover rounded"
                        />
                        <div>
                          <div className="text-sm font-medium text-gray-900 line-clamp-1">
                            {space.title}
                          </div>
                          <div className="text-sm text-gray-500">{space.user.name}</div>
                        </div>
                      </div>
                      <div className={`badge ${
                        space.isActive ? 'badge-success' : 'bg-gray-500 text-white'
                      }`}>
                        {space.isActive ? 'Ativo' : 'Inativo'}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="card">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Gerenciar Usuários</h2>
                <div className="flex space-x-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <input
                      type="text"
                      placeholder="Buscar usuários..."
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                  <button className="btn-secondary flex items-center space-x-2">
                    <Filter className="h-4 w-4" />
                    <span>Filtrar</span>
                  </button>
                </div>
              </div>
            </div>

            {usersLoading ? (
              <div className="p-8 text-center">
                <LoadingSpinner size="lg" />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Usuário
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Plano
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Espaços
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Role
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Cadastro
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ações
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {users.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                              <span className="text-primary-600 font-medium text-sm">
                                {user.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{user.name}</div>
                              <div className="text-sm text-gray-500">{user.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`badge ${
                            user.subscription?.status === 'active' 
                              ? 'badge-success' 
                              : 'bg-gray-500 text-white'
                          }`}>
                            {user.subscription?.plan || 'Nenhum'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {user.spacesCount ?? 0}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <select
                            value={user.role}
                            onChange={(e) => handleUpdateUserRole(user.id, e.target.value as 'user' | 'admin')}
                            className="text-sm border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          >
                            <option value="user">Usuário</option>
                            <option value="admin">Administrador</option>
                          </select>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(user.createdAt).toLocaleDateString('pt-BR')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => handleDeleteUser(user.id)}
                            className="text-red-600 hover:text-red-900 transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Spaces Tab */}
        {activeTab === 'spaces' && (
          <div className="card">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Gerenciar Espaços</h2>
                <div className="flex space-x-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <input
                      type="text"
                      placeholder="Buscar espaços..."
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                  <button className="btn-secondary flex items-center space-x-2">
                    <Filter className="h-4 w-4" />
                    <span>Filtrar</span>
                  </button>
                </div>
              </div>
            </div>

            {spacesLoading ? (
              <div className="p-8 text-center">
                <LoadingSpinner size="lg" />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Espaço
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Anfitrião
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Localização
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Preço
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Avaliação
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ações
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {spaces.map((space) => (
                      <tr key={space.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <img
                              src={space.images[0] || '/placeholder-space.jpg'}
                              alt={space.title}
                              className="w-10 h-10 object-cover rounded"
                            />
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900 line-clamp-1">
                                {space.title}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {space.user.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {space.city}, {space.state}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          R$ {space.price}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <div className="flex items-center space-x-1">
                            <Star className="h-4 w-4 text-yellow-400 fill-current" />
                            <span>{space.rating.toFixed(1)}</span>
                            <span className="text-gray-500">({space.reviewCount})</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            onClick={() => handleUpdateSpaceStatus(space.id, !space.isActive)}
                            className={`badge ${
                              space.isActive 
                                ? 'badge-success' 
                                : 'bg-gray-500 text-white'
                            } hover:opacity-80 transition-opacity`}
                          >
                            {space.isActive ? 'Ativo' : 'Inativo'}
                          </button>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                          <button
                            onClick={() => handleUpdateSpaceStatus(space.id, !space.isActive)}
                            className="text-gray-600 hover:text-gray-900 transition-colors"
                            title={space.isActive ? 'Desativar' : 'Ativar'}
                          >
                            {space.isActive ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                          <button
                            onClick={() => handleDeleteSpace(space.id)}
                            className="text-red-600 hover:text-red-900 transition-colors"
                            title="Excluir"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminPanel