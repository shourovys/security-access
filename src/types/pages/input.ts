import { ISelectOption } from '../../components/atomic/Selector'
import { IPartitionResult, IPartitionResultOld } from '../../types/pages/partition'
import optionsToObject from '../../utils/optionsToObject'
import t from '../../utils/translator'
import { IApiQueryParamsBase } from './common'
import { INodeResult, INodeResultOld } from './node'
import { ISubnodeResult, ISubnodeResultOld } from './subnode'

export interface IInputResultOld {
  id: number
  partition: IPartitionResultOld
  node: INodeResultOld
  sub_node: ISubnodeResultOld
  created_at: string
  updated_at: string
  name: string
  description: string
  port: number
  type: string
  stat: number
}

export interface IInputResult {
  InputNo: number
  Partition: IPartitionResult
  Node: INodeResult | null
  Subnode: ISubnodeResult
  PartitionNo: number
  InputName: string
  InputDesc: string
  NodeNo: number
  SubnodeNo: number
  InputPort: number
  InputType: number
  InputStat: number
}
export interface IInputFilters {
  InputNo: string
  InputName: string
  Partition: ISelectOption | null
  Node: ISelectOption | null
  Apply: boolean
}

export interface IInputRouteQueryParams {
  page: number
  InputNo: string
  InputName: string
  PartitionValue: string | undefined
  PartitionLabel: string | undefined
  NodeValue: string | undefined
  NodeLabel: string | undefined
}

export interface IInputApiQueryParams extends IApiQueryParamsBase {
  InputNo_icontains?: string
  InputName_icontains?: string
  PartitionNo?: string
  NodeNo?: string
}

export interface IInputFormData {
  InputName: string
  InputDesc: string
  InputPort: string
  InputType: ISelectOption | null
  InputStat: ISelectOption | null
  Partition: ISelectOption | null
  Node: ISelectOption | null
  NodeName: string
  SubnodeName: string
}

export interface IInputEditFormData {
  InputName: string
  InputDesc: string
  InputType: ISelectOption | null
  Partition: ISelectOption | null
}

export interface IInputGroupEditFormData {
  InputType: ISelectOption | null
  Partition: ISelectOption | null
}

export const inputTypeOptions = [
  {
    value: '0',
    label: t`NO Unsupervised`,
  },
  {
    value: '1',
    label: t`NO Series Resistor`,
  },
  {
    value: '2',
    label: t`NO Parallel Resistor`,
  },
  {
    value: '3',
    label: t`NC Unsupervised`,
  },
  {
    value: '4',
    label: t`NC Series Resistor`,
  },
  {
    value: '5',
    label: t`NC Parallel Resistor`,
  },
]

export const inputTypeObject = optionsToObject(inputTypeOptions)

export const inputStatOptions = [
  {
    value: '0',
    label: t`Inactive`,
  },
  {
    value: '1',
    label: t`Active`,
  },
  {
    value: '2',
    label: t`Trouble`,
  },
]

export const inputStatObject = optionsToObject(inputStatOptions)
