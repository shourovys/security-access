import { IApiQueryParamsBase } from './common'
import Page from './../../components/HOC/Page'

export interface IGuardReportResult {
  LogNo: number
  DeviceName: string
  EventTime: number
  CredentialNumb: number
  PersonName: string
}

export interface IGuardReportFilters {
  DeviceName: string
  EventTime: string
  PersonName: string
  CredentialNumb: string
  Apply: boolean
  Reference: string
}

export interface IGuardReportApiQueryParams extends IApiQueryParamsBase {
  DeviceName?: string
  EventTime?: string
  PersonName?: string
  CredentialNumb?: string
  Reference?: string
  Apply?: boolean
}

export type IGuardReportStoreQueryParams = Omit<IGuardReportApiQueryParams, 'offset' | 'limit'>
