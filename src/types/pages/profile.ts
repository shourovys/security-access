import { ISelectOption } from '../../components/atomic/Selector'
import t from '../../utils/translator'
import { IUserResult } from './user'

export interface IProfileResult {
  user: IUserResult
}

export interface IProfileFormData {
  UserId: string
  OldPassword: string
  NewPassword: string

  ConfirmPassword: string
  Email: string
  UserDesc: string
  Launch: ISelectOption | null
  Language: ISelectOption | null
  DateFormat: ISelectOption | null
  TimeFormat: ISelectOption | null
}

export const dateFormatOptions = [
  { label: t`YYYY-MM-DD`, value: '0' },
  { label: t`MM/DD/YYYY`, value: '1' },
  { label: t`DD/MM/YYYY`, value: '2' },
]

export const timeFormatOptions = [
  { label: t`24 Hour`, value: '0' },
  { label: t`12 Hour`, value: '1' },
]

export const LanguageOptions = [
  { label: `Generic`, value: '0' },
  { label: `English`, value: '1' },
  { label: `French`, value: '2' },
  { label: `German`, value: '3' },
  { label: `Spanish`, value: '4' }
]
