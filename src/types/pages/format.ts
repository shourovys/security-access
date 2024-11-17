import { ISelectOption } from '../../components/atomic/Selector'
import optionsToObject from '../../utils/optionsToObject'
import { IApiQueryParamsBase } from './common'
import t from '../../utils/translator'

export interface IFormatResultOld {
  id: number
  created_at: string
  updated_at: string
  name: string
  description: string
  default_format: boolean
  key_format: boolean
  total_length: number
  facility_code: number
  facility_start: number
  facility_length: number
  number_start: number
  number_length: number
  priority_type_1: string
  priority_position_1: number
  priority_start_1: number
  priority_length_1: number
  priority_type_2: string
  priority_position_2: number
  priority_start_2: number
  priority_length_2: number
}

export interface IFormatResult {
  FormatNo: number // Primary Key
  FormatName: string
  Validate: string // Unique
  FormatDesc?: string
  DefaultFormat: number // 0: No, 1: Yes - Only one default format
  FormatType?: number // 0: Normal, 1: Keypad, 2: QRCode*, 3: MobileCredential* - Only one QRCode and MobileCredential format
  NapcoFormat: number // Napco Format 0: No, 1: Yes
  BigEndian: number // Big Endian 0: No, 1: Yes
  TotalLength?: number // 1-256 - Validate
  FacilityCode?: number // Unique (TotalLength,)
  FacilityStart?: number // 1-TotalLength - Validate
  FacilityLength?: number // 0-TotalLength - Validate
  NumberStart?: number // 1-TotalLength - Validate
  NumberLength?: number // 0-TotalLength - Validate
  Parity1Type?: number // 0: None, 1: Odd, 2: Even
  Parity1Position?: number // 1-TotalLength - Validate
  Parity1Start?: number // 1-TotalLength - Validate - Hide if Parity1Type=0
  Parity1Length?: number // 0-TotalLength - Validate - Hide if Parity1Type=0
  Parity2Type?: number // 0: None, 1: Odd, 2: Even
  Parity2Position?: number // 1-TotalLength - Validate - Hide if Parity2Type=0
  Parity2Start?: number // 1-TotalLength - Validate - Hide if Parity2Type=0
  Parity2Length?: number // 0-TotalLength - Validate - Hide if Parity2Type=0
}

export interface IFormatFilters {
  FormatNo: string
  FormatName: string
  TotalLength: string
  FacilityCode: string
  Apply: boolean
}

export interface IFormatRouteQueryParams {
  page: number
  FormatNo: string
  FormatName: string
  TotalLength: string
  FacilityCode: string
}

export interface IFormatApiQueryParams extends IApiQueryParamsBase {
  FormatNo_icontains?: string
  FormatName_icontains?: string
  TotalLength_icontains?: string
  FacilityCode_icontains?: string
  Partition?: string
}

export interface IFormatFormData {
  FormatName: string
  FormatDesc: string
  DefaultFormat: ISelectOption | null
  FormatType: ISelectOption | null
  BigEndian: ISelectOption | null
  NapcoFormat: ISelectOption | null
  TotalLength: string
  FacilityCode: string
  FacilityStart: string
  FacilityLength: string
  NumberStart: string
  NumberLength: string
  Parity1Type: ISelectOption | null
  Parity1Position: string
  Parity1Start: string
  Parity1Length: string
  Parity2Type: ISelectOption | null
  Parity2Position: string
  Parity2Start: string
  Parity2Length: string
  CardData: string
  CardNumber: string
}

export const parityOptions = [
  { value: '0', label: t`None` },
  { value: '1', label: t`Odd` },
  { value: '2', label: t('Even') },
]
export const formatTypeOptions = [
  { value: '0', label: t`Normal` },
  { value: '1', label: t`Keypad` },
  { value: '2', label: t`QRCode` },
  { value: '3', label: t`Mobile Credential` },
  // { value: '4', label: t`Napco Format` },
]
export const formatTypeObject = optionsToObject(formatTypeOptions)
