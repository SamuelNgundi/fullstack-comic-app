import AuthContext from '@/contexts/AuthProvider'
import { useContext } from 'react'

export const useAuthState = () => {
  const context = useContext(AuthContext)

  if (!context) {
    throw Error('useAuthState must be used inside an AuthContextProvider')
  }

  return context
}
