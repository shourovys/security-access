import { ISelectOption } from '../../components/atomic/Selector'
import { IApiQueryParamsBase } from './common'
import { IPartitionResult, IPartitionResultOld } from './partition'
import t from '../../utils/translator'

export interface IThreatResultOld {
  id: number
  created_at: string
  updated_at: string
  name: string
  description: string
  partition: IPartitionResultOld
}

export interface IThreatResult {
  ThreatNo: number
  ThreatName: string
  ThreatDesc: string
  Partition: IPartitionResult
  ThreatLevel: number
}

export interface IThreatFilters {
  ThreatNo: string
  ThreatName: string
  Partition: ISelectOption | null
  Apply: boolean
}

export interface IThreatRouteQueryParams {
  page: number
  ThreatNo: string
  ThreatName: string
  PartitionValue: string | undefined
  PartitionLabel: string | undefined
}

export interface IThreatApiQueryParams extends IApiQueryParamsBase {
  ThreatNo_icontains?: string
  ThreatName_icontains?: string
  PartitionNo?: string
}

export interface IThreatFormData {
  ThreatName: string
  ThreatDesc: string
  Partition: ISelectOption | null
  ThreatLevel?: string
}

export const threatLevelOptions = [
  {
    label: t`Disabled`,
    value: '0',
  },
  {
    label: t`Low`,
    value: '1',
  },
  {
    label: t`Guarded`,
    value: '2',
  },
  {
    label: t`Elevated`,
    value: '3',
  },
  {
    label: t`High`,
    value: '4',
  },
  {
    label: t`Severe`,
    value: '5',
  },
]
// export const threatLevelObject = optionsToObject(threatLevelOptions)
