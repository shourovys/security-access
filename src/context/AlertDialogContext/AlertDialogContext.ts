import { createContext } from 'react'
import { IAlertDialogContext } from '../../types/context/alert'

const initialState: IAlertDialogContext = {
  open: false,
  message: null,
  openAlertDialog: () => {},
  openAlertDialogWithPromise: () => {},
  closeAlertDialog: () => {},
  onAgree: () => {},
  onDisagree: () => {},
}

const AlertDialogContext = createContext<IAlertDialogContext>(initialState)

export default AlertDialogContext
