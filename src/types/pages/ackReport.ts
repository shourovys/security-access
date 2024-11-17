import { IApiQueryParamsBase } from './common'

export interface IAckReportFilters {
  LogNo: string
  EventTime: string
  EventName: string
  DeviceName: string
  PersonName: string
  AckTime: string
  AckUser: string
  Reference: string
  Apply: boolean
}

export interface IAckReportApiQueryParams extends IApiQueryParamsBase {
  LogNo?: string
  EventTime?: string
  EventName?: string
  DeviceName?: string
  PersonName?: string
  AckTime?: string
  AckUser?: string
  Reference?: string
}

export type IAckReportStoreQueryParams = Omit<IAckReportApiQueryParams, 'offset' | 'limit'>
