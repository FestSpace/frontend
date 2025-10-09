import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { spacesAPI } from '../services/api'
import toast from 'react-hot-toast'

const MySpaces = () => {
  const [spaces, setSpaces] = useState([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  const loadMySpaces = async () => {
    try {
      setLoading(true)
      console.log('🔄 Carregando espaços do usuário...')
      
      const response = await spacesAPI.getMySpaces({
        page: 1,
        limit: 10,
        sortBy: 'createdAt_desc'
      })

      console.log('📦 Resposta da API:', response.data)

      // ✅ VERIFICAÇÃO CORRETA - Acesse o caminho correto
      if (response.data && response.data.data && Array.isArray(response.data.data.spaces)) {
        setSpaces(response.data.data.spaces)
        console.log(`✅ ${response.data.data.spaces.length} espaços carregados`)
      } else if (response.data && Array.isArray(response.data.spaces)) {
        // Formato alternativo
        setSpaces(response.data.spaces)
        console.log(`✅ ${response.data.spaces.length} espaços carregados`)
      } else if (Array.isArray(response.data)) {
        // Se for array direto
        setSpaces(response.data)
        console.log(`✅ ${response.data.length} espaços carregados`)
      } else {
        console.warn('⚠️ Formato de resposta inesperado:', response.data)
        setSpaces([])
        toast.error('Formato de dados inesperado')
      }

    } catch (error) {
      console.error('❌ Erro ao carregar espaços:', error)
      toast.error('Erro ao carregar seus espaços')
      setSpaces([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user) {
      loadMySpaces()
    }
  }, [user])

  // ✅ Função de debug para verificar dados
  const debugData = () => {
    console.log('🔍 Debug MySpaces:')
    console.log('User:', user)
    console.log('Spaces:', spaces)
    console.log('Spaces type:', typeof spaces)
    console.log('Is array:', Array.isArray(spaces))
    console.log('Spaces length:', spaces?.length || 0)
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="text-lg">Carregando seus espaços...</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Meus Espaços</h1>
        <button 
          onClick={debugData}
          className="px-4 py-2 bg-gray-500 text-white rounded-lg text-sm"
        >
          Debug
        </button>
      </div>

      {/* ✅ VERIFICAÇÃO SEGURA antes do map */}
      {!Array.isArray(spaces) ? (
        <div className="text-center py-8">
          <p className="text-red-500">Erro: dados inválidos recebidos</p>
          <button 
            onClick={loadMySpaces}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg"
          >
            Tentar Novamente
          </button>
        </div>
      ) : spaces.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">Você ainda não criou nenhum espaço</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* ✅ AGORA SEGURO - spaces é um array */}
          {spaces.map((space) => (
            <div key={space.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="h-48 bg-gray-200">
                {space.images && space.images.length > 0 ? (
                  <img 
                    src={space.images[0]} 
                    alt={space.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    Sem imagem
                  </div>
                )}
              </div>
              
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-2">{space.title}</h3>
                <p className="text-gray-600 text-sm mb-2">
                  {space.city}, {space.state}
                </p>
                <p className="text-gray-800 font-medium">
                  R$ {space.price} / diária
                </p>
                <div className="flex justify-between items-center mt-3">
                  <span className={`px-2 py-1 rounded text-xs ${
                    space.isActive 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {space.isActive ? 'Ativo' : 'Inativo'}
                  </span>
                  <span className="text-sm text-gray-500">
                    {space.capacity} pessoas
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default MySpaces