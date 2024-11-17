import { ISelectOption } from '../../components/atomic/Selector'
import optionsToObject from '../../utils/optionsToObject'
import { IApiQueryParamsBase, ITaskItemsResult } from './common'
import { IGroupResult } from './group'
import { IPartitionResult } from './partition'
import { IScheduleResult } from './schedule'
import t from '../../utils/translator'

// export type IDeviceTypeName = 'doors' | 'relays' | 'lock-sets' | 'face-gates'

// export type IDeviceTypeResult =
//     | IDoorResultOld[]
//     | IRelayResult[]
//     | ILocksetResult[]
//     | IIntercomResult[];

export interface ITaskElementsResult {
  TaskItemOptions: {
    value: number
    text: string
  }[]
  ActionControls: { value: number; text: string }[]
}

export interface ITaskResult {
  TaskNo: number
  PartitionNo: number
  Partition: IPartitionResult
  TaskName: string
  TaskDesc: string
  ScheduleNo: number
  Schedule: IScheduleResult
  StartOnly: 0 | 1
  ActionType: 4 | 7 | 9 | 10 | 12 | 13 | 15
  ActionCtrl: 0 | 1 | 2
  ItemSelect: 0 | 1
  TaskItems: ITaskItemsResult[] | null
  GroupItems: IGroupResult[] | null
}

export interface ITaskFilters {
  TaskNo: string
  TaskName: string
  Partition: ISelectOption | null
  ActionType: ISelectOption | null
  Apply: boolean
}

export interface ITaskRouteQueryParams {
  page: number
  TaskNo: string
  TaskName: string
  PartitionValue: string | undefined
  PartitionLabel: string | undefined
  ActionTypeValue: string | undefined
  ActionTypeLabel: string | undefined
}

export interface ITaskApiQueryParams extends IApiQueryParamsBase {
  TaskNo_icontains?: string
  TaskName_icontains?: string
  Partition?: string
  ActionType?: string
}

export interface ITaskFormData {
  Partition: ISelectOption | null
  TaskName: string
  TaskDesc: string
  StartOnly: ISelectOption | null
  Schedule: ISelectOption | null
  ActionType: ISelectOption | null
  ActionCtrl: ISelectOption | null
  ItemSelect: ISelectOption | null
  TaskItemIds: string[]
  GroupItemIds: string[]
}

export interface ITaskInfoFormData extends ITaskFormData {
  TaskItems: ITaskItemsResult[]
  GroupItems: IGroupResult[]
}

export const taskActionTypes = [
  { value: '4', label: t`Lock` },
  { value: '7', label: t('Output') },
  { value: '9', label: t`Relay` },
  { value: '10', label: t('Record') },
  { value: '12', label: t`Lockset` },
  { value: '13', label: t`Facegate` },
  { value: '15', label: t('ContLock') },
  { value: '16', label: t('Intercom') },
]

export const taskActionTypesObject = optionsToObject(taskActionTypes)

interface ITaskActionControlsWithType {
  [key: string]: ISelectOption[]
}

export const taskActionControlsWithType: ITaskActionControlsWithType = {
  '4': [
    { value: '0', label: t`Lock` },
    { value: '1', label: t('Unlock') },
    { value: '2', label: t('M-Unlock') },
  ],
  '7': [
    { value: '0', label: t('Inactive') },
    { value: '1', label: t`Active` },
    { value: '2', label: t`Auto` },
  ],
  '9': [
    { value: '0', label: t`Inactive` },
    { value: '1', label: t`Active` },
    { value: '2', label: t`Auto` },
  ],
  '10': [
    { value: '0', label: t`Record Off` },
    { value: '1', label: t('Record On') },
    { value: '2', label: t('Instant Record') },
  ],
  '12': [
    { value: '0', label: t('Lock') },
    { value: '1', label: t`Unlock` },
    { value: '2', label: t`M-Unlock` },
  ],
  '13': [
    { value: '0', label: t`Lock` },
    { value: '1', label: t('Unlock') },
    { value: '2', label: t('M-Unlock') },
  ],
  '15': [
    { value: '0', label: t`Lock` },
    { value: '1', label: t`Unlock` },
    { value: '2', label: t`M-Unlock` },
  ],
  '16': [
    { value: '0', label: t`Lock` },
    { value: '1', label: t('Unlock') },
    { value: '2', label: t('M-Unlock') },
  ],

  '18': [
    { value: '0', label: t`Lock` },
    { value: '1', label: t('Unlock') },
    { value: '2', label: t('M-Unlock') },
  ],
}
