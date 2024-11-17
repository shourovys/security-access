import { ISelectOption } from '../../components/atomic/Selector'
import { IApiQueryParamsBase, INewElementsResult } from './common'
import { IPartitionResult } from './partition'
//
// export interface IInfoFloorResult {
//   id: number
//   partition: IPartitionResultOld
//   created_at: string
//   updated_at: string
//   name: string
//   description: string
//   node: IElementsResult[]
//   door: IElementsResult[]
//   region: IElementsResult[]
//   input: IElementsResult[]
//   output: IElementsResult[]
//   elevator: IElementsResult[]
//   relay: IElementsResult[]
//   camera: IElementsResult[]
//   nvr: IElementsResult[]
//   channel: IElementsResult[]
//   gateway: IElementsResult[]
//   logset: IElementsResult[]
//   facegate: IElementsResult[]
//   serial: IElementsResult[]
//   subnode: IElementsResult[]
//   tigger: IElementsResult[]
//   threat: IElementsResult[]
// }

export interface IFloorItemResult {
  Node: INewElementsResult[]
  Door: INewElementsResult[]
  Region: INewElementsResult[]
  Input: INewElementsResult[]
  Output: INewElementsResult[]
  Elevator: INewElementsResult[]
  Relay: INewElementsResult[]
  Camera: INewElementsResult[]
  Nvr: INewElementsResult[]
  Channel: INewElementsResult[]
  Gateway: INewElementsResult[]
  Lockset: INewElementsResult[]
  Facegate: INewElementsResult[]
  Subnode: INewElementsResult[]
  Reader: INewElementsResult[]
  ContGate: INewElementsResult[]
  ContLock: INewElementsResult[]
  Intercom: INewElementsResult[]
  Trigger: INewElementsResult[]
  Threat: INewElementsResult[]
}

// export type FloorItemType = keyof IFloorItemResult

export interface IFloorResult {
  FloorNo: number
  Items: IFloorItemResult
  PartitionNo: number
  Partition: IPartitionResult
  FloorName: string
  FloorDesc: string
  ImageFile: string
}

export type IFloorElementsType = keyof IFloorItemResult

export interface IFloorFilters {
  FloorNo: string
  FloorName: string
  Partition: ISelectOption | null
  Apply: boolean
}

export interface IFloorRouteQueryParams {
  page: number
  FloorNo: string
  FloorName: string
  PartitionValue: string | undefined
  PartitionLabel: string | undefined
}

export interface IFloorApiQueryParams extends IApiQueryParamsBase {
  FloorNo_icontains?: string
  FloorName_icontains?: string
  PartitionNo?: string
}

export interface IFloorFormData {
  FloorName: string
  FloorDesc: string
  Partition: ISelectOption | null
}

export interface IFloorInfoFormData extends IFloorFormData {
  Node: INewElementsResult[]
  Door: INewElementsResult[]
  Region: INewElementsResult[]
  Input: INewElementsResult[]
  Output: INewElementsResult[]
  Elevator: INewElementsResult[]
  Relay: INewElementsResult[]
  Camera: INewElementsResult[]
  Nvr: INewElementsResult[]
  Channel: INewElementsResult[]
  Gateway: INewElementsResult[]
  Lockset: INewElementsResult[]
  Facegate: INewElementsResult[]
  Subnode: INewElementsResult[]
  Reader: INewElementsResult[]
  ContGate: INewElementsResult[]
  ContLock: INewElementsResult[]
  Intercom: INewElementsResult[]
  Trigger: INewElementsResult[]
  Threat: INewElementsResult[]
}
