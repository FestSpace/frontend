import React from 'react'
import { Link } from 'react-router-dom'
import { XCircle, ArrowLeft, CreditCard } from 'lucide-react'

const CheckoutCancel: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="card p-8 text-center">
          {/* Cancel Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
              <XCircle className="h-8 w-8 text-red-600" />
            </div>
          </div>

          {/* Cancel Message */}
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Pagamento Cancelado
          </h1>
          <p className="text-lg text-gray-600 mb-2">
            O processo de assinatura foi cancelado.
          </p>
          <p className="text-gray-600 mb-8">
            Não se preocupe, você pode tentar novamente quando quiser.
          </p>

          {/* Reasons */}
          <div className="bg-yellow-50 rounded-lg p-6 mb-8">
            <h3 className="font-semibold text-yellow-800 mb-3">
              Por que isso aconteceu?
            </h3>
            <ul className="text-sm text-yellow-700 space-y-2 text-left">
              <li className="flex items-start space-x-2">
                <span>•</span>
                <span>Você cancelou o processo de pagamento</span>
              </li>
              <li className="flex items-start space-x-2">
                <span>•</span>
                <span>Problemas temporários com o meio de pagamento</span>
              </li>
              <li className="flex items-start space-x-2">
                <span>•</span>
                <span>Decisão de não prosseguir no momento</span>
              </li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="space-y-4">
            <Link
              to="/plans"
              className="w-full btn-primary flex items-center justify-center space-x-2 py-3"
            >
              <CreditCard className="h-4 w-4" />
              <span>Tentar Novamente</span>
            </Link>
            
            <Link
              to="/"
              className="w-full btn-ghost flex items-center justify-center space-x-2 py-3"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Voltar para Home</span>
            </Link>
          </div>

          {/* Support Info */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              Problemas com o pagamento?{' '}
              <a href="mailto:suporte@festspace.com" className="text-primary-600 hover:text-primary-700">
                Nossa equipe pode ajudar
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CheckoutCancel