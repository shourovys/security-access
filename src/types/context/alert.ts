import { IPromiseToastMessageOptions } from '../../utils/toast'

export interface IAlertDialogContext {
  open: boolean
  message: string | null
  openAlertDialog: (callBack: () => void, message?: string | null) => void
  openAlertDialogWithPromise: (
    promiseCallBack: () => Promise<unknown>,
    promiseToastMessageOptions?: IPromiseToastMessageOptions,
    message?: string | null
  ) => void
  closeAlertDialog: () => void
  onAgree: () => void
  onDisagree: () => void
}

export interface IAlertDialogState {
  open: boolean
  message: string | null
  callBack?: () => void
  promiseCallBack?: () => Promise<unknown>
  promiseToastOptions?: IPromiseToastMessageOptions
}

// Define the actions that can modify the state
export type IAlertDialogAction =
  | { type: 'OPEN'; callBack: () => void; message: string | null }
  | {
      type: 'OPEN_PROMISE'
      promiseCallBack: () => Promise<unknown>
      promiseToastOptions: IPromiseToastMessageOptions
      message: string | null
    }
  | { type: 'CLOSE' }
