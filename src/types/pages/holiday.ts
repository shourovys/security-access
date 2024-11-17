import { ISelectOption } from '../../components/atomic/Selector'
import { IApiQueryParamsBase } from './common'
import { IPartitionResult, IPartitionResultOld } from './partition'

export interface IHolidayResultOld {
  id: number
  partition: IPartitionResultOld
  created_at: string
  updated_at: string
  name: string
  description: string
  start_time: string
  end_time: string
}

export interface IHolidayResult {
  HolidayNo: number // Primary Key
  Partition: IPartitionResult
  HolidayName: string // Unique (PartitionNo,)
  HolidayDesc: string
}

export interface IHolidayFilters {
  HolidayNo: string
  HolidayName: string
  Partition: ISelectOption | null
  Apply: boolean
}

export interface IHolidayRouteQueryParams {
  page: number
  HolidayNo: string
  HolidayName: string
  PartitionValue: string | undefined
  PartitionLabel: string | undefined
}

export interface IHolidayApiQueryParams extends IApiQueryParamsBase {
  HolidayNo_icontains?: string
  HolidayName_icontains?: string
  PartitionNo?: string
}

export interface IHolidayFormData {
  Partition: ISelectOption | null
  HolidayName: string
  HolidayDesc: string
}

export interface IHolidayResult {
  HolidayNo: number // Primary Key
  Partition: IPartitionResult
  HolidayName: string // Unique (PartitionNo,)
  HolidayDesc: string
}
