import React, { createContext, useContext, useEffect, useState } from 'react'
import { authAPI } from '../services/api'
import { User, AuthContextType, RegisterData } from '../types'
import toast from 'react-hot-toast'

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('token')
      if (token) {
        const response = await authAPI.getProfile()
        setUser(response.data)
      }
    } catch (error) {
      localStorage.removeItem('token')
    } finally {
      setLoading(false)
    }
  }

  const login = async (email: string, password: string): Promise<User> => {
    try {
      const response = await authAPI.login({ email, password })
      const { user: userData, token } = response.data
      
      localStorage.setItem('token', token)
      setUser(userData)
      toast.success(`Bem-vindo de volta, ${userData.name}!`)
      
      return userData
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Erro ao fazer login')
      throw error
    }
  }

  const register = async (userData: RegisterData): Promise<User> => {
    try {
      const { confirmPassword, ...registerData } = userData
      const response = await authAPI.register(registerData)
      const { user: newUser, token } = response.data
      
      localStorage.setItem('token', token)
      setUser(newUser)
      toast.success(`Conta criada com sucesso! Bem-vindo, ${newUser.name}!`)
      
      return newUser
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Erro ao criar conta')
      throw error
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    setUser(null)
    toast.success('Logout realizado com sucesso!')
  }

  const value: AuthContextType = {
    user,
    login,
    register,
    logout,
    loading,
    isAuthenticated: !!user
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}