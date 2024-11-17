import { useState } from 'react'

interface UseLocalStorage {
  <T>(key: string, initialValue: T): [T, (value: T | ((prevState: T) => T)) => void]
}

const useLocalStorage: UseLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState<typeof initialValue>(() => {
    if (typeof window === 'undefined') {
      return initialValue
    }
    try {
      const item = window.sessionStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      return initialValue
    }
  })

  const setValue = (
    value: typeof initialValue | ((prevState: typeof initialValue) => typeof initialValue)
  ) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value
      setStoredValue(valueToStore)
      if (typeof window !== 'undefined') {
        window.sessionStorage.setItem(key, JSON.stringify(valueToStore))
      }
    } catch (error) {
      // console.log(error)
    }
  }

  return [storedValue, setValue]
}

export default useLocalStorage
