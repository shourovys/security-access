import { ISelectOption } from '../../components/atomic/Selector'
import { IPartitionResult } from './partition'
import optionsToObject from '../../utils/optionsToObject'
import { IApiQueryParamsBase } from './common'
import { INodeResult } from './node'
import t from '../../utils/translator'

export interface IFacegateResult {
  FacegateNo: number
  Partition: IPartitionResult
  Node: INodeResult
  PartitionNo: number
  FacegateName: string
  FacegateDesc: string
  NodeNo: number
  IpAddress: string
  ApiPort: number
  UserId: string
  Password: string
  DeviceId: string
  OpenDoorWay: 0 | 1 | 2 | 3
  GateType: 0 | 1 | 2 | 3
  VerifyMode: 1 | 21 | 22 | 23
  FaceThreshold: number
  SipGateId: string
  SipPassword: string
  SipOperatorId: string
  SipDtmfLock: number
  SipIncomingCall: 0 | 1
  Online: 0 | 1
  Busy: 0 | 1
  LockStat: 0 | 1
  ContactStat: 0 | 1
}

export interface IFacegateFilters {
  FacegateNo: string
  FacegateName: string
  Partition: ISelectOption | null
  Node: ISelectOption | null
  IpAddress: string
  Apply: boolean
}

export interface IFacegateRouteQueryParams {
  page: number
  FacegateNo: string
  FacegateName: string
  IpAddress: string
  PartitionValue: string | undefined
  PartitionLabel: string | undefined
  NodeValue: string | undefined
  NodeLabel: string | undefined
}

export interface IFacegateApiQueryParams extends IApiQueryParamsBase {
  FacegateNo_icontains?: string
  FacegateName_icontains?: string
  IpAddress_icontains?: string
  PartitionNo?: string
  NodeNo?: string
}

export interface IFacegateFormData {
  FacegateName: string
  FacegateDesc: string
  Partition: ISelectOption | null
  Node: ISelectOption | null
  IpAddress: string
  ApiPort: string
  UserId: string
  Password: string
  DeviceId: string
  OpenDoorWay: ISelectOption | null
  GateType: ISelectOption | null
  VerifyMode: ISelectOption | null
  FaceThreshold: string
  SipGateId: string
  SipPassword: string
  SipOperatorId: string
  SipDtmfLock: string
  SipIncomingCall: ISelectOption | null
}

export interface IFacegateInfoFromData extends IFacegateFormData {
  Online: string
  Busy: string
  LockStat: string
  ContactStat: string
}

export const facegateOpenDoorWayOptions = [
  { value: '0', label: t('Local') },
  { value: '1', label: t('Remote') },
  // { value: '2', label: t('Local or Remote' },
  // { value: '3', label: t('Local and Remote' },
]

export const facegateGateTypeOptions = [
  { value: '0', label: t`Basic` },
  { value: '1', label: t`Facegate` },
  { value: '2', label: t`Face` },
  { value: '3', label: t('Facegate and Face') },
]

export const facegateVerifyModeOptions = [
  { value: '0', label: t`Single Factor` },
  { value: '1', label: t('Multi Factor') },
]

const facegateLockStatOptions = [
  { value: '0', label: t('Locked') },
  { value: '1', label: t('Unlocked') },
]
export const facegateLockStatObject = optionsToObject(facegateLockStatOptions)

const facegateContactStatOptions = [
  { value: '0', label: t`Close` },
  { value: '1', label: t('Open') },
]
export const facegateContactStatObject = optionsToObject(facegateContactStatOptions)
