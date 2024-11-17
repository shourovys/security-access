import { ISelectOption } from '../../components/atomic/Selector'
import { IApiQueryParamsBase } from './common'
import { INodeResultOld } from './node'
import t from '../../utils/translator'

export interface ISerialResult {
  id: number
  node: INodeResultOld
  created_at: string
  updated_at: string
  name: string
  description: string
  device: string
  band_rate: number
  data_bit: number
  stop_bit: number
  parity: string
  protocol: string
}

export interface ISerialFilters {
  id: string
  name: string
  node: ISelectOption | null
  device: string
  apply: boolean
}
export interface ISerialRouteQueryParams {
  page: number
  id: string
  name: string
  device: string
  nodeValue: string | undefined
  nodeLabel: string | undefined
}
export interface ISerialApiQueryParams extends IApiQueryParamsBase {
  id_icontains?: string
  name_icontains?: string
  device_icontains?: string
  node?: string
}

export interface ISerialFormData {
  node: ISelectOption | null
  name: string
  device: string
  description: string
  band_rate: string
  data_bit: string
  stop_bit: string
  parity: ISelectOption | null
  protocol: ISelectOption | null
}

export const serialProtocolOptions = [{ value: 'osdp_v2', label: t`OSDP V2` }]
