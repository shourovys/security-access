import { ISelectOption } from '../../components/atomic/Selector'

export interface ILiveBoxLayouts {
  [key: string]: JSX.Element
}
export type TCurrentSplit = 1 | 2 | 4

export interface ILiveDashboardResult {
  ChannelName: string
  ChannelNo: number
}

export interface ILiveDashboardFilters {
  View: ISelectOption | null
  apply: boolean
}
// export interface ILiveDashboardRouteQueryParams {
//   ViewValue: string | undefined
//   CiewLabel: string | undefined
//   vurrentSplit: string
// }
export interface ILiveDashboardApiQueryParams {
  ViewNo?: string
}
