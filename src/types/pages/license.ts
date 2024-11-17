import { ISelectOption } from '../../components/atomic/Selector'
import t from '../../utils/translator'
import { IOemResult } from './login'

export interface ILicenseResult {
  No: number
  OemName: string
  Key: string
  NodeType: number
  Elevator: number
  Mac: string
  Product: number
  Model: number
  Type: number
  Options: string
  OptionsStr: string
  OemNo: number
  OemInfo?: IOemResult
  Camera: number
  Channel: number
  Lockset: number
  Facegate: number
  Subnode: number
  ContLock: number
  Intercom: number
  Licensed: number
  Eula: number
}

export interface IGetLicenseResult {
  OemName: string
  LicenseKey: string
  Mac: string
  Product: number
  Model: number
  Type: number
  Options: string
  OptionsStr: string
  OemNo: number
  Camera: number
  Channel: number
  Lockset: number
  Facegate: number
  Subnode: number
  ContLock: number
}

export interface ILicenseDetailsResult {
  License: ILicenseResult
  LicenseInitUrl: string
  LicenseUpgradeUrl: string
}

export interface IGetLicenseDetailsResult {
  LicenseStatus: 'Valid' | 'Invalid'
  License: IGetLicenseResult
  LicenseInitUrl: string
  LicenseUpgradeUrl: string
}

export interface ICapacityResult {
  id: number
  name: string
  total: number
  used: number
  remain: number
}

export interface ILicenseFormData {
  Key: string
  NodeType: ISelectOption | null
  Elevator: ISelectOption | null
  Mac: string
  Product: string
  Model: string
  Type: string
  Options: string
  OptionsStr: string
  Oem: string
  Camera: string
  Channel: string
  Lockset: string
  Facegate: string
  Subnode: string
  ContLock: string
  Intercom: string
  Licensed: string
  Eula: string
}

export interface ILicenseCustomerUpdateFormData {
  FirstName: string
  LastName: string
  Company: string
  Email: string
  Phone: string
  Address: string
  InstallType: string
  Suggestion: string
}

export const licenseProductsOptions = [
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
  {
    label: t`8 Door`,
    value: '8',
  },
]

export const licenseModelsTypesOptions = [
  {
    label: t`Advantage`,
    value: '1',
  },
  {
    label: t`Professional`,
    value: '2',
  },
  {
    label: t`Corporate`,
    value: '3',
  },
]

export const licenseNodeTypesOptions = [
  {
    label: t`Manager`,
    value: '1',
  },
  {
    label: t`Worker`,
    value: '2',
  },
]
