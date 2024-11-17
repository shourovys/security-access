import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const RedirectComponent = () => {
  const navigate = useNavigate()

  useEffect(() => {
    navigate('/dashboard')
  }, [navigate])

  return null
}

export default RedirectComponent
