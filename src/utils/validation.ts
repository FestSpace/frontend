import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
})

export const registerSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres').max(50),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'As senhas não coincidem',
  path: ['confirmPassword'],
})

export const spaceSchema = z.object({
  title: z.string().min(5, 'Título deve ter pelo menos 5 caracteres').max(100),
  description: z.string().min(20, 'Descrição deve ter pelo menos 20 caracteres').max(2000),
  address: z.string().min(10, 'Endereço deve ter pelo menos 10 caracteres'),
  city: z.string().min(2, 'Cidade é obrigatória'),
  state: z.string().length(2, 'Estado deve ter 2 caracteres'),
  price: z.number().min(1, 'Preço deve ser maior que 0'),
  capacity: z.number().min(1, 'Capacidade deve ser maior que 0'),
  amenities: z.array(z.string()).min(1, 'Selecione pelo menos um amenidade'),
})

export const reviewSchema = z.object({
  rating: z.number().min(1, 'Avaliação é obrigatória').max(5),
  comment: z.string().min(10, 'Comentário deve ter pelo menos 10 caracteres').max(500).optional(),
})