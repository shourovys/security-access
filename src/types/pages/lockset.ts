import { ISelectOption } from '../../components/atomic/Selector'
import { IApiQueryParamsBase } from './common'
import { IGatewayResult } from './gateway'
import { IPartitionResult } from './partition'

export interface ILocksetResult {
  LocksetNo: number // Primary Key
  Partition: IPartitionResult
  Gateway: IGatewayResult | null
  PartitionNo: number
  LocksetName: string
  LocksetDesc: string
  GatewayNo: number
  LinkId: string
  Name: string
  Model: string
  DeviceId: string
  Online: 0 | 1 // 0: No, 1: Yes
  Busy: 0 | 1 // 0: No, 1: Yes
  LockStat: 0 | 1 // 0: Inactive (Locked), 1: Active (Unlocked)
  ContactStat: 0 | 1 // 0: Inactive (Close), 1: Active (Open)
}

export interface ILocksetDiscoverResult {
  linkId: string
  deviceName: string
  modelType: string
  deviceId: string
  macAddr: string
  macType: string
  linkCommStatus: string
  battV: {
    main: string
    li: string
  }
  signalQuality: string
}

export interface ILocksetFilters {
  LocksetNo: string
  LocksetName: string
  LinkId: string
  Partition: ISelectOption | null
  Gateway: ISelectOption | null
  Apply: boolean
}

export interface ILocksetRouteQueryParams {
  page: number
  LocksetNo: string
  LocksetName: string
  LinkId: string
  PartitionValue: string | undefined
  PartitionLabel: string | undefined
  GatewayValue: string | undefined
  GatewayLabel: string | undefined
}

export interface ILocksetApiQueryParams extends IApiQueryParamsBase {
  LocksetNo_icontains?: string
  LocksetName_icontains?: string
  LinkId_icontains?: string
  PartitionNo?: string
  GatewayNo?: string
}

export interface ILocksetFormData {
  Partition: ISelectOption | null
  Gateway: ISelectOption | null
  LinkId: string
  Name: string
  Model: string
  DeviceId: string
  LocksetName: string
  LocksetDesc: string
}

export interface ILocksetInfoFormData extends ILocksetFormData {
  Online: string
  Busy: string
  LockStat: string
  ContactStat: string
}
