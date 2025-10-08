import { Toaster } from 'react-hot-toast'

export const ToastProvider: React.FC = () => {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 5000,
        style: {
          background: '#fff',
          color: '#374151',
          boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
          borderRadius: '0.5rem',
          border: '1px solid #e5e7eb',
          padding: '12px 16px',
        },
        success: {
          iconTheme: {
            primary: '#10b981',
            secondary: '#fff',
          },
        },
        error: {
          iconTheme: {
            primary: '#ef4444',
            secondary: '#fff',
          },
        },
      }}
    />
  )
}