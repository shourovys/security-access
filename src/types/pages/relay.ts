import { ISelectOption } from '../../components/atomic/Selector'
import { IPartitionResult } from '../../types/pages/partition'
import optionsToObject from '../../utils/optionsToObject'
import { IApiQueryParamsBase } from './common'
import { IElevatorResult } from './elevator'
import { INodeResult } from './node'
import { ISubnodeResult } from './subnode'
import t from '../../utils/translator'

export interface IRelayResult {
  RelayNo: number // Primary Key
  Partition: IPartitionResult // References Partitions->PartitionNo
  Node: INodeResult | null
  Subnode: ISubnodeResult | null
  Elevator: IElevatorResult | null
  PartitionNo: number
  RelayName: string
  RelayDesc: string
  NodeNo: number
  SubnodeNo: number
  RelayPort: number // Unique (NodeNo, SubnodeNo,)
  ElevatorNo: number // References Elevators->ElevatorNo(Node)
  RelayType: 0 | 1 // 0: Normal, 1: Energized
  OnTime: number // Validate: 0~65535
  OffTime: number // Validate: 0~65535
  Repeat: number // Validate: 1~65535
  RelayStat: 0 | 1 // 0: Inactive, 1: Active
}

export interface IRelayFilters {
  RelayNo: string
  RelayName: string
  Partition: ISelectOption | null
  Node: ISelectOption | null
  Elevator: ISelectOption | null
  Apply: boolean
}

// export interface IRelayRouteQueryParams {
//   page: number
//   RelayNo: string
//   RelayName: string
//   PartitionValue: string | undefined
//   PartitionLabel: string | undefined
//   NodeValue: string | undefined
//   NodeLabel: string | undefined
//   ElevatorValue: string | undefined
//   ElevatorLabel: string | undefined
// }

export interface IRelayApiQueryParams extends IApiQueryParamsBase {
  RelayNo?: string
  RelayName_icontains?: string
  PartitionNo?: string
  NodeNo?: string
  ElevatorNo?: string
}

export interface IRelayFormData {
  // Node: ISelectOption | null
  Partition: ISelectOption | null
  RelayName: string
  RelayDesc: string
  NodeNo: string
  // RelayPort: string
  Elevator: ISelectOption | null
  RelayType: ISelectOption | null
  OnTime: string
  OffTime: string
  Repeat: string
  // RelayStat: ISelectOption | null
}

export interface IRelayInfoFormData extends IRelayFormData {
  RelayStat: ISelectOption | null
  NodeName: string
  SubnodeName: string
}

export interface IRelayGroupEditFormData {
  Partition: ISelectOption | null
  // Elevator: ISelectOption | null
  RelayType: ISelectOption | null
  OnTime: string
  OffTime: string
  Repeat: string
}

export const relayTypeOptions = [
  {
    value: '0',
    label: t`Normal`,
  },
  {
    value: '1',
    label: t`Energized`,
  },
]

export const relayTypeObject = optionsToObject(relayTypeOptions)

export const relayStatOptions = [
  {
    value: '0',
    label: t`Inactive`,
  },
  {
    value: '1',
    label: t`Active`,
  },
]

export const relayStatObject = optionsToObject(relayStatOptions)
