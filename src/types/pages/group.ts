import { ISelectOption } from '../../components/atomic/Selector'
import t from '../../utils/translator'
import { IApiQueryParamsBase } from './common'
import { IPartitionResult, IPartitionResultOld } from './partition'

export interface IGroupResultOld {
  id: number
  partition: IPartitionResultOld
  created_at: string
  updated_at: string
  name: string
  description: string
  type: string
  group_object: {
    object: {
      id: number
    }
  }[]
}

export interface IGroupResult {
  GroupNo: number // Primary Key
  Partition: IPartitionResult // Partitions->PartitionNo
  GroupName: string
  Validate: string // Unique (PartitionNo,)
  GroupDesc: string
  GroupType: number // 2: Door, 5: Output, 7: Relay, 8: Camera, 12: Lockset, 13: Facegate, 17: ContLock, 101: Person, 102: Access
  GroupItems: {
    Items: {
      No: number
      Name: string
    }
  }[]
}

export interface IGroupFilters {
  GroupNo: string
  GroupName: string
  Partition: ISelectOption | null
  GroupType: ISelectOption | null
  Apply: boolean
}

export interface IGroupRouteQueryParams {
  page: number
  GroupNo: string
  GroupName: string
  PartitionValue: string | undefined
  PartitionLabel: string | undefined
  GroupTypeValue: string | undefined
  GroupTypeLabel: string | undefined
}

export interface IGroupApiQueryParams extends IApiQueryParamsBase {
  GroupNo_icontains?: string
  GroupName_icontains?: string
  PartitionNo?: string
  GroupType?: string
}

export interface IGroupFormData {
  GroupName: string
  GroupDesc: string
  Partition: ISelectOption | null
  GroupType: ISelectOption | null
  GroupItemIds: string[]
}

export interface IGroupInfoFormData extends IGroupFormData {
  GroupItems: string
}

export interface IGroupTypes {
  Door: '2'
  Output: '5'
  Relay: '7'
  Camera: '8'
  Lockset: '12'
  Facegate: '13'
  ContLock: '17'
  Intercom: '18'
  Person: '101'
  Access: '102'
}

export const groupTypes: IGroupTypes = {
  Door: '2',
  Output: '5',
  Relay: '7',
  Camera: '8',
  Lockset: '12',
  Facegate: '13',
  ContLock: '17',
  Intercom: '18',
  Person: '101',
  Access: '102',
}

export const groupTypesOptions: { value: string; label: string }[] = [
  { value: '2', label: t('Door') },
  { value: '5', label: t('Output') },
  { value: '7', label: t('Relay') },
  { value: '8', label: t('Camera') },
  { value: '12', label: t('Lockset') },
  { value: '13', label: t('Facegate') },
  { value: '17', label: t('ContLock') },
  { value: '18', label: t('Intercom') },
  { value: '101', label: t('Person') },
  { value: '102', label: t('Access') },
]
