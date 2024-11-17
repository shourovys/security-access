import { ISelectOption } from '../../components/atomic/Selector'
import { IApiQueryParamsBase } from './common'
import { INodeResult } from './node'

export interface IContGateResult {
  ContGateNo: number
  ContGateName: string
  ContGateDesc: string
  NodeNo: number
  Node: INodeResult
  MacAddress: string
  IpAddress: string
  ApiPort: number
  SecurityCode: string
  RfChannel: number
  SyncCode: string
  Online: 0 | 1
  Busy: 0 | 1
}

export interface IContGateDiscoverResult {
  MacAddress: string
  IpAddress: string
  ApiPort: string
  Ready: string
}

export interface IContGateFilters {
  ContGateNo: string
  ContGateName: string
  Node: ISelectOption | null
  MacAddress: string
  IpAddress: string
  Apply: boolean
}

export interface IContGateRouteQueryParams {
  page: number
  ContGateNo: string
  ContGateName: string
  NodeValue: string | undefined
  NodeLabel: string | undefined
  MacAddress: string
  IpAddress: string
}

export interface IContGateApiQueryParams extends IApiQueryParamsBase {
  ContGateNo_icontains?: string
  ContGateName_icontains?: string
  NodeNo?: string
  MacAddress_icontains?: string
  IpAddress_icontains?: string
}

export interface IContGateFormData {
  ContGateName: string
  ContGateDesc: string
  Node: ISelectOption | null
  MacAddress: string
  IpAddress: string
  ApiPort: string
  SecurityCode: string
  RfChannel: string
  SyncCode: string
}

export interface IContGateInfoFormData extends IContGateFormData {
  Online: string
  Busy: string
}
