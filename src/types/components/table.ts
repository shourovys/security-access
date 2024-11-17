import React from 'react'
import { TIconButtonColor } from '../../types/components/buttons'
import { TIcon } from '../../utils/icons'

interface ITableHeadBase {
  id: string
  label: string
}

export interface ITableHeadWithFilter extends ITableHeadBase {
  filter: boolean
  checkboxValue?: never
  checkboxAction?: never
}

export interface ITableHeadWithCheckbox extends ITableHeadBase {
  filter?: never
  checkboxValue: boolean
  checkboxAction: (name: string, value: boolean, allRowsNos: unknown) => void
}

export type ITableHead = ITableHeadWithFilter | ITableHeadWithCheckbox

export interface ITableAction {
  icon: TIcon
  tooltip: string
  color?: TIconButtonColor
  iconClass?: string
  disabled?: boolean
  link?: string
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void
}
