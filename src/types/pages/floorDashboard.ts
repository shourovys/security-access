import { ISelectOption } from '../../components/atomic/Selector'
import { ILogResult } from './log'

export interface IBaseItem {
  No: number
  FloorItemNo: number
  Name: string
  PositionX: number
  PositionY: number
  Status: number // 1 = color green, or gray
  Alert: number // use worning iocn
}

interface IFloorDoorResult extends IBaseItem {
  LockStat: 0 | 1 // 0: Inactive (Locked), 1: Active (Unlocked)
  ContactStat: 0 | 1 | 2 //0: Inactive (Close), 1: Active (Open), 2: Trouble
  AlertStat: 0 | 1 | 2 // 0: None, 1: Forced Open, 2: Propped Open
  NodeStat: 0 | 1 // 0: Offline, 1: Online
}

interface IFloorNodeResult extends IBaseItem {
  PowerFaultStat: 0 | 1
  TamperStat: 0 | 1
  Online: 0 | 1
}

interface IFloorRegionResult extends IBaseItem {}

interface IFloorInputResult extends IBaseItem {}

interface IFloorOutputResult extends IBaseItem {}

interface IFloorElevatorResult extends IBaseItem {}

interface IFloorRelayResult extends IBaseItem {}

interface IFloorCameraResult extends IBaseItem {}

interface IFloorNvrResult extends IBaseItem {}

interface IFloorChannelResult extends IBaseItem {}

interface IFloorGatewayResult extends IBaseItem {}

interface IFloorLocksetResult extends IBaseItem {}

interface IFloorFacegateResult extends IBaseItem {}

interface IFloorSubnodeResult extends IBaseItem {}

interface IFloorReaderResult extends IBaseItem {}

interface IFloorContGateResult extends IBaseItem {}

interface IFloorContLockResult extends IBaseItem {}

interface IFloorIntercomResult extends IBaseItem {}

interface IFloorTriggerResult extends IBaseItem {}

interface IFloorThreatResult extends IBaseItem {}

export type IFloorDashboardValue =
  | IFloorDoorResult
  | IFloorNodeResult
  | IFloorRegionResult
  | IFloorInputResult
  | IFloorOutputResult
  | IFloorElevatorResult
  | IFloorRelayResult
  | IFloorCameraResult
  | IFloorNvrResult
  | IFloorChannelResult
  | IFloorGatewayResult
  | IFloorLocksetResult
  | IFloorFacegateResult
  | IFloorSubnodeResult
  | IFloorReaderResult
  | IFloorContGateResult
  | IFloorContLockResult
  | IFloorTriggerResult
  | IFloorThreatResult

export interface IFloorDashboardItems {
  Node: IFloorNodeResult[]
  Door: IFloorDoorResult[]
  Region: IFloorRegionResult[]
  Input: IFloorInputResult[]
  Output: IFloorOutputResult[]
  Elevator: IFloorElevatorResult[]
  Relay: IFloorRelayResult[]
  Camera: IFloorCameraResult[]
  Nvr: IFloorNvrResult[]
  Channel: IFloorChannelResult[]
  Gateway: IFloorGatewayResult[]
  Lockset: IFloorLocksetResult[]
  Facegate: IFloorFacegateResult[]
  Subnode: IFloorSubnodeResult[]
  Reader: IFloorReaderResult[]
  ContGate: IFloorContGateResult[]
  ContLock: IFloorContLockResult[]
  Intercom: IFloorIntercomResult[]
  Trigger: IFloorTriggerResult[]
  Threat: IFloorThreatResult[]
}

export interface IFloorDashboardDashboardResult {
  FloorNo: string
  FloorName: string
  ImageFile: string
  FloorDesc: string
  items: IFloorDashboardItems
}

export interface IFloorDashboardResult {
  Dashboard: IFloorDashboardDashboardResult
  Logs: ILogResult[]
  AckCount: number
}

export interface IFloorDashboardFilters {
  Floor: ISelectOption | null
  DeviceType: ISelectOption | null
  Device: ISelectOption | null
  Apply: boolean
}

// export interface IFloorDashboardRouteQueryParams {
//   page: number
//   id: string
//   name: string
//   floorValue: string | undefined
//   floorLabel: string | undefined
//   device_typeValue: string | undefined
//   device_typeLabel: string | undefined
//   deviceValue: string | undefined
//   deviceLabel: string | undefined
// }
// export interface IFloorDashboardApiQueryParams extends IApiQueryParamsBase {
//   id_icontains?: string
//   name_icontains?: string
//   floor_id?: string
//   device_type?: string
//   device_id?: string
// }

// export const floorDeviceTypes = [
//   { value: 'node', label: t`Nodes` },
//   { value: 'door', label: t('Doors' )},
//   { value: 'region', label: t`Regions` },
//   { value: 'input', label: t`Inputs` },
//   { value: 'output', label: t`Outputs` },
//   { value: 'elevator', label: t`Elevators` },
//   { value: 'relay', label: t('Relays' )},
//   { value: 'camera', label: t`Cameras` },
//   { value: 'gateway', label: t('Gateways' )},
//   { value: 'lockset', label: t('Lock Sets' )},
//   { value: 'facegate', label: t('Face Gates' )},
//   { value: 'subnode', label: t('Subnodes' )},
// ]

export interface IDragButton {
  No: number
  Type: string
  FloorItemNo: number
  No_Type: string
  Name: string
  Position: {
    x: number
    y: number
  }
  Status: number
  Alert: number
  Icon: string
}
