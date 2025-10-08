import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { MapPin, Menu, X, User, LogOut, Settings, Plus } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    logout()
    navigate('/')
    setIsProfileOpen(false)
  }

  const isActiveRoute = (path: string) => {
    return location.pathname === path
  }

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center space-x-2 group"
            onClick={() => setIsMenuOpen(false)}
          >
            <div className="relative">
              <MapPin className="h-8 w-8 text-primary-600 transition-transform group-hover:scale-110" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-accent-500 rounded-full"></div>
            </div>
            <span className="text-xl font-bold text-gray-900">FestSpace</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className={`transition-colors duration-200 ${
                isActiveRoute('/') 
                  ? 'text-primary-600 font-semibold' 
                  : 'text-gray-700 hover:text-primary-600'
              }`}
            >
              Explorar Espaços
            </Link>
            {user && (
              <Link 
                to="/my-spaces" 
                className={`transition-colors duration-200 ${
                  isActiveRoute('/my-spaces') 
                    ? 'text-primary-600 font-semibold' 
                    : 'text-gray-700 hover:text-primary-600'
                }`}
              >
                Meus Espaços
              </Link>
            )}
            {user?.role === 'admin' && (
              <Link 
                to="/admin" 
                className={`transition-colors duration-200 ${
                  isActiveRoute('/admin') 
                    ? 'text-primary-600 font-semibold' 
                    : 'text-gray-700 hover:text-primary-600'
                }`}
              >
                Painel Admin
              </Link>
            )}
          </nav>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                    <User className="h-4 w-4 text-primary-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    {user.name}
                  </span>
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-48 card shadow-lg animate-slide-up">
                    <div className="p-2">
                      <div className="px-3 py-2 text-sm text-gray-600 border-b border-gray-200">
                        {user.email}
                      </div>
                      <Link
                        to="/my-spaces"
                        className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        <Settings className="h-4 w-4" />
                        <span>Meus Espaços</span>
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="flex items-center space-x-2 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>Sair</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="text-gray-700 hover:text-primary-600 transition-colors font-medium"
                >
                  Entrar
                </Link>
                <Link 
                  to="/register" 
                  className="btn-primary flex items-center space-x-2"
                >
                  <Plus className="h-4 w-4" />
                  <span>Anunciar Espaço</span>
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="h-6 w-6 text-gray-700" />
            ) : (
              <Menu className="h-6 w-6 text-gray-700" />
            )}
          </button>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200 animate-slide-up">
            <div className="flex flex-col space-y-4">
              <Link 
                to="/" 
                className={`px-2 py-1 rounded-lg transition-colors ${
                  isActiveRoute('/') 
                    ? 'text-primary-600 font-semibold bg-primary-50' 
                    : 'text-gray-700 hover:text-primary-600'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Explorar Espaços
              </Link>
              
              {user && (
                <>
                  <Link 
                    to="/my-spaces" 
                    className={`px-2 py-1 rounded-lg transition-colors ${
                      isActiveRoute('/my-spaces') 
                        ? 'text-primary-600 font-semibold bg-primary-50' 
                        : 'text-gray-700 hover:text-primary-600'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Meus Espaços
                  </Link>
                  
                  <div className="px-2 py-3 border-t border-gray-200">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                        <User className="h-4 w-4 text-primary-600" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                        <div className="text-xs text-gray-500">{user.email}</div>
                      </div>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-2 w-full px-2 py-2 text-gray-700 hover:text-red-600 transition-colors"
                    >
                      <LogOut className="h-4 w-4" />
                      <span className="text-sm">Sair</span>
                    </button>
                  </div>
                </>
              )}
              
              {user?.role === 'admin' && (
                <Link 
                  to="/admin" 
                  className={`px-2 py-1 rounded-lg transition-colors ${
                    isActiveRoute('/admin') 
                      ? 'text-primary-600 font-semibold bg-primary-50' 
                      : 'text-gray-700 hover:text-primary-600'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Painel Admin
                </Link>
              )}
              
              {!user && (
                <div className="flex flex-col space-y-2 pt-4 border-t border-gray-200">
                  <Link 
                    to="/login" 
                    className="btn-ghost text-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Entrar
                  </Link>
                  <Link 
                    to="/register" 
                    className="btn-primary text-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Anunciar Espaço
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header