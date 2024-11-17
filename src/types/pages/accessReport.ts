import { ISelectOption } from '../../components/atomic/Selector'
import { IApiQueryParamsBase } from './common'
import t from '../../utils/translator'

export interface IAccessReportFilters {
  EventTime: string
  EventName: string
  Person: string
  PersonName: string
  CredentialNumber: string
  DeviceType: ISelectOption | null
  DeviceNo: string
  DeviceName: string
  Reader: ISelectOption | null
  Region: ISelectOption | null
  Reference: string
  Apply: boolean
}

export interface IAccessReportApiQueryParams extends IApiQueryParamsBase {
  EventTime?: string
  EventName?: string
  PersonNo?: string
  PersonName?: string
  CredentialNumber?: string
  DeviceType?: string
  DeviceNo?: string
  DeviceName?: string
  ReaderNo?: string
  RegionNo?: string
  Reference?: string
  Apply?: boolean
}

export type IAccessReportStoreQueryParams = Omit<IAccessReportApiQueryParams, 'offset' | 'limit'>

export const accessReportDeviceTypeOptions = [
  { value: '2', label: t('Door') },
  { value: '6', label: t('Elevator') },
  { value: '12', label: t('Lockset') },
  { value: '13', label: t('Facegate') },
  { value: '18', label: t('Intercom') },
]
