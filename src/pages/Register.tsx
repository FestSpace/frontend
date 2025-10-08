import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff, UserPlus, Check } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { registerSchema } from '../utils/validation'
import { LoadingSpinner } from '../components/ui/LoadingSpinner'

interface RegisterForm {
  name: string
  email: string
  password: string
  confirmPassword: string
  agreeToTerms: boolean
}

const Register: React.FC = () => {
  const [showPassword, setShowPassword] = React.useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)
  const { register: registerUser } = useAuth()
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema)
  })

  const onSubmit = async (data: RegisterForm) => {
    try {
      setIsLoading(true)
      await registerUser(data)
      navigate('/')
    } catch (error) {
      // Error handling is done in the AuthContext
    } finally {
      setIsLoading(false)
    }
  }

  const features = [
    'Anuncie seus espaços para festas',
    'Até 7 locações no plano Premium',
    'Contato direto com clientes',
    'Pagamentos seguros via Stripe',
    'Dashboard de gerenciamento'
  ]

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left Side - Form */}
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div>
            <Link to="/" className="inline-flex items-center space-x-2 text-2xl font-bold text-gray-900">
              <span>🎉</span>
              <span>FestSpace</span>
            </Link>
            <h2 className="mt-8 text-3xl font-bold text-gray-900">Crie sua conta</h2>
            <p className="mt-2 text-sm text-gray-600">
              Já tem uma conta?{' '}
              <Link
                to="/login"
                className="font-medium text-primary-600 hover:text-primary-500 transition-colors"
              >
                Faça login
              </Link>
            </p>
          </div>

          <div className="mt-8">
            <div className="card p-6">
              <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Nome completo
                  </label>
                  <input
                    {...register('name')}
                    type="text"
                    autoComplete="name"
                    className="input"
                    placeholder="Seu nome completo"
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    {...register('email')}
                    type="email"
                    autoComplete="email"
                    className="input"
                    placeholder="seu@email.com"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                    Senha
                  </label>
                  <div className="relative">
                    <input
                      {...register('password')}
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="new-password"
                      className="input pr-10"
                      placeholder="Mínimo 6 caracteres"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                    Confirmar senha
                  </label>
                  <div className="relative">
                    <input
                      {...register('confirmPassword')}
                      type={showConfirmPassword ? 'text' : 'password'}
                      autoComplete="new-password"
                      className="input pr-10"
                      placeholder="Digite novamente sua senha"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
                  )}
                </div>

                <div className="flex items-center">
                  <input
                    {...register('agreeToTerms')}
                    id="agreeToTerms"
                    name="agreeToTerms"
                    type="checkbox"
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label htmlFor="agreeToTerms" className="ml-2 block text-sm text-gray-700">
                    Concordo com os{' '}
                    <a href="#" className="text-primary-600 hover:text-primary-500 transition-colors">
                      Termos de Serviço
                    </a>{' '}
                    e{' '}
                    <a href="#" className="text-primary-600 hover:text-primary-500 transition-colors">
                      Política de Privacidade
                    </a>
                  </label>
                </div>
                {errors.agreeToTerms && (
                  <p className="text-sm text-red-600">Você deve aceitar os termos</p>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full btn-primary flex items-center justify-center space-x-2 py-3"
                >
                  {isLoading ? (
                    <LoadingSpinner size="sm" />
                  ) : (
                    <UserPlus className="h-4 w-4" />
                  )}
                  <span>{isLoading ? 'Criando conta...' : 'Criar conta'}</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Features */}
      <div className="hidden lg:block relative w-0 flex-1">
        <div className="absolute inset-0 h-full w-full bg-gradient-to-br from-primary-600 to-accent-600" />
        <div className="absolute inset-0 h-full w-full flex items-center justify-center">
          <div className="max-w-lg text-center text-white px-8">
            <h3 className="text-3xl font-bold mb-8">
              Comece a anunciar seus espaços
            </h3>
            <div className="space-y-4 text-left">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                    <Check className="h-3 w-3" />
                  </div>
                  <span className="text-lg">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register