import { useEffect, useState } from 'react'

function useStateWithCallback<T>(
  initialState: T,
  callback: (state: T) => void
): [T, (state: T) => void] {
  const [state, setState] = useState<T>(initialState)

  useEffect(() => {
    callback(state)
  }, [state, callback])

  return [state, setState]
}

export default useStateWithCallback
