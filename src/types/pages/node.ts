import { ISelectOption } from '../../components/atomic/Selector'
import optionsToObject from '../../utils/optionsToObject'
import t from '../../utils/translator'
import { IApiQueryParamsBase } from './common'
import { licenseNodeTypesOptions } from './license'

export interface INodeResultOld {
  id: number
  created_at: string
  updated_at: string
  name: string
  description?: string | null
  mac: string
  product: string
  model: string
  type: string
  oem_no: number
  version: null | string
  address: null | string
  timezone: null | string
  online: boolean
  power_fault_type: string
  tamper_type: string
  power_fault_stat: boolean
  tamper_stat: boolean
}

export interface INodeResult {
  NodeNo: number // Primary Key
  NodeName: string
  Validate: string // Unique
  NodeDesc: string
  NodeType: number // 1: Master, 2: Worker
  Elevator: number // 0: No, 1: Yes
  Mac: string // Unique
  Product: number // 0: Server, 1: 1 Door, 2: 2 Door, 4: 4 Door
  Model: number // 1: Advantage, 2: Professional, 3: Corporate
  Type: number // 1 ~ 512
  OemNo: number
  Oem: {
    OemNo: number
    OemName: string
  } | null
  Version: string
  Address: string
  Timezone: string
  Online: number // 0: No, 1: Yes
  PowerFaultType: number // 0: NO, 1: NC
  TamperType: number // 0: NO, 1: NC
  PowerFaultStat: number // 0: Inactive, 1: Active
  TamperStat: number // 0: Inactive, 1: Active
}

export interface ITempResult {
  TempNo: number
  NodeType: number
  Elevator: number
  Mac: string
  Product: number
  Model: number
  Type: number
  OemNo: number
  Version: string
  Address: string
  Timezone: string
}

export interface INodeFilters {
  NodeNo: string
  NodeName: string
  Mac: string
  Address: string
  Apply: boolean
}

export interface INodeRouteQueryParams {
  page: number
  NodeNo: string
  NodeName: string
  Mac: string
  Address: string
}

export interface INodeApiQueryParams extends IApiQueryParamsBase {
  NodeNo_icontains?: string
  NodeName_icontains?: string
  Mac_icontains?: string
  Address_icontains?: string
}

export interface INodeFormData {
  NodeName: string
  NodeDesc: string
  Mac: string
  PowerFaultType: ISelectOption | null
  TamperType: ISelectOption | null
}

export interface INodeInfoFormData {
  NodeName: string
  NodeDesc: string
  Mac: string
  Product: string
  Model: string
  Type: string
  OemNo: number
  Oem: null | {
    OemNo: number
    OemName: string
  }
  Version: null | string
  Address: null | string
  Timezone: null | string
  Online: string
  PowerFaultType: string
  TamperType: string
  PowerFaultStat: string
  TamperStat: string
}

export interface INodeSetTimeFormData {
  Timezone: ISelectOption | null
  Ntp: ISelectOption | null // 0: No (Manual), 1: Yes (NTP)
}

export interface INodeSwSyncFormData {
  MediaType: ISelectOption | null
  File: FileList | null
  FileName: ISelectOption | null
}

export const nodeSwSyncMediaOptions = [
  {
    label: t`User PC`,
    value: '0',
  },
  {
    label: t`Update Server`,
    value: '1',
  },
  {
    label: t`FTP Server`,
    value: '2',
  },
]

export const nodeSwSyncMediaOptionsWithLabel = [
  {
    label: t`User PC`,
    value: 'UserPC',
  },
  {
    label: t`Update Server`,
    value: 'UpdateServer',
  },
  {
    label: t`FTP Server`,
    value: 'FTPServer',
  },
]

export const nodeProductTypeOptions = [
  {
    label: t`Server`,
    value: '0',
  },
  {
    label: t`1 Door`,
    value: '1',
  },
  {
    label: t`2 Door`,
    value: '2',
  },
  {
    label: t`4 Door`,
    value: '4',
  },
]
export const nodeProductTypeObject = optionsToObject(nodeProductTypeOptions)

export const nodeTypeObject = optionsToObject(licenseNodeTypesOptions)

export const nodeModelTypeOptions = [
  { label: t`Advantage`, value: '1' },
  { label: t`Professional`, value: '2' },
  { label: t`Corporate`, value: '3' },
]

export const nodeModelTypeObject = optionsToObject(nodeModelTypeOptions)
export const nodeFaultTypeOptions = [
  { label: t`NO`, value: '0' },
  { label: t`NC`, value: '1' },
]

export const nodeFaultTypeObject = optionsToObject(nodeFaultTypeOptions)
