import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Check, Star, Crown, Zap, CheckCircle } from 'lucide-react'
import { subscriptionAPI } from '../services/api'
import { useAuth } from '../contexts/AuthContext'
import { LoadingSpinner } from '../components/ui/LoadingSpinner'
import toast from 'react-hot-toast'

interface Plan {
  id: 'basic' | 'medium' | 'premium'
  name: string
  price: number
  features: {
    listings: number
    images: number
    visibility: 'low' | 'medium' | 'high'
  }
}

const Plans: React.FC = () => {
  const [plans, setPlans] = useState<Plan[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)
  const [processing, setProcessing] = useState(false)
  const { user } = useAuth()

  useEffect(() => {
    loadPlans()
  }, [])

  const loadPlans = async () => {
    try {
      const response = await subscriptionAPI.getPlans()
      setPlans(response.data)
    } catch (error) {
      toast.error('Erro ao carregar planos')
    } finally {
      setLoading(false)
    }
  }

  const handleSubscribe = async (planId: string) => {
  if (!user) {
    toast.error('Você precisa estar logado para assinar um plano')
    return
  }

  try {
    setProcessing(true)
    setSelectedPlan(planId)
    
    console.log('🛒 Iniciando assinatura do plano:', planId)
    
    const response = await subscriptionAPI.createCheckoutSession(planId)
    
    if (response.data.url) {
      console.log('✅ Redirecionando para checkout:', response.data.url)
      window.location.href = response.data.url
    } else {
      throw new Error('URL de checkout não recebida')
    }
  } catch (error: any) {
    console.error('❌ Erro no checkout:', error)
    
    // Mensagem de erro mais específica
    const errorMessage = error.response?.data?.message || 
                        error.response?.data?.error || 
                        'Erro ao processar assinatura. Tente novamente.'
    
    toast.error(errorMessage)
    setSelectedPlan(null)
  } finally {
    setProcessing(false)
  }
}

  const getPlanIcon = (planId: string) => {
    switch (planId) {
      case 'basic':
        return <CheckCircle className="h-6 w-6 text-primary-600" />
      case 'medium':
        return <Zap className="h-6 w-6 text-purple-600" />
      case 'premium':
        return <Crown className="h-6 w-6 text-yellow-600" />
      default:
        return <CheckCircle className="h-6 w-6 text-primary-600" />
    }
  }

  const getVisibilityLabel = (visibility: string) => {
    switch (visibility) {
      case 'low':
        return 'Baixa'
      case 'medium':
        return 'Média'
      case 'high':
        return 'Alta'
      default:
        return visibility
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Escolha o Plano Perfeito
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Comece a anunciar seus espaços para festas e alcance milhares de pessoas 
            procurando o local ideal para suas celebrações.
          </p>
        </div>

        {/* Current Plan Banner */}
        {user?.subscription && (
          <div className="max-w-2xl mx-auto mb-8">
            <div className="card p-6 bg-primary-50 border-primary-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-primary-900 mb-1">
                    Plano Atual: {user.subscription.plan.charAt(0).toUpperCase() + user.subscription.plan.slice(1)}
                  </h3>
                  <p className="text-primary-700">
                    Status: <span className={`font-medium ${
                      user.subscription.status === 'active' ? 'text-green-600' : 'text-yellow-600'
                    }`}>
                      {user.subscription.status === 'active' ? 'Ativo' : 'Cancelado'}
                    </span>
                    {user.subscription.status === 'active' && (
                      <span className="ml-4">
                        Próxima cobrança: {new Date(user.subscription.currentPeriodEnd).toLocaleDateString('pt-BR')}
                      </span>
                    )}
                  </p>
                </div>
                <button
                  onClick={async () => {
                    try {
                      const response = await subscriptionAPI.createPortalSession()
                      window.location.href = response.data.url
                    } catch (error: any) {
                      toast.error(error.response?.data?.message || 'Erro ao acessar portal')
                    }
                  }}
                  className="btn-secondary"
                >
                  Gerenciar Assinatura
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={plan.id}
              className={`card relative overflow-hidden ${
                index === 1 ? 'ring-2 ring-primary-600 transform scale-105' : ''
              }`}
            >
              {index === 1 && (
                <div className="absolute top-0 right-0 bg-primary-600 text-white px-4 py-1 text-sm font-semibold rounded-bl-lg">
                  Mais Popular
                </div>
              )}
              
              <div className="p-8">
                {/* Plan Header */}
                <div className="text-center mb-8">
                  <div className="flex justify-center mb-4">
                    {getPlanIcon(plan.id)}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <div className="flex items-baseline justify-center">
                    <span className="text-4xl font-bold text-gray-900">R$ {plan.price}</span>
                    <span className="text-gray-600 ml-2">/mês</span>
                  </div>
                </div>

                {/* Features */}
                <div className="space-y-4 mb-8">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Locações permitidas</span>
                    <span className="font-semibold text-gray-900">{plan.features.listings}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Imagens por locação</span>
                    <span className="font-semibold text-gray-900">{plan.features.images}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Visibilidade</span>
                    <span className="font-semibold text-gray-900">
                      {getVisibilityLabel(plan.features.visibility)}
                    </span>
                  </div>
                </div>

                {/* Additional Features */}
                <div className="space-y-3 mb-8">
                  <div className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-3" />
                    <span className="text-gray-700">Dashboard de gerenciamento</span>
                  </div>
                  <div className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-3" />
                    <span className="text-gray-700">Contato via WhatsApp</span>
                  </div>
                  <div className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-3" />
                    <span className="text-gray-700">Sistema de avaliações</span>
                  </div>
                  {plan.id !== 'basic' && (
                    <div className="flex items-center">
                      <Check className="h-5 w-5 text-green-500 mr-3" />
                      <span className="text-gray-700">Suporte prioritário</span>
                    </div>
                  )}
                  {plan.id === 'premium' && (
                    <div className="flex items-center">
                      <Star className="h-5 w-5 text-yellow-500 mr-3" />
                      <span className="text-gray-700">Destaque nos resultados</span>
                    </div>
                  )}
                </div>

                {/* Action Button */}
                {user ? (
                  <button
                    onClick={() => handleSubscribe(plan.id)}
                    disabled={processing && selectedPlan === plan.id}
                    className={`w-full py-3 px-4 rounded-lg font-semibold transition-all duration-200 ${
                      index === 1
                        ? 'btn-primary bg-primary-600 hover:bg-primary-700'
                        : 'btn-secondary bg-gray-200 hover:bg-gray-300 text-gray-900'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {processing && selectedPlan === plan.id ? (
                      <LoadingSpinner size="sm" />
                    ) : user.subscription?.plan === plan.id ? (
                      'Plano Atual'
                    ) : (
                      'Escolher Plano'
                    )}
                  </button>
                ) : (
                  <Link
                    to="/register"
                    className={`w-full btn ${
                      index === 1 ? 'btn-primary' : 'btn-secondary'
                    } flex items-center justify-center py-3`}
                  >
                    Criar Conta
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="max-w-4xl mx-auto mt-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
            Perguntas Frequentes
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Posso alterar meu plano depois?
              </h3>
              <p className="text-gray-600">
                Sim! Você pode fazer upgrade ou downgrade do seu plano a qualquer momento. 
                As alterações serão aplicadas no próximo ciclo de cobrança.
              </p>
            </div>
            
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Como funciona o cancelamento?
              </h3>
              <p className="text-gray-600">
                Você pode cancelar sua assinatura a qualquer momento. Seu plano permanecerá 
                ativo até o final do período atual, e não haverá cobranças futuras.
              </p>
            </div>
            
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                O que significa "visibilidade"?
              </h3>
              <p className="text-gray-600">
                A visibilidade determina a ordem de exibição nos resultados de busca. 
                Planos com maior visibilidade aparecem primeiro, aumentando suas chances de ser encontrado.
              </p>
            </div>
            
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Há cobranças por reserva?
              </h3>
              <p className="text-gray-600">
                Não! O FestSpace não cobra comissões sobre as reservas. Você paga apenas 
                pela assinatura mensal para anunciar seus espaços.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <div className="card p-8 bg-gradient-to-r from-primary-600 to-primary-700 text-white">
            <h2 className="text-3xl font-bold mb-4">
              Pronto para Começar?
            </h2>
            <p className="text-primary-100 text-lg mb-6 max-w-2xl mx-auto">
              Junte-se a centenas de anfitriões que já estão anunciando seus espaços 
              e gerando renda extra com o FestSpace.
            </p>
            {user ? (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => handleSubscribe('medium')}
                  className="btn-accent bg-white text-primary-600 hover:bg-gray-100"
                >
                  Começar com o Medium
                </button>
                <Link
                  to="/my-spaces"
                  className="btn-ghost bg-transparent border-white text-white hover:bg-white hover:bg-opacity-10"
                >
                  Ver Meus Espaços
                </Link>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/register"
                  className="btn-accent bg-white text-primary-600 hover:bg-gray-100"
                >
                  Criar Conta Gratuita
                </Link>
                <Link
                  to="/login"
                  className="btn-ghost bg-transparent border-white text-white hover:bg-white hover:bg-opacity-10"
                >
                  Fazer Login
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Plans