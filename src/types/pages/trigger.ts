import { ISelectOption } from '../../components/atomic/Selector'
import { IApiQueryParamsBase } from './common'
import { IPartitionResult } from './partition'

export interface ITriggerResult {
  TriggerNo: number
  Partition: IPartitionResult
  PartitionNo: number
  TriggerName: string
  TriggerDesc: string
}

export interface ITriggerFilters {
  TriggerNo: string
  TriggerName: string
  Partition: ISelectOption | null
  Apply: boolean
}

export interface ITriggerRouteQueryParams {
  page: number
  TriggerNo: string
  TriggerName: string
  PartitionValue: string | undefined
  PartitionLabel: string | undefined
}

export interface ITriggerApiQueryParams extends IApiQueryParamsBase {
  TriggerNo_icontains?: string
  TriggerName_icontains?: string
  PartitionNo?: string
}

export interface ITriggerFormData {
  TriggerName: string
  TriggerDesc: string
  Partition: ISelectOption | null
}
