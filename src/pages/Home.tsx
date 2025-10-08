import React, { useState, useEffect } from 'react'
import { Search, Filter, MapPin, Users, Star, Sparkles } from 'lucide-react'
import { spacesAPI } from '../services/api'
import { Space } from '../types'
import SpaceCard from '../components/spaces/SpaceCard'
import { LoadingSpinner } from '../components/ui/LoadingSpinner'

const Home: React.FC = () => {
  const [spaces, setSpaces] = useState<Space[]>([])
  const [loading, setLoading] = useState(true)
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({
    city: '',
    state: '',
    minPrice: '',
    maxPrice: '',
    minCapacity: '',
    sortBy: 'rating'
  })

  useEffect(() => {
    loadSpaces()
  }, [filters])

  const loadSpaces = async () => {
    try {
      setLoading(true)
      const response = await spacesAPI.getAll(filters)
      
      // CORREÇÃO: Garantir que spaces seja sempre um array
      const spacesData = response.data.spaces || response.data || []
      setSpaces(Array.isArray(spacesData) ? spacesData : [])
    } catch (error) {
      console.error('Error loading spaces:', error)
      setSpaces([]) // Garantir array vazio em caso de erro
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const clearFilters = () => {
    setFilters({
      city: '',
      state: '',
      minPrice: '',
      maxPrice: '',
      minCapacity: '',
      sortBy: 'rating'
    })
  }

  // CORREÇÃO: Garantir que featuredSpaces seja sempre um array
  const featuredSpaces = Array.isArray(spaces) 
    ? spaces.filter(space => 
        space?.user?.subscription?.plan === 'premium'
      ).slice(0, 3)
    : []

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-orange-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Encontre o espaço
              <span className="text-blue-600 block">perfeito</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
              Salões, áreas de lazer, sítios e muito mais. Tudo para tornar seu evento inesquecível.
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Buscar por cidade, bairro ou tipo de espaço..."
                  className="w-full pl-12 pr-4 py-4 text-lg border border-gray-300 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={filters.city}
                  onChange={(e) => handleFilterChange('city', e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Spaces */}
      {featuredSpaces.length > 0 && (
        <section className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-2">
                <Sparkles className="h-6 w-6 text-yellow-500" />
                <h2 className="text-2xl font-bold text-gray-900">Espaços em Destaque</h2>
              </div>
              <span className="bg-orange-100 text-orange-800 px-2.5 py-0.5 rounded-full text-xs font-medium">
                Premium
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredSpaces.map((space) => (
                <SpaceCard key={space.id} space={space} featured />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Main Content */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters Sidebar */}
            <div className="lg:w-80 flex-shrink-0">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-24">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Filtros</h3>
                  <button
                    onClick={clearFilters}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Limpar
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Localização */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Localização
                    </label>
                    <input
                      type="text"
                      placeholder="Cidade"
                      className="input mb-2"
                      value={filters.city}
                      onChange={(e) => handleFilterChange('city', e.target.value)}
                    />
                    <input
                      type="text"
                      placeholder="Estado (ex: SP)"
                      className="input"
                      value={filters.state}
                      onChange={(e) => handleFilterChange('state', e.target.value)}
                    />
                  </div>

                  {/* Preço */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Preço por diária
                    </label>
                    <div className="flex space-x-2">
                      <input
                        type="number"
                        placeholder="Mín"
                        className="input"
                        value={filters.minPrice}
                        onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                      />
                      <input
                        type="number"
                        placeholder="Máx"
                        className="input"
                        value={filters.maxPrice}
                        onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Capacidade */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Capacidade mínima
                    </label>
                    <input
                      type="number"
                      placeholder="Nº de pessoas"
                      className="input"
                      value={filters.minCapacity}
                      onChange={(e) => handleFilterChange('minCapacity', e.target.value)}
                    />
                  </div>

                  {/* Ordenação */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ordenar por
                    </label>
                    <select
                      className="input pr-10 bg-white"
                      value={filters.sortBy}
                      onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                    >
                      <option value="rating">Melhor avaliados</option>
                      <option value="price_asc">Menor preço</option>
                      <option value="price_desc">Maior preço</option>
                      <option value="capacity">Maior capacidade</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Spaces Grid */}
            <div className="flex-1">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Espaços Disponíveis
                  </h2>
                  <p className="text-gray-600 mt-1">
                    {Array.isArray(spaces) ? spaces.length : 0} espaço{spaces.length !== 1 ? 's' : ''} encontrado{spaces.length !== 1 ? 's' : ''}
                  </p>
                </div>

                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden bg-gray-200 hover:bg-gray-300 text-gray-900 font-medium py-2 px-4 rounded-lg flex items-center space-x-2"
                >
                  <Filter className="h-4 w-4" />
                  <span>Filtros</span>
                </button>
              </div>

              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 animate-pulse">
                      <div className="bg-gray-200 h-48 rounded-lg mb-4"></div>
                      <div className="bg-gray-200 h-4 rounded mb-2"></div>
                      <div className="bg-gray-200 h-4 rounded w-2/3 mb-4"></div>
                      <div className="bg-gray-200 h-6 rounded w-1/2"></div>
                    </div>
                  ))}
                </div>
              ) : (
                <>
                  {/* CORREÇÃO: Verificar se spaces é array antes de mapear */}
                  {Array.isArray(spaces) && spaces.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                      {spaces.map((space) => (
                        <SpaceCard key={space.id} space={space} />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-16">
                      <MapPin className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        Nenhum espaço encontrado
                      </h3>
                      <p className="text-gray-600 max-w-md mx-auto">
                        Tente ajustar os filtros ou buscar em uma localização diferente.
                      </p>
                      <button
                        onClick={clearFilters}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg mt-4"
                      >
                        Limpar filtros
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home