import AlertDialogContext from '../context/AlertDialogContext/AlertDialogContext'
import { useContext } from 'react'
import { IAlertDialogContext } from '../types/context/alert'

export default function useAlert(): IAlertDialogContext {
  const context = useContext(AlertDialogContext)
  if (!context) {
    throw new Error('useAlertDialog must be used within an AlertDialogProvider')
  }
  return context
}
