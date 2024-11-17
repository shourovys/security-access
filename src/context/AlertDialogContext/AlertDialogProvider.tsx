import { ReactNode, useReducer } from 'react'
import { IAlertDialogAction, IAlertDialogState } from '../../types/context/alert'
import { IPromiseToastMessageOptions, promiseToast } from '../../utils/toast'
import AlertDialogContext from './AlertDialogContext'

// Define the initial state for the alert dialog
const initialState: IAlertDialogState = {
  open: false,
  message: null,
}

// Reducer function to handle state transitions for the alert dialog
const alertDialogReducer = (
  state: IAlertDialogState,
  action: IAlertDialogAction
): IAlertDialogState => {
  switch (action.type) {
    case 'OPEN':
      // Open the alert dialog with the provided message and callback
      return { ...state, open: true, message: action.message, callBack: action.callBack }
    case 'OPEN_PROMISE':
      // Open the alert dialog with a promise callback and optional toast message options
      return {
        ...state,
        open: true,
        message: action.message,
        promiseCallBack: action.promiseCallBack,
        promiseToastOptions: action.promiseToastOptions,
      }
    case 'CLOSE':
      // Close the alert dialog and reset its properties
      return {
        ...state,
        open: false,
        message: null,
        callBack: undefined,
        promiseCallBack: undefined,
        promiseToastOptions: undefined,
      }
    default:
      return state
  }
}

interface IAlertDialogProviderProps {
  children: ReactNode | ReactNode[]
}

const AlertDialogProvider = ({ children }: IAlertDialogProviderProps) => {
  // Use reducer to manage the state of the alert dialog
  const [state, dispatch] = useReducer(alertDialogReducer, initialState)

  // Function to open the alert dialog with a regular callback
  const openAlertDialog = (callBack: () => void, message?: string | null) => {
    dispatch({ type: 'OPEN', callBack, message: message || null })
  }

  // Function to open the alert dialog with a promise callback and toast message options
  const openAlertDialogWithPromise = (
    promiseCallBack: () => Promise<unknown>,
    promiseToastMessageOptions?: IPromiseToastMessageOptions,
    message?: string | null
  ) => {
    dispatch({
      type: 'OPEN_PROMISE',
      promiseCallBack,
      promiseToastOptions: promiseToastMessageOptions || {},
      message: message || null,
    })
  }

  // Function to close the alert dialog
  const closeAlertDialog = async () => {
    dispatch({ type: 'CLOSE' })
  }

  // Function to handle the "Agree" action in the alert dialog
  const onAgree = async () => {
    if (state.callBack) {
      // Execute the regular callback and close the alert dialog
      state.callBack()
      await closeAlertDialog()
    }

    if (state.promiseCallBack) {
      // Execute the promise callback, show a toast message, and close the alert dialog
      await closeAlertDialog()
      await promiseToast(state.promiseCallBack(), state.promiseToastOptions || {})
    }
  }

  // Function to handle the "Disagree" action in the alert dialog
  const onDisagree = () => {
    closeAlertDialog()
  }

  // Provide the alert dialog context with the required values and functions
  return (
    <AlertDialogContext.Provider
      value={{
        open: state.open,
        message: state.message,
        openAlertDialog,
        closeAlertDialog,
        openAlertDialogWithPromise,
        onAgree,
        onDisagree,
      }}
    >
      {children}
    </AlertDialogContext.Provider>
  )
}

export default AlertDialogProvider
