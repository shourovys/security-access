import { ISelectOption } from '../../components/atomic/Selector'
import { IGroupElementResult } from '../hooks/selectData'
import { IAccessResult } from './access'
import { IFormatResult } from './format'

export interface IInviteResult {
  No: number
  Enable: number
  FormatNo: number
  MaxTime: number
  MaxCount: number
  InviteAccess: number
  AccessSelect: number
  Accesses: IAccessResult[] | null
  Groups: IGroupElementResult[] | null
  Format?: IFormatResult
}

export interface IInviteFormData {
  Enable: ISelectOption | null
  Format: ISelectOption | null
  MaxTime: string
  MaxCount: string
  InviteAccess: ISelectOption | null
  AccessSelect: ISelectOption | null
  AccessIds: string[]
  GroupIds: string[]
}
