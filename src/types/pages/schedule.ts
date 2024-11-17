import { ISelectOption } from '../../components/atomic/Selector'
import { IApiQueryParamsBase } from './common'
import { IHolidayResult, IHolidayResultOld } from './holiday'
import { IPartitionResult, IPartitionResultOld } from './partition'

export interface IScheduleResultOld {
  id: number
  holiday: IHolidayResultOld
  partition: IPartitionResultOld
  created_at: string
  updated_at: string
  name: string
  description: string
}

export interface IScheduleResult {
  ScheduleNo: number // Primary Key
  Partition: IPartitionResult // Partitions -> PartitionNo
  Holiday: IHolidayResult | null // Holidays -> HolidayNo
  ScheduleName: string
  ScheduleDesc: string
}

export interface IScheduleFilters {
  ScheduleNo: string
  ScheduleName: string
  Partition: ISelectOption | null
  Apply: boolean
}

export interface IScheduleRouteQueryParams {
  page: number
  ScheduleNo: string
  ScheduleName: string
  PartitionValue: string | undefined
  PartitionLabel: string | undefined
}

export interface IScheduleApiQueryParams extends IApiQueryParamsBase {
  ScheduleNo_icontains?: string
  ScheduleName_icontains?: string
  PartitionNo?: string
}

export interface IScheduleFormData {
  ScheduleName: string
  ScheduleDesc: string
  Partition: ISelectOption | null
  Holiday: ISelectOption | null
}

// export interface IScheduleFormDataOld {
//   name: string
//   description: string
//   partition: ISelectOption | null
//   holiday: ISelectOption | null
// }
