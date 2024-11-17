import { errorToast } from './toast'

const executeCallbackIfRowSelected = (
  disabled: boolean,
  callback: () => void,
  message = 'Select a table row'
) => {
  if (disabled) {
    errorToast(message)
    return
  }
  callback()
}

export default executeCallbackIfRowSelected
