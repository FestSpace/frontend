import axios from 'axios'
import toast from 'react-hot-toast'

declare global {
  interface ImportMeta {
    readonly env: Record<string, string>
  }
}

const API_URL = import.meta.env.VITE_API_URL

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
})

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || 'Erro de conexão'
    
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    
    if (error.response?.status >= 500) {
      toast.error('Erro interno do servidor. Tente novamente.')
    } else if (error.response?.status !== 401) {
      toast.error(message)
    }
    
    return Promise.reject(error)
  }
)

// Auth API
export const authAPI = {
  login: (credentials: { email: string; password: string }) =>
    api.post('/auth/login', credentials),
  register: (userData: { name: string; email: string; password: string }) =>
    api.post('/auth/register', userData),
  getProfile: () => api.get('/auth/profile'),
  refreshToken: () => api.post('/auth/refresh'),
  updateProfile: (data: { name?: string; avatar?: string }) =>
    api.put('/auth/profile', data),
}

// Spaces API
export const spacesAPI = {
  getAll: async (filters?: any) => {
    try {
      const response = await api.get('/spaces', { params: filters })
      
      // Garantir que a resposta tenha a estrutura esperada
      if (response.data && Array.isArray(response.data.spaces)) {
        return response
      } else if (Array.isArray(response.data)) {
        // Se a resposta for diretamente um array
        return { ...response, data: { spaces: response.data } }
      } else {
        // Retornar estrutura padrão com array vazio
        return { ...response, data: { spaces: [] } }
      }
    } catch (error) {
      console.error('API Error:', error)
      // Retornar estrutura padrão em caso de erro
      return { data: { spaces: [] } }
    }
  },
  getById: (id: string) => api.get(`/spaces/${id}`),
  create: (spaceData: FormData) => 
    api.post('/spaces', spaceData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
  update: (id: string, spaceData: FormData) => 
    api.put(`/spaces/${id}`, spaceData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
  delete: (id: string) => api.delete(`/spaces/${id}`),
  getMySpaces: () => api.get('/user/my-spaces'),
  toggleActive: (id: string, active: boolean) =>
    api.patch(`/spaces/${id}/status`, { isActive: active }),
}

// Reviews API
export const reviewsAPI = {
  create: (spaceId: string, review: { rating: number; comment?: string }) =>
    api.post(`/spaces/${spaceId}/reviews`, review),
  update: (reviewId: string, review: { rating: number; comment?: string }) =>
    api.put(`/reviews/${reviewId}`, review),
  delete: (reviewId: string) => api.delete(`/reviews/${reviewId}`),
}

// Subscriptions API
export const subscriptionAPI = {
  createCheckoutSession: (plan: string) => 
    api.post('/subscriptions/create-checkout-session', { plan }),
  createPortalSession: () => 
    api.post('/subscriptions/create-portal-session'),
  getPlans: () => api.get('/subscriptions/plans'),
  cancelSubscription: () => api.post('/subscriptions/cancel'),
  reactivateSubscription: () => api.post('/subscriptions/reactivate'),
}

// Admin API
export const adminAPI = {
  getStats: () => api.get('/admin/stats'),
  getUsers: (page = 1, limit = 10) => 
    api.get('/admin/users', { params: { page, limit } }),
  getSpaces: (page = 1, limit = 10, filters?: any) =>
    api.get('/admin/spaces', { params: { page, limit, ...filters } }),
  updateSpaceStatus: (id: string, isActive: boolean) =>
    api.patch(`/admin/spaces/${id}/status`, { isActive }),
  updateUserRole: (id: string, role: 'user' | 'admin') =>
    api.patch(`/admin/users/${id}/role`, { role }),
  deleteUser: (id: string) => api.delete(`/admin/users/${id}`),
  deleteSpace: (id: string) => api.delete(`/admin/spaces/${id}`),
}

export default api