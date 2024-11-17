import { ISelectOption } from '../../components/atomic/Selector'
import { INodeResult, INodeResultOld } from '../../types/pages/node'
import { IPartitionResult, IPartitionResultOld } from '../../types/pages/partition'
import optionsToObject from '../../utils/optionsToObject'
import t from '../../utils/translator'
import { IChannelResult, IChannelResultOld } from './channel'
import { IApiQueryParamsBase } from './common'
import { IInputResult, IInputResultOld } from './input'
import { IOutputResult, IOutputResultOld } from './output'
import { IReaderResult } from './reader'
import { IRegionResult, IRegionResultOld } from './region'
import { ISubnodeResult } from './subnode'
import { IThreatResult, IThreatResultOld } from './threat'

export interface IDoorResultOld {
  id: number
  node: INodeResultOld
  partition: IPartitionResultOld
  in_region: IRegionResultOld | null
  out_region: IRegionResultOld | null
  threats: IThreatResultOld[]
  pair_door: IDoorResultOld | null
  channel: IChannelResultOld | null
  shunt_output: IOutputResultOld | null
  burg_output: IOutputResultOld | null
  burg_input: IInputResultOld | null
  burg_zone_input: IInputResultOld | null
  occupancy_input: IInputResultOld | null
  created_at: string
  updated_at: string
  name: string
  description: string
  port: number
  in_enable: boolean
  in_type: number
  out_enable: boolean
  out_type: number
  rex_enable: boolean
  rex_type: number
  contact_enable: boolean
  contact_type: number
  propped_time: number
  ada_time: number
  lock_type: number
  relock_on_open_enable: boolean
  unlock_time: number
  extended_unlock_enable: boolean
  ex_unlock_time: number
  threat_level: number
  threat_ignore_rex_enable: boolean
  pair_door_enable: boolean
  channel_enable: boolean
  forced_enable: boolean
  propped_enable: boolean
  alert_output: IOutputResultOld | null
  shunt_enable: boolean
  burg_alarm_enable: boolean
  burg_zone_enable: boolean
  occupancy_enable: boolean
  anti_passback_rule_enable: boolean
  anti_passback_type: number
  anti_passback_time: number
}

export interface IDoorResult {
  DoorNo: number
  PartitionNo: number
  Partition: IPartitionResult
  DoorName: string
  DoorDesc: string
  NodeNo: number
  Node: INodeResult
  SubnodeNo: number
  Subnode?: ISubnodeResult
  DoorPort: number
  InEnable: number
  InReaderNo: number | null
  InReader: IReaderResult | null
  InType: number | null
  InRegionNo: number | null
  InRegion: IRegionResult | null
  OutEnable: number
  OutReaderNo: number | null
  OutReader: IReaderResult | null
  OutType: number | null
  OutRegionNo: number | null
  OutRegion: IRegionResult | null
  RexEnable: number
  RexInputNo: number | null
  RexInput: IInputResult | null
  RexType: number | null
  ContactEnable: number
  ContactInputNo: number | null
  ContactInput: IInputResult | null
  ContactType: number | null
  ProppedTime: number | null
  AdaTime: number | null
  LockOutputNo: number | null
  LockOutput: IOutputResult | null
  LockType: number | null
  RelockOnOpen: number
  UnlockTime: number | null
  ExtendedUnlock: number
  ExUnlockTime: number | null
  ThreatNo: number | null
  Threat: IThreatResult | null
  ThreatLevel: number
  ThreatIgnoreRex: number
  PairDoorEnable: number
  PairDoorNo: number | null
  PairDoor: IDoorResult | null
  ChannelEnable: number
  ChannelNo: number | null
  Channel: IChannelResult | null
  ForcedEnable: number
  ProppedEnable: number
  AlertOutputNo: number | null
  AlertOutput: IOutputResult | null
  ShuntEnable: number
  ShuntOutputNo: number | null
  ShuntOutput: IOutputResult | null
  BurgAlarmEnable: number
  BurgOutputNo: number | null
  BurgOutput: IOutputResult | null
  BurgInputNo: number | null
  BurgInput: IInputResult | null
  BurgZoneEnable: number
  BurgZoneInputNo: number | null
  BurgZoneInput: IInputResult | null
  OccupancyEnable: number
  OccupancyInputNo: number | null
  OccupancyInput: IInputResult | null
  AntiPassbackRule: number
  AntiPassbackType: number
  AntiPassbackTime: number | null
  DoorStat: number
  LockStat: number
  ContactStat: number
  AlertStat: number
}

export interface IDoorFilters {
  DoorNo: string
  DoorName: string
  Partition: ISelectOption | null
  Node: ISelectOption | null
  Apply: boolean
}

export interface IDoorRouteQueryParams {
  page: number
  DoorNo: string
  DoorName: string
  PartitionValue: string | undefined
  PartitionLabel: string | undefined
  NodeValue: string | undefined
  NodeLabel: string | undefined
}

export interface IDoorApiQueryParams extends IApiQueryParamsBase {
  DoorNo_icontains?: string
  DoorName_icontains?: string
  Partition?: string
  Node?: string
}

export interface IDoorAddFormData {
  Partition: ISelectOption | null
  Node: ISelectOption | null
  DoorName: string
  DoorDesc: string
  DoorPort: string
}

