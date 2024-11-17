import { useContext } from 'react'
import AuthContext from '../context/AuthContext/AuthContext'
import { IAuthContext } from '../types/context/auth'

const useAuth = () => {
  const context = useContext<IAuthContext>(AuthContext)

  if (!context) {
    throw new Error('Auth context must be used inside AuthProvider')
  }

  return context
}

export default useAuth
