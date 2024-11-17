import { ISelectOption } from '../../components/atomic/Selector'
import { IApiQueryParamsBase } from './common'
import { INodeResult } from './node'
import { ISubnodeResult } from './subnode'

export interface IReaderResult {
  ReaderNo: number
  ReaderName: string
  ReaderDesc: string
  NodeNo: number
  Node: INodeResult
  SubnodeNo: number
  Subnode: ISubnodeResult
  ReaderPort: number
}

export interface IReaderFilters {
  ReaderNo: string
  ReaderName: string
  Node: ISelectOption | null
  Apply: boolean
}

export interface IReaderRouteQueryParams {
  page: number
  ReaderNo: string
  ReaderName: string
  NodeValue: string | undefined
  NodeLabel: string | undefined
}

export interface IReaderApiQueryParams extends IApiQueryParamsBase {
  ReaderNo_icontains?: string
  ReaderName_icontains?: string
  NodeNo?: string
}

export interface IReaderFormData {
  ReaderName: string
  ReaderDesc: string
}

export interface IReaderInfoFormData {
  ReaderName: string
  ReaderDesc: string
  Node: ISelectOption | null
  Subnode: ISelectOption | null
  ReaderPort: string
}
