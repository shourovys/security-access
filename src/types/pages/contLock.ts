import { ISelectOption } from '../../components/atomic/Selector'
import optionsToObject from '../../utils/optionsToObject'
import { IApiQueryParamsBase } from './common'
import { IContGateResult } from './contGate'
import { IPartitionResult } from './partition'
import t from '../../utils/translator'

export interface IContLockResult {
  ContLockNo: number
  Partition: IPartitionResult
  ContGate: IContGateResult
  PartitionNo: number
  ContLockName: string
  ContLockDesc: string
  ContGateNo: number
  RfAddress: number
  LockId: string
  Online: 0 | 1
  Busy: 0 | 1
  LockStat: 0 | 1
  ContactStat: 0 | 1
}

export interface IContLockDiscoverResult {
  RFAddress: string
  LockID: string
  RSSISend: string
  RSSIRecv: string
  LockType: string
  LockStatus: string
  CodeVersion: string
  Assigned: string
}

export interface IContLockFilters {
  ContLockNo: string
  Partition: ISelectOption | null
  ContLockName: string
  ContGate: ISelectOption | null
  RfAddress: string
  Apply: boolean
}

export interface IContLockRouteQueryParams {
  page: number
  ContLockNo: string
  PartitionValue: string | undefined
  PartitionLabel: string | undefined
  ContLockName: string
  ContGateValue: string | undefined
  ContGateLabel: string | undefined
  RfAddress: string
}

export interface IContLockApiQueryParams extends IApiQueryParamsBase {
  ContLockNo_icontains?: string
  PartitionNo?: string
  ContLockName_icontains?: string
  ContGateNo?: string
  RfAddress_icontains?: string
}

export interface IContLockFormData {
  ContLockName: string
  ContLockDesc: string
  Partition: ISelectOption | null
  ContGate: ISelectOption | null
  RfAddress: string
  LockId: string
}

export interface IContLockInfoFormData extends IContLockFormData {
  Online: string
  Busy: string
  LockStat: string

  ContactStat: string
}

const contLockLockStatOptions = [
  { value: '0', label: t`Locked` },
  { value: '1', label: t`Unlocked` },
]
export const contLockLockStatObject = optionsToObject(contLockLockStatOptions)

const contLockContactStatOptions = [
  { value: '0', label: t('Close') },
  { value: '1', label: t('Open') },
]
export const contLockContactStatObject = optionsToObject(contLockContactStatOptions)
