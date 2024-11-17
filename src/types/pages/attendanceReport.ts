import { IApiQueryParamsBase } from './common'

export interface IAttendanceResult {
  LogNo: number
  // PersonName: string;
  InTime: number | null
  OutTime: number | null
  FirstName: string
  LastName: string
}
export interface IAttendanceReportFilters {
  FirstName: string
  LastName: string
  InTime: string
  OutTime: string
  Reference: string
  Apply: boolean
}

export interface IAttendanceReportApiQueryParams extends IApiQueryParamsBase {
  FirstName?: string
  LastName?: string
  InTime?: string
  OutTime?: string
  Apply?: boolean
}

export type IAttendanceReportStoreQueryParams = Omit<
  IAttendanceReportApiQueryParams,
  'offset' | 'limit'
>
