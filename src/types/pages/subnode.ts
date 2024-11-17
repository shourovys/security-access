import { ISelectOption } from '../../components/atomic/Selector'
import optionsToObject from '../../utils/optionsToObject'
import { IApiQueryParamsBase } from './common'
import { INodeResult } from './node'
import { ISerialResult } from './serial'
import t from '../../utils/translator'

export interface ISubnodeResultOld {
  id: number
  created_at: string
  updated_at: string
  name: string
  description: string
  serial: ISerialResult
  address: string
  model: string
  online: boolean
}

export interface ISubnodeResult {
  SubnodeNo: number
  Node: INodeResult
  SubnodeName: string
  SubnodeDesc: string
  NodeNo: number
  Address: number
  Device: string
  Baudrate: number
  DeviceType: number
  PortCount: number
  Online: 0 | 1
}
export interface ISubnodeFilters {
  SubnodeNo: string
  SubnodeName: string
  Node: ISelectOption | null
  Address: string
  Apply: boolean
}

export interface ISubnodeRouteQueryParams {
  page: number
  SubnodeNo: string
  SubnodeName: string
  Address: string
  NodeValue: string | undefined
  NodeLabel: string | undefined
}

export interface ISubnodeApiQueryParams extends IApiQueryParamsBase {
  SubnodeNo_icontains?: string
  SubnodeName_icontains?: string
  Address_icontains?: string
  NodeNo?: string
}

export interface ISubnodeFormData {
  SubnodeName: string
  SubnodeDesc: string
  Node: ISelectOption | null
  Address: string
  Device: string
  Baudrate: string
  DeviceType: ISelectOption | null
  PortCount: string
  Online?: string
}

export type ISubnodeEditFormData = Pick<ISubnodeFormData, 'SubnodeName' | 'SubnodeDesc'>

export const subnodeDeviceTypeOptions = [
  { value: '2', label: t`Door` },
  { value: '4', label: t`Input` },
  { value: '5', label: t`Output` },
  { value: '6', label: t`Elevator` },
  { value: '7', label: t`Relay` },
  { value: '15', label: t`Reader` },
]

export const subnodeDeviceTypeOptionsObject = optionsToObject(subnodeDeviceTypeOptions)
