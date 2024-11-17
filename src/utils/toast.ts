// @ts-nocheck
import {
  DefaultToastOptions,
  Renderable,
  resolveValue,
  toast,
  ValueOrFunction,
} from 'react-hot-toast'
import t from './translator'

type toastFunction = (message?: string) => string

export const addSuccessfulToast: toastFunction = (message = 'Success') =>
  toast.success(t(message), {
    icon: '✅',
  })

export const editSuccessfulToast: toastFunction = (message = 'Success') =>
  toast.success(t(message), {
    icon: '✅',
  })

export const groupEditSuccessfulToast: toastFunction = (message = 'Success') =>
  toast.success(t(message), {
    icon: '✅',
  })

export const bulkEditSuccessfulToast: toastFunction = (message = 'Success') =>
  toast.success(t(message), {
    icon: '✅',
  })

export const exportSuccessfulToast: toastFunction = (message = 'Success') =>
  toast.success(t(message), {
    icon: '✅',
  })

export const importSuccessfulToast: toastFunction = (message = 'Success') =>
  toast.success(t(message), {
    icon: '✅',
  })

export const ReloadSuccessfulToast: toastFunction = (message = 'Success') => {
  const loadingToastId = toast.loading('Loading...')

  try {
    // Simulate an asynchronous action (replace this with your actual asynchronous code)
    setTimeout(() => {
      // After the simulated asynchronous action, dismiss the loading toast
      toast.dismiss(loadingToastId)

      // Show success state
      toast.success(t(message), { icon: '✅' })
    }, 400) // Simulating a 1-second delay
  } catch (error) {
    // Handle errors if necessary
  }
}

// export const deleteSuccessfulToast: toastFunction = (message = 'Successful') =>
//   toast.success(message)

export const errorToast: toastFunction = (message = 'Failed!') =>
  toast.error(t(message), {
    icon: '❌',
  })

export const warningToast: toastFunction = (message = 'Warning!') =>
  toast(t(message), {
    icon: '⚠️',
  })

export type IPromiseToastMessageOptions = { loading?: string; success?: string; error?: string }

const toastPromise = <T>(
  promise: Promise<T>,
  msgs: {
    loading: Renderable
    success: ValueOrFunction<Renderable, T>
  },
  opts?: DefaultToastOptions
) => {
  const id = toast.loading(msgs.loading, { ...opts, ...opts?.loading })

  promise
    .then((p) => {
      toast.success(resolveValue(msgs.success, p), {
        id,
        ...opts,
        ...opts?.success,
      })
      return p
    })
    .catch((e) => {
      id && toast.dismiss(id)
    })
  return promise
}

export function promiseToast<T>(
  promise: Promise<T>,
  options: IPromiseToastMessageOptions
): Promise<T> {
  const { loading, success } = options
  return toastPromise(promise, {
    loading: t(loading || 'Loading...'),
    success: t(success || 'Success'),
  })
}
