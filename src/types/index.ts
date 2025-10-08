export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  phone: string
  role: 'user' | 'admin'
  subscription?: Subscription
  createdAt: string
  updatedAt: string
  spacesCount?: number
}

export interface Subscription {
  id: string
  plan: 'basic' | 'medium' | 'premium'
  status: 'active' | 'canceled' | 'expired'
  currentPeriodEnd: string
  stripeSubscriptionId?: string
  stripeCustomerId?: string
  createdAt: string
  updatedAt: string
}

export interface Space {
  id: string
  title: string
  description: string
  address: string
  city: string
  state: string
  price: number
  capacity: number
  amenities: string[]
  images: string[]
  rating: number
  reviewCount: number
  isActive: boolean
  userId: string
  user: Pick<User, 'id' | 'name' | 'email' | 'phone' | 'subscription'>
  reviews?: Review[]
  createdAt: string
  updatedAt: string
}

export interface Review {
  id: string
  rating: number
  comment?: string
  userId: string
  user: Pick<User, 'id' | 'name' | 'avatar'>
  spaceId: string
  createdAt: string
}

export interface Plan {
  id: 'basic' | 'medium' | 'premium'
  name: string
  description: string
  price: number
  features: {
    listings: number
    images: number
    visibility: 'low' | 'medium' | 'high'
  }
}

export interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<User>
  register: (userData: RegisterData) => Promise<User>
  logout: () => void
  loading: boolean
  isAuthenticated: boolean
}

export interface RegisterData {
  name: string
  email: string
  password: string
  confirmPassword: string
}

export interface LoginData {
  email: string
  password: string
}

export interface SpaceFormData {
  title: string
  description: string
  address: string
  city: string
  state: string
  price: number
  capacity: number
  amenities: string[]
  images: File[]
}

export interface ApiError {
  message: string
  status: number
  errors?: Record<string, string[]>
}