export interface IDoorFormData {
  SubnodeNo: string
  NodeNo: string
  Partition: ISelectOption | null
  InRegion: ISelectOption | null
  OutRegion: ISelectOption | null
  Threat: ISelectOption | null
  PairDoor: ISelectOption | null
  Channel: ISelectOption | null
  ShuntOutput: ISelectOption | null
  BurgOutput: ISelectOption | null
  BurgInput: ISelectOption | null
  BurgZoneInput: ISelectOption | null
  OccupancyInput: ISelectOption | null
  DoorName: string
  DoorDesc: string
  InEnable: ISelectOption | null
  InType: ISelectOption | null
  OutEnable: ISelectOption | null
  OutType: ISelectOption | null
  RexEnable: ISelectOption | null
  RexType: ISelectOption | null
  ContactEnable: ISelectOption | null
  ContactType: ISelectOption | null
  ProppedTime: string
  AdaTime: string
  LockType: ISelectOption | null
  RelockOnOpen: ISelectOption | null
  UnlockTime: string
  ExtendedUnlock: ISelectOption | null
  ExUnlockTime: string
  ThreatLevel: ISelectOption | null
  ThreatIgnoreRex: ISelectOption | null
  PairDoorEnable: ISelectOption | null
  ChannelEnable: ISelectOption | null
  ForcedEnable: ISelectOption | null
  ProppedEnable: ISelectOption | null
  AlertOutput: ISelectOption | null
  ShuntEnable: ISelectOption | null
  BurgAlarmEnable: ISelectOption | null
  BurgZoneEnable: ISelectOption | null
  OccupancyEnable: ISelectOption | null
  AntiPassbackRule: ISelectOption | null
  AntiPassbackType: ISelectOption | null
  AntiPassbackTime: string

  InReader: ISelectOption | null // reader option
  //   InReaderNo	In Reader No
  // Validate	Integer	Readers->ReaderNo (Node)
  // Hide ifInEnable=0
  // Hide ifSubnodeNo!=0
  // Hide if no Readers

  OutReader: ISelectOption | null // reader option
  //   Readers->ReaderNo (Node)
  // Hide ifOutEnable=0
  // Hide ifSubnodeNo!=0
  // Hide if no Readers

  RexInput: ISelectOption | null
  //   RexInputNo	RexInputNo
  // Validate	Integer	Inputs->InputNo (Node)
  // Hide ifRexEnable=0
  // Hide ifSubnodeNo=0

  LockOutput: ISelectOption | null
  // LockOutputNo	LockOutputNo
  // Validate	Integer	Outputs->OutputNo (Node)
  // Hide ifSubnodeNo=0

  ContactInput: ISelectOption | null
  //   ContactInputNo	ContactInputNo
  // Validate	Integer	Inputs->InputNo (Node)
  // Hide ifContactEnable=0
  // Hide ifSubnodeNo=0
}

export interface IDoorGroupEditFormData {
  Threat: ISelectOption | null
  Partition: ISelectOption | null
  InEnable: ISelectOption | null
  InType: ISelectOption | null
  OutEnable: ISelectOption | null
  OutType: ISelectOption | null
  ContactEnable: ISelectOption | null
  ContactType: ISelectOption | null
  ProppedTime: string
  AdaTime: string
  RexEnable: ISelectOption | null
  RexType: ISelectOption | null
  LockType: ISelectOption | null
  RelockOnOpen: ISelectOption | null
  UnlockTime: string
  ExtendedUnlock: ISelectOption | null
  ExUnlockTime: string
  // ThreatNo: string[]
  ThreatLevel: ISelectOption | null
  ThreatIgnoreRex: ISelectOption | null
}

export interface IDoorInfoFormData extends IDoorFormData {
  NodeName: string
  SubnodeName: string
  DoorPort: string
  DoorStat: string
  LockStat: string
  ContactStat: string
  AlertStat: string
}

export const doorLockTypeOption = [
  {
    label: t`Normal`,
    value: '0',
  },
  {
    label: t`Energized`,
    value: '1',
  },
]

export const doorReaderTypeOption = [
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

export const doorRexAndContactTypeOption = [
  {
    label: t`NO Unsupervised`,
    value: '0',
  },
  {
    label: t`NO Series Resistor`,
    value: '1',
  },
  {
    label: t`NO Parallel Resistor`,
    value: '2',
  },
  {
    label: t`NC Unsupervised`,
    value: '3',
  },
  {
    label: t`NC Series Resistor`,
    value: '4',
  },
  {
    label: t`NC Parallel Resistor`,
    value: '5',
  },
]

export const doorThreatLevelOption = [
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

export const doorAntiPassTypeOption = [
  {
    label: t`Time`,
    value: '0',
  },
  {
    label: t`Room`,
    value: '1',
  },
]

const doorStatOptions = [
  {
    label: t`Normal`,
    value: '0',
  },
  {
    label: t`Passthru`,
    value: '1',
  },
  {
    label: t`Lockdown`,
    value: '2',
  },
  {
    label: t`Lockdown with Rex`,
    value: '3',
  },
]
export const doorStatObject = optionsToObject(doorStatOptions)

const doorLockStatOptions = [
  {
    label: t`Locked`,
    value: '0',
  },
  {
    label: t`Unlocked`,
    value: '1',
  },
]
export const doorLockStatObject = optionsToObject(doorLockStatOptions)

const doorContactStatOptions = [
  {
    label: t`Close`,
    value: '0',
  },
  {
    label: t`Open`,
    value: '1',
  },
  {
    label: t`Trouble`,
    value: '2',
  },
]
export const doorContactStatObject = optionsToObject(doorContactStatOptions)

const doorAlertStatOptions = [
  {
    label: t`None`,
    value: '0',
  },
  {
    label: t`Forced Open`,
    value: '1',
  },
  {
    label: t`Propped Open`,
    value: '2',
  },
]
export const doorAlertStatObject = optionsToObject(doorAlertStatOptions)
