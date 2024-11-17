import { ISelectOption } from '../../components/atomic/Selector'
import t from '../../utils/translator'
import { IApiQueryParamsBase } from './common'
import { IInputResult } from './input'
import { IOutputResult } from './output'
import { IPartitionResult, IPartitionResultOld } from './partition'

export interface IRegionResultOld {
  id: number
  partition: IPartitionResultOld
  created_at: string
  updated_at: string
  name: string
  description: string
  only_muster: boolean
  anti_passback_rule: boolean
  anti_passback_time: number
  anti_tailgate_rule: boolean
  occupancy_rule: boolean
  occupancy_limit: number
  deadman_rule: boolean
  deadman_interval: number
  deadman_output_no: number
  hazmat_rule: boolean
  hazmat_input_no: number
  hazmat_output_no: number
  reset_delay: number
  reset_time: number
  deadman_stat: boolean
  hazmat_stat: boolean
}

export interface IRegionResult {
  RegionNo: number
  Partition: IPartitionResult
  DeadmanOutput: IOutputResult
  HazmatInput: IInputResult
  HazmatOutput: IOutputResult
  PartitionNo: number
  RegionName: string
  RegionDesc: string
  OnlyMuster: number
  AntiPassbackRule: number
  AntiPassbackTime: number
  AntiTailgateRule: number
  OccupancyRule: number
  OccupancyLimit: number
  DeadmanRule: number
  DeadmanInterval: number
  DeadmanOutputNo: IOutputResult | null
  HazmatRule: number
  HazmatInputNo: IInputResult | null
  HazmatOutputNo: IOutputResult | null
  ResetDaily: number
  ResetTime: string
  DeadmanStat: number
  HazmatStat: number
}

export interface IRegionFilters {
  RegionNo: string
  RegionName: string
  Partition: ISelectOption | null
  Apply: boolean
}

export interface IRegionRouteQueryParams {
  page: number
  RegionNo: string
  RegionName: string
  PartitionValue: string | undefined
  PartitionLabel: string | undefined
}

export interface IRegionApiQueryParams extends IApiQueryParamsBase {
  RegionNo_icontains?: string
  RegionName_icontains?: string
  Partition?: string
}

export interface IRegionFormData {
  RegionName: string
  RegionDesc: string
  OnlyMuster: ISelectOption | null
  AntiPassbackRule: ISelectOption | null
  AntiPassbackTime: string
  AntiTailgateRule: ISelectOption | null
  OccupancyRule: ISelectOption | null
  OccupancyLimit: string
  DeadmanRule: ISelectOption | null
  DeadmanInterval: string
  DeadmanOutputNo: ISelectOption | null
  HazmatRule: ISelectOption | null
  HazmatInputNo: ISelectOption | null
  HazmatOutputNo: ISelectOption | null
  ResetDaily: ISelectOption | null
  ResetTime: string
  // DeadmanStat: ISelectOption | null
  // HazmatStat: ISelectOption | null
  Partition: ISelectOption | null
}

export const regionRoleOptions = [
  {
    value: '0',
    label: t`None`,
  },
  {
    value: '1',
    label: t`Soft`,
  },
  {
    value: '2',
    label: t`Hard`,
  },
]
