import { ISelectOption } from '../../components/atomic/Selector'
import optionsToObject from '../../utils/optionsToObject'
import { IApiQueryParamsBase } from './common'
import { ISerialResult } from './serial'
import t from '../../utils/translator'
//
// export interface ISubnodeResultOld {
//   id: number
//   created_at: string
//   updated_at: string
//   name: string
//   description: string
//   serial: ISerialResult
//   address: string
//   model: string
//   online: boolean
// }
// export interface ISubnodeFilters {
//   id: string
//   name: string
//   address: string
//   serial: ISelectOption | null
//   apply: boolean
// }
// export interface ISubnodeRouteQueryParams {
//   page: number
//   id: string
//   name: string
//   address: string
//   partitionValue: string | undefined
//   partitionLabel: string | undefined
// }
// export interface ISubnodeApiQueryParams extends IApiQueryParamsBase {
//   id_icontains?: string
//   name_icontains?: string
//   address_icontains?: string
//   serial?: string
// }
//
// export interface ISubnodeFormData {
//   name: string
//   description: string
//   serial: ISelectOption | null
//   address: string
//   model: ISelectOption | null
//   online?: boolean
// }

// export const subnodeModelOptions = [
//   { value: '1', label: t`Door 4` },
//   { value: '2', label: t`Input 8` },
//   { value: '3', label: t`Output 16` },
//   { value: '4', label: t`Elevator 1` },
//   { value: '5', label: t`Relay 32` },
// ]

// export const subnodeModelOptionsObject = optionsToObject(subnodeModelOptions)
