import { ISelectOption } from '../../components/atomic/Selector'
import { IApiQueryParamsBase } from './common'
import { INodeResult } from './node'

export interface IGatewayResult {
  GatewayNo: number // Primary Key
  GatewayName: string
  GatewayDesc: string
  Node: INodeResult // Nodes -> NodeNo
  NodeNo: number // Nodes -> NodeNo
  IpAddress: string
  ApiPort: number
  UserId: string
  Password: string
  Online: 0 | 1 // 0: No, 1: Yes
}

export interface IGatewayFilters {
  GatewayNo: string
  GatewayName: string
  Node: ISelectOption | null
  IpAddress: string
  Apply: boolean
}

export interface IGatewayRouteQueryParams {
  page: number
  GatewayNo: string
  GatewayName: string
  NodeValue: string | undefined
  NodeLabel: string | undefined
  IpAddress: string
}

export interface IGatewayApiQueryParams extends IApiQueryParamsBase {
  GatewayNo_icontains?: string
  GatewayName_icontains?: string
  NodeNo?: string
  IpAddress?: string
}

export interface IGatewayFormData {
  Node: ISelectOption | null
  UserId: string
  IpAddress: string
  ApiPort: string
  GatewayName: string
  GatewayDesc: string
  Password: string
  Online?: string
}

export interface INewCredentialResult {
  credentials: {
    usr: string
    pwd: string
  }
}

export type IGatewayNewCredentialFormData = Pick<IGatewayFormData, 'UserId' | 'Password'>
