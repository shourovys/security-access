import { ISelectOption } from '../../components/atomic/Selector'
import { IPartitionResult, IPartitionResultOld } from '../../types/pages/partition'
import optionsToObject from '../../utils/optionsToObject'
import { IApiQueryParamsBase } from './common'
import { IInputResult } from './input'
import { INodeResult } from './node'
import { ISubnodeResult } from './subnode'
import t from '../../utils/translator'

export interface IOutputResultOld {
  id: number
  partition: IPartitionResultOld
  // node: INodeResultOld;
  created_at: string
  updated_at: string
  name: string
  description: string
  port: number
  type: number
  stat: number
  on_time: number
  off_time: number
  repeat: number
  output_stat: number
}

export interface IOutputResult {
  OutputNo: number
  Partition: IPartitionResult
  Node: INodeResult | null
  Subnode: ISubnodeResult
  Input?: IInputResult
  PartitionNo: number
  OutputName: string
  OutputDesc: string
  NodeNo: number
  SubnodeNo: number
  OutputPort: number
  FollowInput: number
  InputNo: number
  OutputType: number
  OnTime: number
  OffTime: number
  Repeat: number
  OutputStat: number
}

export interface IOutputFilters {
  OutputNo: string
  OutputName: string
  Partition: ISelectOption | null
  Node: ISelectOption | null
  Apply: boolean
}

export interface IOutputRouteQueryParams {
  page: number
  OutputNo: string
  OutputName: string
  PartitionValue: string | undefined
  PartitionLabel: string | undefined
  NodeValue: string | undefined
  NodeLabel: string | undefined
}

export interface IOutputApiQueryParams extends IApiQueryParamsBase {
  NodeNo?: string
  PartitionNo?: string
  OutputName_icontains?: string
  OutputNo_icontains?: string
}

export interface IOutputFormData {
  Partition: ISelectOption | null
  OutputName: string
  OutputDesc: string
  Node: ISelectOption | null
  SubnodeName: string
  OutputPort: string
  FollowInput: ISelectOption | null
  Input: ISelectOption | null
  OutputType: ISelectOption | null
  OnTime: string
  OffTime: string
  Repeat: string
  OutputStat: ISelectOption | null
}

export interface IOutputEditFormData {
  Partition: ISelectOption | null
  Node: ISelectOption | null
  OutputName: string
  OutputDesc: string
  FollowInput: ISelectOption | null
  Input: ISelectOption | null
  OutputType: ISelectOption | null
  OnTime: string
  OffTime: string
  Repeat: string
}

export interface IOutputGroupEditFormData {
  Partition: ISelectOption | null
  OutputType: ISelectOption | null
  OnTime: string
  OffTime: string
  Repeat: string
}

export const outputTypeOptions = [
  {
    value: '0',
    label: t`Normal`,
  },
  {
    value: '1',
    label: t`Energized`,
  },
]
export const outputTypeObject = optionsToObject(outputTypeOptions)

export const outputStatOptions = [
  {
    value: '0',
    label: t`Inactive`,
  },
  {
    value: '1',
    label: t`Active`,
  },
]
export const outputStatObject = optionsToObject(outputStatOptions)
