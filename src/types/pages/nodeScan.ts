import { ISelectOption } from '../../components/atomic/Selector'
import { INetworkResult } from './network'
import { ISystemEditFormData, ISystemResult } from './system'
import { ITimeResult } from './time'
import t from '../../utils/translator'

export interface INodeScanResult {
  Mac: string
  NodeType: string
  Elevator: string
  Product: string
  Model: string
  Type: string
  Licensed: string
  Address: string
  Timezone: string
  Version: string
}

export interface INodeScanLicenseResult {
  Mac: string
  Key: string
  NodeType: string
  Elevator: string
  Product: string
  Model: string
  Type: string
}

export type INodeScanSystemResult = Pick<ISystemResult, 'Name' | 'BackupMedia' | 'RecordMedia'>

export interface INodeScanFormData {
  UserId: string
  Password: string
}

export interface IModalData {
  Network: INetworkResult | null
  License: INodeScanLicenseResult | null
  System: INodeScanSystemResult | null
  Time: ITimeResult | null
}

export interface INodeScanLicenseFormData {
  Key: string
  NodeType: ISelectOption
  Elevator: ISelectOption | null
  Mac: string
  Product: string
  Model: string
  Type: string
}

export type INodeScanSystemFormData = Omit<ISystemEditFormData, 'No' | 'BoardCount'>

export type IMaintenanceValue = 'reboot' | 'update' | 'default'
export interface INodeScanUpdateFormData {
  Type: string
}

export const nodeScanUpdateTypeOptions = [
  { label: t`Lite Update`, value: '0' },
  { label: t`Full Update`, value: '1' },
]

export const nodeScanDefaultTypeOptions = [
  { label: t`Factory Default`, value: '0' },
  { label: t`Default`, value: '1' },
  { label: t`LogReset`, value: '2' },
]

export const nodeScanRebootTypeOptions = [
  { label: t`Save Data and Reboot`, value: '0' },
  { label: t`Reboot without Saving Data`, value: '1' },
]
