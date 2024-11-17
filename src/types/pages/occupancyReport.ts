import { IApiQueryParamsBase } from './common'
import t from '../../utils/translator'
import { ISelectOption } from '../../components/atomic/Selector'

export interface IOccupancyResult {
  LogNo: number
  EventTime: number
  RegionName: string
  Duration: number
  FirstName: string
  LastName: string
}
export interface IOccupancyReportFilters {
  EventTime: string
  FirstName: string
  LastName: string
  Duration: string
  ResetTime: string
  Region: ISelectOption | null
  Reference: string
  Apply: boolean
}

export interface IOccupancyReportApiQueryParams extends IApiQueryParamsBase {
  EventTime?: string
  ResetTime?: string
  FirstName?: string
  LastName?: string
  Duration?: string
  Reference?: string
  Apply?: boolean
}

export type IOccupancyReportStoreQueryParams = Omit<
  IOccupancyReportApiQueryParams,
  'offset' | 'limit'
>
