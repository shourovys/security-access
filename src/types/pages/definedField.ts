import { ISelectOption } from '../../components/atomic/Selector'
import { IApiQueryParamsBase } from './common'

export interface IDefinedFieldResult {
  FieldNo: number // 1-20
  FieldName: string // Unique
  FieldEnable: number // 0: No, 1: Yes
  ListEnable: number // 0: No, 1: Yes
  FilterEnable: number // 0: No, 1: Yes
}
export interface IDefinedFieldFilters {
  FieldNo: string
  FieldName: string
  Apply: boolean
}

// export interface IDefinedFieldRouteQueryParams {
//   page: number
//   FieldNo: string
//   FieldName: string
// }

export interface IDefinedFieldApiQueryParams extends IApiQueryParamsBase {
  FieldNo_icontains?: string
  FieldName_icontains?: string
}

export interface IDefinedFieldFormData {
  FieldNo: string
  FieldName: string
  FieldEnable: ISelectOption | null
  ListEnable: ISelectOption | null
  FilterEnable: ISelectOption | null
}
