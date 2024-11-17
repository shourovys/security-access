import { AxiosError, AxiosRequestConfig } from 'axios'
import { SWRConfiguration } from 'swr'
import { IServerCommandErrorResponse, IServerErrorResponse } from '../types/pages/common'
import serverErrorHandler from '../utils/serverErrorHandler'
import Axios from './apiConfig'

export const fetcher = async (url: string) => {
  const res = await Axios.get(url)
  return res.data
}

export const swrConfig: SWRConfiguration = {
  fetcher,
  // dedupingInterval: 100,
  // refreshInterval: 100,
  revalidateOnFocus: false,
  revalidateOnReconnect: true,
  revalidateOnMount: true,
  refreshWhenOffline: true,
  shouldRetryOnError: false,
  onError: (error: AxiosError<IServerErrorResponse | IServerCommandErrorResponse>) => {
    serverErrorHandler(error)
  },
}

export const onErrorRetry =
  () =>
  (
    error: AxiosError,
    revalidate: (retryCount: { retryCount: number }) => void,
    { retryCount }: { retryCount: number }
  ) => {
    // Never retry on 404.
    if (error.status === 404) return

    // Only retry up to 10 times.
    if (retryCount >= 2) return

    // Retry after 5 seconds.
    setTimeout(() => revalidate({ retryCount }), 1500)
  }

export async function sendPostRequest<T>(url: string, { arg }: { arg: T }) {
  return Axios.post(url, arg)
    .then((res) => res.data)
    .catch((error) => {
      throw error
    })
}

export async function sendPostRequestWithFile<
  T extends { [s: string]: string | Blob | File | unknown } | FormData,
>(url: string, { arg }: { arg: T }) {
  if (arg instanceof FormData) {
    return Axios.post(url, arg, { headers: { 'Content-Type': 'multipart/form-data' } })
      .then((res) => res.data)
      .catch((error) => {
        throw error
      })
  }

  const formData = new FormData()

  Object.entries(arg).forEach(([key, value]) => {
    if (typeof value !== 'undefined' && value !== null) {
      if (value instanceof File) {
        formData.append(key, value, value.name)
      } else if (typeof value === 'object' && Array.isArray(value)) {
        formData.append(key, JSON.stringify(JSON.stringify(value)))
        // if (value.length) {
        //     value.forEach((id, index) => {
        //         formData.append(`${key}[${index}]`, id);
        //     });
        // } else {
        //     formData.append(key, "null");
        // }
      } else if (typeof value === 'object') {
        const jsonValue = JSON.stringify(value)
        const blobValue = new Blob([jsonValue], {
          type: 'application/json',
        })

        formData.append(key, blobValue, `${key}.json`)
      } else {
        formData.append(key, value.toString())
      }
    }
  })
  const headers = {
    'Content-Type': 'multipart/form-data',
    // Add any additional headers here
  }

  return Axios.post(url, formData, { headers })
    .then((res) => res.data)
    .catch((error) => {
      throw error
    })
}

export async function sendPostRequestWithFileAndProgress<T>(
  url: string,
  {
    arg,
  }: {
    arg: T
  }
) {
  if (arg instanceof FormData) {
    const headers = {
      'Content-Type': 'multipart/form-data',
      // Add any additional headers here
    }

    return Axios.post(url, arg, { headers })
      .then((res) => res.data)
      .catch((error) => {
        throw error
      })
  } else {
  }
}

export async function sendPutRequest<T>(url: string, { arg }: { arg: T }) {
  return Axios.put(url, arg)
    .then((res) => res.data)
    .catch((error) => {
      throw error
    })
}

export async function sendDeleteRequest<T extends AxiosRequestConfig>(
  url: string,
  data?: T['data']
) {
  return Axios.delete(url, { data: data?.arg?.data })
    .then((res) => res.data)
    .catch((error) => {
      throw error
    })
}

export async function sendMultiDeleteRequest<T>(url: string, { arg }: { arg: { data: T } }) {
  return Axios.delete(url, { data: arg?.data })
    .then((res) => res.data)
    .catch((error) => {
      throw error
    })
}

export async function sendDownloadRequest<T>(url: string, { arg }: { arg: T }) {
  return Axios.post(url, arg, {
    responseType: 'blob',
  }).then((res: { data: Blob }) => res.data)
}
