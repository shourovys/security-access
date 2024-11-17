import { ISelectOption } from '../../components/atomic/Selector'
import { IApiQueryParamsBase } from './common'
import { IPartitionResult } from './partition'
import { IScheduleResult } from './schedule'

export interface IEventActionResult {
  EventActionNo: number // Event Action No (Primary Key)
  Partition: IPartitionResult
  PartitionNo: number // Partition No (Partitions -> PartitionNo)
  EventActionName: string
  EventActionDesc: string
  ScheduleNo: number // Schedule No (Schedules -> ScheduleNo)
  Schedule: IScheduleResult
}

export interface IEventActionFilters {
  EventActionNo: string
  EventActionName: string
  Partition: ISelectOption | null
  Apply: boolean
}

export interface IEventActionRouteQueryParams {
  page: number
  EventActionNo: string
  EventActionName: string
  PartitionValue: string | undefined
  PartitionLabel: string | undefined
}

export interface IEventActionApiQueryParams extends IApiQueryParamsBase {
  EventActionNo_icontains?: string
  EventActionName_icontains?: string
  PartitionNo?: string
}

export interface IEventActionFormData {
  EventActionName: string
  EventActionDesc: string
  Partition: ISelectOption | null
  Schedule: ISelectOption | null
}
