import React, { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { CheckCircle, ArrowRight, Home, MapPin } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

const CheckoutSuccess: React.FC = () => {
  const [searchParams] = useSearchParams()
  const sessionId = searchParams.get('session_id')
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate processing time
    const timer = setTimeout(() => {
      setLoading(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Processando sua assinatura...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="card p-8 text-center">
          {/* Success Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </div>

          {/* Success Message */}
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Parabéns!
          </h1>
          <p className="text-lg text-gray-600 mb-2">
            Sua assinatura foi ativada com sucesso.
          </p>
          <p className="text-gray-600 mb-8">
            Agora você pode começar a anunciar seus espaços no FestSpace.
          </p>

          {/* Plan Details */}
          {user?.subscription && (
            <div className="bg-primary-50 rounded-lg p-4 mb-8">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <MapPin className="h-5 w-5 text-primary-600" />
                <span className="font-semibold text-primary-900">
                  Plano {user.subscription.plan.charAt(0).toUpperCase() + user.subscription.plan.slice(1)}
                </span>
              </div>
              <p className="text-sm text-primary-700">
                Ativo até {new Date(user.subscription.currentPeriodEnd).toLocaleDateString('pt-BR')}
              </p>
            </div>
          )}

          {/* Next Steps */}
          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <h3 className="font-semibold text-gray-900 mb-4">Próximos Passos</h3>
            <div className="space-y-3 text-left">
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-primary-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">1</span>
                </div>
                <span className="text-gray-700">Adicione seu primeiro espaço</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-primary-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">2</span>
                </div>
                <span className="text-gray-700">Configure fotos e descrição</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-primary-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">3</span>
                </div>
                <span className="text-gray-700">Comece a receber contatos</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-4">
            <Link
              to="/my-spaces"
              className="w-full btn-primary flex items-center justify-center space-x-2 py-3"
            >
              <span>Gerenciar Meus Espaços</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
            
            <Link
              to="/"
              className="w-full btn-ghost flex items-center justify-center space-x-2 py-3"
            >
              <Home className="h-4 w-4" />
              <span>Voltar para Home</span>
            </Link>
          </div>

          {/* Support Info */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              Precisa de ajuda?{' '}
              <a href="mailto:suporte@festspace.com" className="text-primary-600 hover:text-primary-700">
                Entre em contato com nosso suporte
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CheckoutSuccess