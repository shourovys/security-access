import { TIcon } from '../../utils/icons'
import { TIconButtonColor } from './buttons'
import React from 'react'

interface IIconButtonBase {
  color?: TIconButtonColor
  icon: TIcon
  tooltip: string
  iconClass?: string
  disabled?: boolean
  disabledText?: string
}

// export interface IIconButtonWithOnClick extends IIconButtonBase {
//   link?: never
//   onClick: (event: React.MouseEvent<HTMLButtonElement>) => void
// }

// export interface IIconButtonWithLink extends IIconButtonBase {
//   link: string
//   onClick?: never
// }

// export type IIconButton = IIconButtonWithOnClick | IIconButtonWithLink

export interface IIconButton {
  color?: TIconButtonColor
  icon: TIcon
  tooltip?: string
  iconClass?: string
  disabled?: boolean
  disabledText?: string
  link?: string
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void
}
