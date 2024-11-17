import { ISelectOption } from '../../components/atomic/Selector'
import t from '../../utils/translator'

export interface IMiscellaneousResult {
  No: number
  Language: number
  DateFormat: number
  TimeFormat: number
  Latitude: number
  Longitude: number
  BigEndian32: number
  BigEndian56: number
}

export interface IMiscellaneousFormData {
  Language: ISelectOption | null
  DateFormat: ISelectOption | null
  TimeFormat: ISelectOption | null
  Latitude: string
  Longitude: string
  BigEndian32: ISelectOption | null
  BigEndian56: ISelectOption | null
}

export const bigEndianOptions = [
  { label: t`Little Endian`, value: '0' },
  { label: t`Big Endian`, value: '1' },
]

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
  { label: `Spanish`, value: '4' },
  { label: `Korean`, value: '5' },
  { label: `Chinese`, value: '6' },
]
