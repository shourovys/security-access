import axios from 'axios'
import { API_URL, LOCAL_STORAGE_KEY } from '../utils/config'

const Axios = axios.create({
  baseURL: API_URL,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
  withCredentials: true,
})

Axios.interceptors.request.use((config) => {
  const token = window.sessionStorage.getItem(LOCAL_STORAGE_KEY.accessToken)
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})
export default Axios
