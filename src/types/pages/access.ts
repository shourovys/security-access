import { ISelectOption } from '../../components/atomic/Selector'
import { IGroupElementResult } from '../../types/hooks/selectData'
import t from '../../utils/translator'
import { IApiQueryParamsBase, INewElementsResult } from './common'
import { IGroupResultOld } from './group'
import { IPartitionResult, IPartitionResultOld } from './partition'
import { IScheduleResult, IScheduleResultOld } from './schedule'

// export type IDeviceTypeName = 'doors' | 'relays' | 'lock-sets' | 'face-gates'

export interface IAccessResultOld {
  id: number
  created_at: string
  updated_at: string
  name: string
  description: string
  select_type: string
  device_type: string
  partition: IPartitionResultOld
  schedule: IScheduleResultOld
  devices: {
    data: {
      id: number
    }
  }[]
  groups: IGroupResultOld[]
}

export interface IAccessResult {
  AccessNo: number // Primary Key
  Partition: IPartitionResult
  Schedule: IScheduleResult | null
  AccessType: number // 2: Door, 7: Relay, 12: Lockset, 13: Facegate, 17: ContLock
  DeviceSelect: number // 0: Individual, 1: Group
  Devices: INewElementsResult[] | null
  Groups: IGroupElementResult[] | null
  AccessName: string
  AccessDesc: string
}

export interface IAccessFilters {
  AccessNo: string
  AccessName: string
  Partition: ISelectOption | null
  DeviceType: ISelectOption | null
  Apply: boolean
}

export interface IAccessApiQueryParams extends IApiQueryParamsBase {
  AccessNo_icontains?: string
  AccessName_icontains?: string
  PartitionNo?: string
  AccessType?: string
}

export interface IAccessFormData {
  Partition: ISelectOption | null
  AccessName: string
  AccessDesc: string
  Schedule: ISelectOption | null
  DeviceType: ISelectOption | null
  DeviceSelect: ISelectOption | null
  DeviceIds: string[]
  GroupIds: string[]
}

export interface IAccessInfoFormData extends IAccessFormData {
  Devices: INewElementsResult[] | null
  Groups: IGroupElementResult[] | null
}

export interface IAccessDeviceTypes {
  Door: '2'
  Relay: '7'
  Lockset: '12'
  Facegate: '13'
  ContLock: '17'
  Intercom: '18'
}

export const accessDeviceTypes: { value: string; label: string }[] = [
  { value: '2', label: t('Door') },
  { value: '7', label: t('Relay') },
  { value: '12', label: t('Lockset') },
  { value: '13', label: t('Facegate') },
  { value: '17', label: t('ContLock') },
  { value: '18', label: t('Intercom') },
]
