import useSWR from 'swr'

type UseSWRGlobalStateReturn<T> = [T, (value: T | Promise<T>) => Promise<void>]

const useSWRGlobalState = <T>(
  key: string,
  initialData: T,
  revalidateOnMount = true
): UseSWRGlobalStateReturn<T> => {
  const { data, mutate } = useSWR<T>(key, () => initialData, {
    revalidateOnMount,
  })

  const setValue = async (value: T | Promise<T>) => {
    await mutate(value, false)
  }

  return [data ?? initialData, setValue]
}

export default useSWRGlobalState

// import { useEffect } from 'react'
// import useSWR from 'swr'

// type UseSWRGlobalStateReturn<T> = [T, (value: T | Promise<T>) => Promise<void>]

// const useSWRGlobalState = <T>(
//   key: string,
//   initialData: T,
//   revalidateOnMount = true
// ): UseSWRGlobalStateReturn<T> => {
//   const storedInitValue = JSON.parse(window.sessionStorage.getItem(key) || 'null')

//   const { data, mutate } = useSWR<T>(key, () => storedInitValue || initialData, {
//     revalidateOnMount,
//   })

//   const setValue = async (value: T | Promise<T>) => {
//     await mutate(value, false)
//     window.sessionStorage.setItem(key, JSON.stringify(value))
//   }

//   // When the component mounts, check if there is a value in session storage
//   // and update the state with it if it exists
//   useEffect(() => {
//     const storedValue = window.sessionStorage.getItem(key)
//     if (storedValue) {
//       const parsedValue = JSON.parse(storedValue)
//       if (parsedValue !== data) {
//         mutate(parsedValue, false)
//       }
//     }
//   }, [])

//   return [data ?? initialData, setValue]
// }

// export default useSWRGlobalState
