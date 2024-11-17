import { ISelectOption } from '../../components/atomic/Selector'
import { IPartitionResult } from '../../types/pages/partition'
import optionsToObject from '../../utils/optionsToObject'
import { IApiQueryParamsBase } from './common'
import { INodeResult } from './node'
import { IReaderResult } from './reader'
import { ISubnodeResult } from './subnode'
import t from '../../utils/translator'
import { IThreatResult } from './threat'

// export interface IElevatorResultOld {
//     id: number
//     partition: IPartitionResultOld
//     node: INodeResultOld
//     threat: IThreatResultOld
//     created_at: string
//     updated_at: string
//     name: string
//     description: string
//     relay_only: boolean
//     reader_type: string
//     threat_level: string
//     elevator_stat: number
// }

export interface IElevatorResult {
  ElevatorNo: number // Primary Key
  Partition: IPartitionResult // References Partitions->PartitionNo
  Node: INodeResult | null
  Subnode: ISubnodeResult | null
  ElevatorName: string
  ElevatorDesc: string
  NodeNo: number // References Nodes->NodeNo
  SubnodeNo: number // References Subnodes->SubnodeNo
  ElevatorPort: number // Unique (NodeNo, SubnodeNo)
  ReaderNo: number // References Readers->ReaderNo (Node)
  Reader: IReaderResult | null // References Readers->ReaderNo (Node)
  ReaderType: 0 | 1 | 2 | 3 // 0: Card or Key, 1: Card Only, 2: Key Only, 3: Card and Key
  // Threat: string // Separated by comma
  Threat: IThreatResult | null
  ThreatLevel: 1 | 2 | 3 | 4 | 5 // 1: Low, 2: Guarded, 3: Elevated, 4: High, 5: Severe
  ElevatorStat: 0 | 1 | 2 // 0: Normal, 1: Passthru, 2: Lockdown
}

export interface IElevatorFilters {
  ElevatorNo: string
  ElevatorName: string
  Partition: ISelectOption | null
  Node: ISelectOption | null
  Apply: boolean
}

export interface IElevatorRouteQueryParams {
  page: number
  ElevatorNo: string
  ElevatorName: string
  PartitionValue: string | undefined
  PartitionLabel: string | undefined
  NodeValue: string | undefined
  NodeLabel: string | undefined
}

export interface IElevatorApiQueryParams extends IApiQueryParamsBase {
  ElevatorNo_icontains?: string
  ElevatorName_icontains?: string
  PartitionNo?: string
  NodeNo?: string
}

export interface IElevatorFormData {
  ElevatorName: string
  ElevatorDesc: string
  NodeNo: string
  SubnodeNo: string
  ReaderType: ISelectOption | null
  Reader: ISelectOption | null
  ThreatLevel: ISelectOption | null
  Partition: ISelectOption | null
  Threat: ISelectOption | null
  ElevatorPort: string
}

export interface IElevatorInfoFormData extends IElevatorFormData {
  // ElevatorPort: string
  ElevatorStat: string
  NodeName: string
  SubnodeName: string
}

export interface IElevatorGroupEditFormData {
  Threat: ISelectOption | null
  ReaderType: ISelectOption | null
  ThreatLevel: ISelectOption | null
  Partition: ISelectOption | null
  // ThreatNos: string[]
}

export const readerTypeOptions = [
  {
    label: t`Card or Key`,
    value: '0',
  },
  {
    label: t`Card Only`,
    value: '1',
  },
  {
    label: t`Key Only`,
    value: '2',
  },
  {
    label: t`Card and Key`,
    value: '3',
  },
]
// export const readerTypeObject = optionsToObject(readerTypeOptions)

export const elevatorThreatLevelOptions = [
  {
    label: t`None`,
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
export const elevatorThreatLevelObject = optionsToObject(elevatorThreatLevelOptions)

export const elevatorStatTypesOptions = [
  { value: '0', label: t`Normal` },
  { value: '1', label: t`Passthru` },
  { value: '2', label: t`Lockdown` },
]
export const elevatorStatTypesObject = optionsToObject(elevatorStatTypesOptions)
