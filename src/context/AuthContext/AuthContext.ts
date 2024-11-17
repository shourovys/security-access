import { createContext } from 'react'
import { IAuthContext } from '../../types/context/auth'

const initialState: IAuthContext = {
  user: null,
  partition: null,
  license: null,
  layout: '',
  permissions: [],
  loading: true,
  isAuthenticated: false,
  logout: () => null,
  login: () => null,
  refresh: () => null,
  has_license: () => false,
  showPartition: true,
}

// Create the AuthContext with initial value
const AuthContext = createContext<IAuthContext>(initialState)

export default AuthContext
