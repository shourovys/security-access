import React from 'react'
import { TButtonColor, TButtonSize } from '../../types/components/buttons'
import { TIcon } from '../../utils/icons'

interface IActionButtonBase {
  color?: TButtonColor
  icon?: TIcon
  text: string
  iconClass?: string
  isLoading?: boolean
  size?: TButtonSize
  disabled?: boolean
}

export interface IActionsButtonWithOnClick extends IActionButtonBase {
  link?: never
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void
  handleFile?: never
}

export interface IActionsButtonWithLink extends IActionButtonBase {
  link: string
  onClick?: never
  handleFile?: never
}

export interface IActionsButtonWithFileUpload extends IActionButtonBase {
  type: string
  accept?: string
  handleFile: (file: File) => void
  link?: never
  onClick?: never
}

export type IActionsButton =
  | IActionsButtonWithOnClick
  | IActionsButtonWithLink
  | IActionsButtonWithFileUpload

type GroupName = 'Modify' | 'Control' | 'DB'

export type IActionButtonsGroup = {
  [key in GroupName]?: IActionsButton[]
}
