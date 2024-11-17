import { ISelectOption } from '../../components/atomic/Selector'
import { IPartitionResult } from '../../types/pages/partition'
import { IApiQueryParamsBase } from './common'
import { INodeResult } from './node'
import t from '../../utils/translator'

export interface ICameraResult {
  CameraNo: number // Primary Key
  Partition: IPartitionResult
  Node: INodeResult | null
  PartitionNo: number
  CameraName: string
  CameraDesc: string
  NodeNo: number
  CameraPort: number
  MainUrl: string
  SubUrl: string
  UserId: string
  Password: string
  PreTime: number
  PostTime: number
  MinTime: number
  MaxTime: number
  Online: 0 | 1 // 0: No, 1: Yes
  RecordStat: 0 | 1 // 0: Inactive (RecordOff), 1: Active (RecordOn)
}

export interface ICameraFilters {
  CameraNo: string
  CameraName: string
  Partition: ISelectOption | null
  Node: ISelectOption | null
  Apply: boolean
}

export interface ICameraRouteQueryParams {
  page: number
  CameraNo: string
  CameraName: string
  PartitionValue: string | undefined
  PartitionLabel: string | undefined
  NodeValue: string | undefined
  NodeLabel: string | undefined
}

export interface ICameraApiQueryParams extends IApiQueryParamsBase {
  CameraNo_icontains?: string
  CameraName_icontains?: string
  PartitionNo?: string
  NodeNo?: string
}

export interface ICameraFormData {
  Partition: ISelectOption | null
  Node: ISelectOption | null
  // User: ISelectOption | null
  CameraDesc: string
  CameraPort: string
  MainUrl: string
  SubUrl: string
  UserId: string
  Password: string
  PreTime: string
  PostTime: string
  MinTime: string
  MaxTime: string
  CameraName: string
}

export interface ICameraInfoFormData extends ICameraFormData {
  Online: ISelectOption | null
  RecordStat: ISelectOption | null
}

export interface IStreamResult {
  StreamingId: string
  StreamingUrl: string
}

export const recordStatOptions = [
  { label: t`Record Off`, value: '0' },
  { label: t`Record On`, value: '1' },
]
