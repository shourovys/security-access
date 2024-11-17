import { ISelectOption } from '../../components/atomic/Selector'
import optionsToObject from '../../utils/optionsToObject'
import { IApiQueryParamsBase } from './common'
import t from '../../utils/translator'

export interface INvrResultOld {
  id: number
  created_at: string
  updated_at: string
  name: string
  description: string
  type: string
  ip_address: string
  rtsp_port: string
  data_port: string
  user_id: string
  password: string
}

export interface INvrResult {
  NvrNo: number // Primary Key
  NvrName: string
  NvrDesc: string
  NvrType: 0 | 1 | 2 // 0: Thumb Drive NVR, 1: DW Spectrum, 2: SpecoNVR
  IpAddress: string
  RtspPort: number
  DataPort: number // Hide ifNvrType!=0
  UserId: string
  Password: string
}

export interface INvrFilters {
  NvrNo: string
  NvrName: string
  NvrType: ISelectOption | null
  IpAddress: string
  Apply: boolean
}

export interface INvrRouteQueryParams {
  page: number
  NvrNo: string
  NvrName: string
  IpAddress: string
  NvrTypeValue: string | undefined
  NvrTypeLabel: string | undefined
}

export interface INvrApiQueryParams extends IApiQueryParamsBase {
  NvrNo_icontains?: string
  NvrName_icontains?: string
  IpAddress_icontains?: string
  NvrType?: string
}

export interface INvrFormData {
  NvrName: string
  NvrDesc: string
  NvrType: ISelectOption | null
  IpAddress: string
  RtspPort: string
  DataPort: string
  UserId: string
  Password: string
}

export const nvrTypeOptions = [
  {
    label: t`Thumb Drive NVR`,
    value: '0',
  },
  {
    label: t`DW Spectrum`,
    value: '1',
  },
  {
    label: t`SpecoNVR`,
    value: '2',
  },
]

export const nvrTypeObject = optionsToObject(nvrTypeOptions)

// interface INvrTypeFind {
//   [key: string]: string
// }

// export const NVR_TYPE_FIND: INvrTypeFind = {
//   thumb_drive_nvr: 'Thumb Drive NVR',
//   dw_spectrum_nvr: 'DW Spectrum NVR',
// }
